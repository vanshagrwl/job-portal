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

// Get Current User Profile - ALWAYS fetch from MongoDB (no caching)
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('=== GET /auth/profile called ===');
    console.log('User ID from token:', req.userId);
    
    // Always fetch fresh data from MongoDB
    const profile = await Profile.findById(req.userId).lean();
    
    console.log('Profile found:', !!profile);
    console.log('Profile data:', profile);
    
    if (!profile) {
      console.log('User not found for ID:', req.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure we're returning the latest data
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update User's Full Name - DIRECT ENDPOINT
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('=== PUT /auth/profile called ===');
    console.log('User ID:', req.userId);
    console.log('Request body:', req.body);

    const { full_name } = req.body;

    if (!full_name || full_name.trim() === '') {
      console.log('Validation failed: empty full_name');
      return res.status(400).json({ error: 'Full name is required and cannot be empty' });
    }

    if (!req.userId) {
      console.log('Error: No userId in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('Attempting to update user:', req.userId, 'with name:', full_name.trim());
    
    // Use findByIdAndUpdate with upsert to ensure immediate MongoDB persistence
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.userId,
      { 
        full_name: full_name.trim(),
        updated_at: new Date()
      },
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run schema validators
      }
    );

    if (!updatedProfile) {
      console.log('ERROR: User not found after update attempt:', req.userId);
      return res.status(404).json({ error: 'User profile not found in database' });
    }

    console.log('✓ Profile updated successfully in MongoDB');
    console.log('Updated profile full_name:', updatedProfile.full_name);
    
    // Verify the write was successful by re-fetching
    const verifyProfile = await Profile.findById(req.userId);
    console.log('✓ Verification fetch - full_name in DB:', verifyProfile?.full_name);
    
    if (verifyProfile?.full_name !== full_name.trim()) {
      console.error('❌ VERIFICATION FAILED: Name did not persist!');
      return res.status(500).json({ 
        error: 'Failed to persist name change - verification failed',
        stored: verifyProfile?.full_name,
        expected: full_name.trim()
      });
    }
    
    // Disable caching to ensure client gets fresh data
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    res.json(updatedProfile);
  } catch (error: any) {
    console.error('=== PUT /auth/profile ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      error: error.message || 'Failed to update profile',
      errorType: error.name
    });
  }
});

export default router;
