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
  if (this.job_id) this.job = String(this.job_id);
  if (this.seeker_id) this.applicant = String(this.seeker_id);
  next();
});

export const Application = mongoose.model('Application', applicationSchema);

function buildSeekerApplicationFilter(seekerId: string, jobId: string) {
  const storedJobId = String(jobId).trim();
  return {
    $or: [
      { seeker_id: seekerId, job_id: storedJobId },
      { applicant: seekerId, job: storedJobId },
    ],
  };
}

async function findExistingApplication(seekerId: string, jobId: string) {
  return Application.findOne(buildSeekerApplicationFilter(seekerId, jobId));
}

async function cleanupBrokenApplications() {
  const collection = Application.collection;

  const legacyIndexes = [
    'job_1_applicant_1',
    'job_id_1_seeker_id_1',
    'job_1_applicant_1_unique',
  ];

  for (const indexName of legacyIndexes) {
    try {
      await collection.dropIndex(indexName);
      console.log('Dropped application index:', indexName);
    } catch {
      // Index may not exist
    }
  }

  try {
    await collection.dropIndex({ job: 1, applicant: 1 });
    console.log('Dropped application index: job_1_applicant_1 (by spec)');
  } catch {
    // Index may not exist
  }

  try {
    const indexes = await collection.indexes();
    for (const index of indexes) {
      const name = index.name;
      if (!name || name === '_id_') continue;

      const keys = Object.keys(index.key || {});
      const isLegacyUnique =
        index.unique &&
        ((keys.includes('job') && keys.includes('applicant')) ||
          (keys.includes('job_id') && keys.includes('seeker_id')));

      if (isLegacyUnique) {
        await collection.dropIndex(name);
        console.log('Dropped unique application index:', name);
      }
    }
  } catch (error) {
    console.warn('Could not inspect application indexes:', error);
  }

  try {
    const cleanup = await collection.deleteMany({
      $or: [
        { job: null, applicant: null },
        { job_id: null, seeker_id: null },
        { job: null, job_id: { $in: [null, ''] } },
        { applicant: null, seeker_id: { $in: [null, ''] } },
      ],
    });
    if (cleanup.deletedCount > 0) {
      console.log('Removed broken application records:', cleanup.deletedCount);
    }
  } catch (error) {
    console.warn('Could not clean broken application records:', error);
  }
}

async function migrateApplicationIndexes() {
  await cleanupBrokenApplications();
}

async function createOrUpdateApplication(
  seekerId: string,
  jobId: string,
  resumeUrl: string
) {
  const storedJobId = String(jobId).trim();
  const now = new Date();

  const application = await Application.findOneAndUpdate(
    buildSeekerApplicationFilter(seekerId, storedJobId),
    {
      $set: {
        job_id: storedJobId,
        seeker_id: seekerId,
        job: storedJobId,
        applicant: seekerId,
        resume_url: resumeUrl,
        updated_at: now,
      },
      $setOnInsert: {
        status: 'pending',
        applied_at: now,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!application) {
    throw new Error('Could not create application');
  }

  return application;
}

async function submitApplication(seekerId: string, jobId: string, resumeUrl: string) {
  try {
    return await createOrUpdateApplication(seekerId, jobId, resumeUrl);
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err?.code !== 11000) throw error;

    await cleanupBrokenApplications();
    return createOrUpdateApplication(seekerId, jobId, resumeUrl);
  }
}

export {
  findExistingApplication,
  migrateApplicationIndexes,
  submitApplication,
};
