import mongoose from 'mongoose';

const employerProfileSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'Profile'
  },
  company_name: {
    type: String,
    required: true
  },
  company_logo_url: String,
  about_company: String,
  industry: String,
  company_size: String,
  website: String,
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

export const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);
