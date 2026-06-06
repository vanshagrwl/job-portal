import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const applicationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
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

applicationSchema.index({ job_id: 1, seeker_id: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
