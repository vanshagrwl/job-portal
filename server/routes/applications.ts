import express, { Response } from 'express';
import mongoose from 'mongoose';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { SeekerProfile } from '../models/SeekerProfile';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

async function findJobById(jobId: string) {
  const normalizedId = String(jobId).trim();
  if (!normalizedId) return null;

  if (mongoose.isValidObjectId(normalizedId)) {
    return Job.findById(normalizedId);
  }

  return Job.findOne({ _id: normalizedId });
}

// Apply for a job
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { job_id } = req.body;
    const seekerId = String(req.userId || '').trim();

    if (!seekerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (req.role !== 'seeker') {
      return res.status(403).json({ error: 'Only seekers can apply for jobs' });
    }

    if (!job_id || typeof job_id !== 'string' || !job_id.trim()) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const normalizedJobId = String(job_id).trim();
    const job = await findJobById(normalizedJobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === 'closed') {
      return res.status(400).json({ error: 'This job is no longer accepting applications' });
    }

    const storedJobId = String(job._id);
    const existingApplication = await Application.findOne({
      seeker_id: seekerId,
      job_id: { $in: [storedJobId, normalizedJobId] },
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    const seekerProfile = await SeekerProfile.findOne({ user_id: seekerId });
    const resumeUrl = seekerProfile?.resume_url?.trim() || '';

    if (!resumeUrl) {
      return res.status(400).json({
        error: 'Resume is required to apply. Please upload a resume in your profile first.',
      });
    }

    const application = new Application({
      job_id: storedJobId,
      seeker_id: seekerId,
      resume_url: resumeUrl,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err?.code === 11000) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    console.error('Apply error:', error);
    res.status(500).json({
      error: err?.message || 'Failed to apply for job',
    });
  }
});

// Get applications for employer's jobs
router.get('/employer/my-applications', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view applications' });
    }

    const jobs = await Job.find({ employer_id: req.userId });
    const jobIds = jobs.map((job) => String(job._id));

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

    const applications = await Application.find({ seeker_id: String(req.userId) });
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

    const seekerProfile = await SeekerProfile.findOne({ user_id: application.seeker_id });

    res.json({
      ...application.toObject(),
      seeker_profile: seekerProfile,
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

    const job = await findJobById(application.job_id);
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
