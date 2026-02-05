import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employer_id: {
    type: String,
    required: true,
    ref: 'Profile'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  qualifications: String,
  responsibilities: String,
  salary_min: Number,
  salary_max: Number,
  location: String,
  job_type: {
    type: String,
    required: true
  },
  category: String,
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

export const Job = mongoose.model('Job', jobSchema);
