import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job_id: {
    type: String,
    required: true,
    ref: 'Job',
  },
  seeker_id: {
    type: String,
    required: true,
    ref: 'Profile',
  },
  // Legacy MongoDB field names used by older deployments/indexes
  job: String,
  applicant: String,
  status: {
    type: String,
    enum: ['pending', 'viewed', 'shortlisted', 'rejected'],
    default: 'pending',
  },
  resume_url: String,
  applied_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

applicationSchema.pre('save', function syncLegacyFields(next) {
  if (this.job_id) {
    this.job = String(this.job_id);
  }
  if (this.seeker_id) {
    this.applicant = String(this.seeker_id);
  }
  next();
});

export const Application = mongoose.model('Application', applicationSchema);

function buildJobIdVariants(jobId: string) {
  const normalizedJobId = String(jobId).trim();
  const jobIdVariants: Array<string | mongoose.Types.ObjectId> = [normalizedJobId];

  if (mongoose.isValidObjectId(normalizedJobId)) {
    jobIdVariants.push(new mongoose.Types.ObjectId(normalizedJobId));
  }

  return jobIdVariants;
}

async function findExistingApplication(seekerId: string, jobId: string) {
  const jobIdVariants = buildJobIdVariants(jobId);

  return Application.findOne({
    $or: [
      { seeker_id: seekerId, job_id: { $in: jobIdVariants } },
      { applicant: seekerId, job: { $in: jobIdVariants } },
    ],
  });
}

async function migrateApplicationIndexes() {
  const collection = Application.collection;

  try {
    const indexes = await collection.indexes();
    for (const index of indexes) {
      const name = index.name;
      if (!name || name === '_id_') continue;

      const keys = Object.keys(index.key || {});
      const usesLegacyFields = keys.includes('job') && keys.includes('applicant');
      const usesNewFields = keys.includes('job_id') && keys.includes('seeker_id');

      if (usesLegacyFields || name === 'job_1_applicant_1') {
        await collection.dropIndex(name);
        console.log('Dropped legacy application index:', name);
      }

      if (usesNewFields && index.unique) {
        await collection.dropIndex(name);
        console.log('Dropped strict unique application index:', name);
      }
    }
  } catch (error) {
    console.warn('Could not inspect/drop legacy application indexes:', error);
  }

  try {
    const cleanup = await collection.deleteMany({
      $and: [
        { $or: [{ job_id: null }, { job_id: '' }, { job_id: { $exists: false } }] },
        { $or: [{ seeker_id: null }, { seeker_id: '' }, { seeker_id: { $exists: false } }] },
        { $or: [{ job: null }, { job: { $exists: false } }] },
        { $or: [{ applicant: null }, { applicant: { $exists: false } }] },
      ],
    });
    if (cleanup.deletedCount > 0) {
      console.log('Removed broken legacy application records:', cleanup.deletedCount);
    }
  } catch (error) {
    console.warn('Could not clean broken application records:', error);
  }
}

export { findExistingApplication, migrateApplicationIndexes };
