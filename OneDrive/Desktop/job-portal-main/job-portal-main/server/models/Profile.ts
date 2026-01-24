import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  _id: String,
  role: {
    type: String,
    enum: ['seeker', 'employer'],
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  password: {
    type: String,
    required: true
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

export const Profile = mongoose.model('Profile', profileSchema);
