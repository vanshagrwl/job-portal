import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job_id: {
    type: String,
    required: true,
    ref: 'Job'
  },
  seeker_id: {
    type: String,
    required: true,
    ref: 'Profile'
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'shortlisted', 'rejected'],
    default: 'pending'
  },
  resume_url: String,
  applied_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

export const Application = mongoose.model('Application', applicationSchema);
