import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import profileRoutes from './routes/profile';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';
console.log('Connecting to MongoDB:', mongoUri.substring(0, 50) + '...');

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', mongodb: mongoose.connection.readyState === 1 });
});

// Database test
app.get('/api/test', async (req, res) => {
  try {
    const collections = await mongoose.connection.db?.listCollections().toArray();
    res.json({ status: 'ok', collections });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Seed test user
app.get('/api/seed', async (req, res) => {
  try {
    const { Profile } = await import('./models/Profile');
    const bcrypt = await import('bcryptjs');
    const { v4: uuidv4 } = await import('uuid');

    const userId = uuidv4();
    const hashedPassword = await bcrypt.default.hash('123456', 10);

    const profile = new Profile({
      _id: userId,
      email: 'test@example.com',
      password: hashedPassword,
      full_name: 'Test User',
      role: 'seeker'
    });

    await profile.save();
    res.json({ status: 'Test user created', userId, email: 'test@example.com', password: '123456' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
