import express, { Request, Response } from 'express';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { EmployerProfile } from '../models/EmployerProfile';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all jobs
router.get('/', async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ status: 'active' });
    
    // Fetch employer profiles for each job
    const jobsWithProfiles = await Promise.all(
      jobs.map(async (job) => {
        const employerProfile = await EmployerProfile.findOne({ user_id: job.employer_id });
        return {
          ...job.toObject(),
          employer_profile: employerProfile
        };
      })
    );
    
    res.json(jobsWithProfiles);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get employer profile information
    const employerProfile = await EmployerProfile.findOne({ user_id: job.employer_id });
    
    // Return job with employer profile
    const jobWithProfile = {
      ...job.toObject(),
      employer_profile: employerProfile
    };

    res.json(jobWithProfile);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Create job (employer only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can post jobs' });
    }

    const { title, description, requirements, salary_min, salary_max, location, job_type, category } = req.body;

    const job = new Job({
      employer_id: req.userId,
      title,
      description,
      requirements,
      salary_min,
      salary_max,
      location,
      job_type,
      category
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job (employer only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employer_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(job, req.body);
    job.updated_at = new Date();
    await job.save();

    res.json(job);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Get applications for a job (employer only)
router.get('/:id/applications', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employer_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const applications = await Application.find({ job_id: req.params.id });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Delete job (employer only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employer_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete all applications for this job as well
    await Application.deleteMany({ job_id: req.params.id });

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
