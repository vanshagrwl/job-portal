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

export const Application = mongoose.model('Application', applicationSchema);

async function findExistingApplication(seekerId: string, jobId: string) {
  const normalizedJobId = String(jobId).trim();
  const jobIdVariants: Array<string | mongoose.Types.ObjectId> = [normalizedJobId];

  if (mongoose.isValidObjectId(normalizedJobId)) {
    jobIdVariants.push(new mongoose.Types.ObjectId(normalizedJobId));
  }

  return Application.findOne({
    seeker_id: seekerId,
    job_id: { $in: jobIdVariants },
  });
}

export { findExistingApplication };
