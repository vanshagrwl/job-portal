import express, { Request, Response } from 'express';
import { SeekerProfile } from '../models/SeekerProfile';
import { EmployerProfile } from '../models/EmployerProfile';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get seeker profile
router.get('/seeker', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await SeekerProfile.findOne({ user_id: req.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error: any) {
    console.error('Error fetching seeker profile:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
});

// Update seeker profile with optional file upload
router.put('/seeker', authMiddleware, upload.single('resume'), async (req: AuthRequest, res: Response) => {
  try {
    const { skills, bio, location, phone, full_name } = req.body;

    console.log('Update seeker profile request - userId:', req.userId);
    console.log('Request body:', { skills, bio, location, phone, full_name });
    console.log('File uploaded:', req.file ? { filename: req.file.filename, size: req.file.size } : 'No file');

    let profile = await SeekerProfile.findOne({ user_id: req.userId });
    
    if (!profile) {
      profile = new SeekerProfile({
        user_id: req.userId
      });
    }

    console.log('Profile before update:', profile);

    if (skills !== undefined) {
      profile.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (phone !== undefined) profile.phone = phone;
    
    // Handle file upload
    if (req.file) {
      console.log('Processing file upload:', req.file.filename);
      // Delete old resume if exists
      if (profile.resume_url) {
        const oldPath = path.join(__dirname, '../../uploads/resumes', path.basename(profile.resume_url));
        console.log('Checking for old resume at:', oldPath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log('Old resume deleted');
        }
      }
      // Store new resume URL
      profile.resume_url = `/api/profile/resume/${req.file.filename}`;
      console.log('Resume URL set to:', profile.resume_url);
    }
    
    // If full_name is provided, also update the Profile table
    if (full_name !== undefined && full_name.trim() !== '') {
      try {
        console.log('Updating full_name in Profile table to:', full_name);
        const userProfile = await Profile.findByIdAndUpdate(
          req.userId,
          { full_name: full_name.trim(), updated_at: new Date() },
          { new: true }
        );
        console.log('Profile full_name updated successfully:', userProfile?.full_name);
        if (!userProfile) {
          throw new Error('Failed to update profile');
        }
      } catch (updateError: any) {
        console.error('Error updating Profile full_name:', updateError);
        return res.status(500).json({ error: 'Failed to update name: ' + updateError.message });
      }
    }
    
    profile.updated_at = new Date();
    console.log('Seeker profile before save:', profile);
    const savedProfile = await profile.save();
    
    console.log('Seeker profile saved successfully:', savedProfile);
    const response = savedProfile.toObject ? savedProfile.toObject() : savedProfile;
    res.json(response);
  } catch (error: any) {
    console.error('Error updating seeker profile:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

// Get employer profile
router.get('/employer', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await EmployerProfile.findOne({ user_id: req.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error: any) {
    console.error('Error fetching employer profile:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
});

// Update employer profile
router.put('/employer', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { company_name, company_logo_url, about_company, industry, company_size, website, location, phone, full_name } = req.body;

    console.log('Update employer profile - userId:', req.userId);
    console.log('Request body:', { company_name, full_name });

    let profile = await EmployerProfile.findOne({ user_id: req.userId });
    
    if (!profile) {
      profile = new EmployerProfile({
        user_id: req.userId
      });
    }

    if (company_name !== undefined) profile.company_name = company_name;
    if (company_logo_url !== undefined) profile.company_logo_url = company_logo_url;
    if (about_company !== undefined) profile.about_company = about_company;
    if (industry !== undefined) profile.industry = industry;
    if (company_size !== undefined) profile.company_size = company_size;
    if (website !== undefined) profile.website = website;
    if (location !== undefined) profile.location = location;
    if (phone !== undefined) profile.phone = phone;
    
    // If full_name is provided, also update the Profile table (personal name, not company name)
    if (full_name !== undefined && full_name.trim() !== '') {
      try {
        console.log('Updating full_name in Profile table to:', full_name);
        const userProfile = await Profile.findByIdAndUpdate(
          req.userId,
          { full_name: full_name.trim(), updated_at: new Date() },
          { new: true }
        );
        console.log('Profile full_name updated successfully:', userProfile?.full_name);
        if (!userProfile) {
          throw new Error('Failed to update profile');
        }
      } catch (updateError: any) {
        console.error('Error updating Profile full_name:', updateError);
        return res.status(500).json({ error: 'Failed to update name: ' + updateError.message });
      }
    }
    
    profile.updated_at = new Date();
    const savedProfile = await profile.save();

    const response = savedProfile.toObject ? savedProfile.toObject() : savedProfile;
    res.json(response);
  } catch (error: any) {
    console.error('Error updating employer profile:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

// Download resume - authenticated access only
router.get('/resume/:filename', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    let filename = req.params.filename;
    
    // Decode the filename if it was URL-encoded
    try {
      filename = decodeURIComponent(filename);
    } catch (e) {
      console.error('Error decoding filename:', e);
      return res.status(400).json({ error: 'Invalid filename encoding' });
    }
    
    console.log('Resume download request - Raw filename:', req.params.filename);
    console.log('Resume download request - Decoded filename:', filename);
    
    // Sanitize filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      console.error('Invalid filename (contains path traversal):', filename);
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filepath = path.join(__dirname, '../../uploads/resumes', filename);
    
    console.log('Looking for file at:', filepath);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      console.error('File not found:', filepath);
      return res.status(404).json({ error: 'File not found' });
    }

    // Get the original filename from the stored filename
    const originalName = filename.split('_').slice(2).join('_');
    
    // Read file into buffer
    const fileBuffer = fs.readFileSync(filepath);
    console.log('File read successfully, size:', fileBuffer.length, 'bytes');
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (ext === '.doc') {
      contentType = 'application/msword';
    }
    
    // Send file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.send(fileBuffer);
  } catch (error: any) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ error: error.message || 'Failed to download resume' });
  }
});

export default router;
