import mongoose from 'mongoose';

const seekerProfileSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'Profile'
  },
  skills: [String],
  education: [
    {
      school: String,
      degree: String,
      field: String,
      startYear: Number,
      endYear: Number
    }
  ],
  experience: [
    {
      company: String,
      position: String,
      description: String,
      startDate: Date,
      endDate: Date
    }
  ],
  resume_url: String,
  bio: String,
  location: String,
  phone: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

export const SeekerProfile = mongoose.model('SeekerProfile', seekerProfileSchema);
