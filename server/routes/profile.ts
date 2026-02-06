import express, { Request, Response } from 'express';
import { Profile } from '../models/Profile';
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
    console.log('GET /profile/seeker - User ID:', req.userId);
    const [profile, userProfile] = await Promise.all([
      SeekerProfile.findOne({ user_id: req.userId }),
      Profile.findById(req.userId).lean()
    ]);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Combine seeker profile with full_name from Profile collection
    const response = profile.toObject ? profile.toObject() : profile;
    if (userProfile?.full_name) {
      response.full_name = userProfile.full_name;
      console.log('✓ GET /seeker - Included full_name:', userProfile.full_name);
    }
    
    res.json(response);
  } catch (error: any) {
    console.error('Error fetching seeker profile:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
});

// Update seeker profile with optional file upload
router.put('/seeker', authMiddleware, upload.single('resume'), async (req: AuthRequest, res: Response) => {
  try {
    const { skills, bio, location, phone, full_name } = req.body;

    console.log('=== UPDATE SEEKER PROFILE ===');
    console.log('User ID:', req.userId);
    console.log('Request includes full_name:', !!full_name);

    // CRITICAL: Update full_name FIRST with verification and write concern
    let updatedFullName = null;
    if (full_name !== undefined && full_name.trim() !== '') {
      try {
        console.log('Step 1: Updating Profile.full_name to:', full_name.trim());
        
        const profileUpdate = await Profile.findByIdAndUpdate(
          req.userId,
          { 
            full_name: full_name.trim(), 
            updated_at: new Date() 
          },
          { 
            new: true,
            runValidators: true
          }
        );
        
        if (!profileUpdate) {
          throw new Error('User not found');
        }
        
        updatedFullName = profileUpdate.full_name;
        console.log('✓ Profile.full_name updated:', updatedFullName);
        
        // Wait 50ms for MongoDB to flush write
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('✓ Waited for write flush');
        
        // Verify immediately after flush
        const verify = await Profile.findById(req.userId).lean();
        if (verify?.full_name !== full_name.trim()) {
          console.error('❌ Verification FAILED - stored:', verify?.full_name, 'expected:', full_name.trim());
          throw new Error('Verification failed: name did not persist to MongoDB');
        }
        console.log('✓ Verification passed:', verify?.full_name);
        
      } catch (nameError: any) {
        console.error('❌ Full name update failed:', nameError.message);
        return res.status(500).json({ error: 'Failed to update name: ' + nameError.message });
      }
    }

    console.log('Step 2: Updating SeekerProfile...');
    
    let profile = await SeekerProfile.findOne({ user_id: req.userId });
    
    if (!profile) {
      profile = new SeekerProfile({
        user_id: req.userId
      });
    }

    if (skills !== undefined) {
      profile.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (phone !== undefined) profile.phone = phone;
    
    // Handle file upload
    if (req.file) {
      console.log('Processing file upload:', req.file.filename);
      if (profile.resume_url) {
        const oldPath = path.join(__dirname, '../../uploads/resumes', path.basename(profile.resume_url));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      profile.resume_url = `/api/profile/resume/${req.file.filename}`;
    }
    
    profile.updated_at = new Date();
    const savedProfile = await profile.save();
    
    console.log('✓ SeekerProfile saved');
    
    // Build response with verified full_name
    const response = savedProfile.toObject ? savedProfile.toObject() : savedProfile;
    
    // IMPORTANT: Always include the updated full_name in response
    if (updatedFullName) {
      response.full_name = updatedFullName;
      console.log('✓ Response includes updated full_name:', updatedFullName);
    } else {
      // If no full_name was updated in this request, fetch it from Profile to include in response
      const userProfile = await Profile.findById(req.userId).lean();
      if (userProfile?.full_name) {
        response.full_name = userProfile.full_name;
        console.log('✓ Response includes current full_name from Profile:', userProfile.full_name);
      }
    }
    
    console.log('Step 3: Sending response with full_name:', response.full_name);
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(response);
    
  } catch (error: any) {
    console.error('❌ Error updating seeker profile:', error.message);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

// Get employer profile
router.get('/employer', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('GET /profile/employer - User ID:', req.userId);
    const [profile, userProfile] = await Promise.all([
      EmployerProfile.findOne({ user_id: req.userId }),
      Profile.findById(req.userId).lean()
    ]);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Combine employer profile with full_name from Profile collection
    const response = profile.toObject ? profile.toObject() : profile;
    if (userProfile?.full_name) {
      response.full_name = userProfile.full_name;
      console.log('✓ GET /employer - Included full_name:', userProfile.full_name);
    }
    
    res.json(response);
  } catch (error: any) {
    console.error('Error fetching employer profile:', error);
    res.status(404).json({ error: 'Profile not found' });
  }
});

// Update employer profile
router.put('/employer', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { company_name, company_logo_url, about_company, industry, company_size, website, location, phone, full_name } = req.body;

    console.log('=== UPDATE EMPLOYER PROFILE ===');
    console.log('User ID:', req.userId);
    console.log('Request includes full_name:', !!full_name);

    // CRITICAL: Update full_name FIRST with verification and write concern
    let updatedFullName = null;
    if (full_name !== undefined && full_name.trim() !== '') {
      try {
        console.log('Step 1: Updating Profile.full_name to:', full_name.trim());
        
        const profileUpdate = await Profile.findByIdAndUpdate(
          req.userId,
          { 
            full_name: full_name.trim(), 
            updated_at: new Date() 
          },
          { 
            new: true,
            runValidators: true
          }
        );
        
        if (!profileUpdate) {
          throw new Error('User not found');
        }
        
        updatedFullName = profileUpdate.full_name;
        console.log('✓ Profile.full_name updated:', updatedFullName);
        
        // Wait 50ms for MongoDB to flush write
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('✓ Waited for write flush');
        
        // Verify immediately after flush
        const verify = await Profile.findById(req.userId).lean();
        if (verify?.full_name !== full_name.trim()) {
          console.error('❌ Verification FAILED - stored:', verify?.full_name, 'expected:', full_name.trim());
          throw new Error('Verification failed: name did not persist to MongoDB');
        }
        console.log('✓ Verification passed:', verify?.full_name);
        
      } catch (nameError: any) {
        console.error('❌ Full name update failed:', nameError.message);
        return res.status(500).json({ error: 'Failed to update name: ' + nameError.message });
      }
    }

    console.log('Step 2: Updating EmployerProfile...');

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
    
    profile.updated_at = new Date();
    const savedProfile = await profile.save();
    
    console.log('✓ EmployerProfile saved');

    // Build response with verified full_name
    const response = savedProfile.toObject ? savedProfile.toObject() : savedProfile;
    
    // IMPORTANT: Always include the updated full_name in response
    if (updatedFullName) {
      response.full_name = updatedFullName;
      console.log('✓ Response includes updated full_name:', updatedFullName);
    } else {
      // If no full_name was updated in this request, fetch it from Profile to include in response
      const userProfile = await Profile.findById(req.userId).lean();
      if (userProfile?.full_name) {
        response.full_name = userProfile.full_name;
        console.log('✓ Response includes current full_name from Profile:', userProfile.full_name);
      }
    }
    
    console.log('Step 3: Sending response with full_name:', response.full_name);
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(response);
    
  } catch (error: any) {
    console.error('❌ Error updating employer profile:', error.message);
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
