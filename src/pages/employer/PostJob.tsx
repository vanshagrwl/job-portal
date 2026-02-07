import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { ArrowLeft } from 'lucide-react';

export default function PostJob() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [category, setCategory] = useState('Technology');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    setError('');
    setPosting(true);

    try {
      await jobsAPI.create({
        employer_id: user._id,
        title,
        description,
        qualifications,
        responsibilities,
        location,
        job_type: jobType,
        category,
        salary_min: salaryMin ? parseInt(salaryMin) : undefined,
        salary_max: salaryMax ? parseInt(salaryMax) : undefined,
        status: 'active',
      }, token);

      alert('Job posted successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to post job');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Post a New Job</h1>
          <p className="text-gray-400">Fill in the details to create a job posting</p>
        </div>

        <GlassCard className="p-8 overflow-visible">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <Input
              label="Job Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Qualifications
              </label>
              <textarea
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="List the key qualifications and skills required..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Responsibilities
              </label>
              <textarea
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="Describe the key responsibilities and duties..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, NY"
              />

              <Select
                label="Job Type"
                name="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </Select>
            </div>

            <div className="relative z-20">
              <Select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Technology">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Minimum Monthly Salary (INR)"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="e.g., 80000"
              />

              <Input
                label="Maximum Monthly Salary (INR)"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="e.g., 120000"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                variant="primary"
                disabled={posting}
                className="flex-1"
              >
                {posting ? 'Posting...' : 'Post Job'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </Layout>
  );
}
