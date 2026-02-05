import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Profile } from '../models/Profile';
import { SeekerProfile } from '../models/SeekerProfile';
import { EmployerProfile } from '../models/EmployerProfile';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Sign Up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role, companyName } = req.body;
    console.log('Sign up attempt for:', email, 'role:', role);

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (role === 'employer' && !companyName) {
      return res.status(400).json({ error: 'Company name is required for employers' });
    }

    const existingUser = await Profile.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const profile = new Profile({
      _id: userId,
      email,
      password: hashedPassword,
      full_name: fullName,
      role
    });

    await profile.save();
    console.log('User created:', userId);

    if (role === 'seeker') {
      const seekerProfile = new SeekerProfile({
        user_id: userId
      });
      await seekerProfile.save();
    } else if (role === 'employer') {
      const employerProfile = new EmployerProfile({
        user_id: userId,
        company_name: companyName
      });
      await employerProfile.save();
    }

    const token = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: profile });
  } catch (error: any) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: error.message || 'Failed to sign up' });
  }
});

// Sign In
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Sign in attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const profile = await Profile.findOne({ email });
    console.log('User found:', !!profile);
    
    if (!profile) {
      return res.status(401).json({ error: 'User not found. Please sign up first.' });
    }

    const passwordMatch = await bcrypt.compare(password, profile.password);
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: profile._id, role: profile.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: profile });
  } catch (error: any) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: error.message || 'Failed to sign in' });
  }
});

// Get Current User Profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findById(req.userId);
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
