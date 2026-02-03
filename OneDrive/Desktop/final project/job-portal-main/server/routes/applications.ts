import express, { Request, Response } from 'express';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { SeekerProfile } from '../models/SeekerProfile';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Apply for a job
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { job_id } = req.body;

    if (req.role !== 'seeker') {
      return res.status(403).json({ error: 'Only seekers can apply for jobs' });
    }

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job_id,
      seeker_id: req.userId
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    // Fetch seeker's resume from their profile
    const seekerProfile = await SeekerProfile.findOne({ user_id: req.userId });
    const resumeUrl = seekerProfile?.resume_url || '';

    const application = new Application({
      job_id,
      seeker_id: req.userId,
      resume_url: resumeUrl
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ error: 'Failed to apply for job' });
  }
});

// Get applications for employer's jobs
router.get('/employer/my-applications', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view applications' });
    }

    // Get all jobs for this employer
    const jobs = await Job.find({ employer_id: req.userId });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ job_id: { $in: jobIds } });
    res.json(applications);
  } catch (error) {
    console.error('Get employer applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get my applications
router.get('/my-applications', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.role !== 'seeker') {
      return res.status(403).json({ error: 'Only seekers can view applications' });
    }

    const applications = await Application.find({ seeker_id: req.userId });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get single application with seeker profile
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Fetch seeker profile data for the employer to see
    const seekerProfile = await SeekerProfile.findOne({ user_id: application.seeker_id });

    res.json({
      ...application.toObject(),
      seeker_profile: seekerProfile
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Update application status
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const job = await Job.findById(application.job_id);
    if (job?.employer_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    application.status = status;
    application.updated_at = new Date();
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

export default router;
