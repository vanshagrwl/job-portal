import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Job, jobsAPI, applicationsAPI, profileAPI, SeekerProfile, API_URL } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { MapPin, Banknote, Briefcase, Building, Calendar, ArrowLeft, FileText, AlertCircle } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [seekerProfile, setSeekerProfile] = useState<SeekerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchJob();
      if (user && token) {
        checkIfApplied();
        fetchSeekerProfile();
      }
    }
  }, [id, user, token]);

  const fetchSeekerProfile = async () => {
    if (!token) return;
    try {
      const profile = await profileAPI.getSeekerProfile(token);
      setSeekerProfile(profile);
    } catch (error) {
      console.error('Error fetching seeker profile:', error);
    }
  };

  const fetchJob = async () => {
    try {
      const data = await jobsAPI.getById(id!);
      setJob(data);
      setError('');
    } catch (error: any) {
      console.error('Error fetching job:', error);
      setError(error.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!user || !id || !token) return;

    try {
      const applications = await applicationsAPI.getMyApplications(token);
      const hasAppliedToJob = applications.some(app => app.job_id === id);
      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };

  const handleApply = async () => {
    if (!user || !id || !token) return;

    if (!seekerProfile?.resume_url) {
      setError('Resume is required to apply for this job. Please upload a resume in your profile.');
      return;
    }

    setError('');
    setApplying(true);

    try {
      await applicationsAPI.apply(id, token);
      setHasApplied(true);
      alert('Application submitted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-gray-400">Loading...</div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <GlassCard className="p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Job not found</h2>
          {error && <p className="text-gray-400 mb-4">{error}</p>}
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Go back
          </Button>
        </GlassCard>
      </Layout>
    );
  }

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
          <span>Back to Jobs</span>
        </Button>

        <GlassCard className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
              <div className="flex items-center space-x-2 text-blue-400 font-medium mb-4">
                <Building className="w-5 h-5" />
                <span>{job.employer_profile?.company_name}</span>
              </div>
            </div>
            {job.employer_profile?.company_logo_url && (
              <img
                src={job.employer_profile.company_logo_url}
                alt={job.employer_profile.company_name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {job.location && (
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium">{job.location}</p>
                </div>
              </div>
            )}
            {job.job_type && (
              <div className="flex items-center space-x-2 text-gray-300">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Job Type</p>
                  <p className="text-sm font-medium">{job.job_type}</p>
                </div>
              </div>
            )}
            {job.salary_min && job.salary_max && (
              <div className="flex items-center space-x-2 text-gray-300">
                <Banknote className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="text-sm font-medium">
                    ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Posted</p>
                <p className="text-sm font-medium">{new Date(job.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Job Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.requirements && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Requirements</h2>
                <p className="text-gray-300 whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}

            {job.employer_profile?.about_company && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">About the Company</h2>
                <p className="text-gray-300 whitespace-pre-wrap">{job.employer_profile.about_company}</p>
              </div>
            )}
          </div>
        </GlassCard>

        {!hasApplied ? (
          <GlassCard className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Apply for this position</h2>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm mb-4 flex items-start space-x-2"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {!seekerProfile?.resume_url && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm mb-6 flex items-start space-x-3"
              >
                <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Resume Required</p>
                  <p className="text-xs">You need to upload a resume to apply for this job.</p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/profile')}
                    className="mt-2 text-xs !py-1 !px-3"
                  >
                    Go to Profile & Upload Resume
                  </Button>
                </div>
              </motion.div>
            )}

            {seekerProfile?.resume_url && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 text-green-400">
                    <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Resume attached</p>
                      <p className="text-xs text-green-300">{seekerProfile.resume_url.split('/').pop()}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        if (!token) {
                          alert('You must be logged in to download resume');
                          return;
                        }
                        
                        const filename = seekerProfile.resume_url.split('/').pop();
                        const encodedFilename = encodeURIComponent(filename || 'resume.pdf');
                        const downloadUrl = `${API_URL}/profile/resume/${encodedFilename}`;
                        
                        console.log('Downloading resume from:', downloadUrl);
                        console.log('Token:', token.substring(0, 20) + '...');
                        
                        const response = await fetch(downloadUrl, {
                          method: 'GET',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                          }
                        });
                        
                        console.log('Response status:', response.status);
                        console.log('Content-Type:', response.headers.get('Content-Type'));
                        console.log('Content-Length:', response.headers.get('Content-Length'));
                        
                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('Error response:', errorText);
                          throw new Error(`HTTP ${response.status}: ${errorText}`);
                        }
                        
                        const blob = await response.blob();
                        console.log('Blob received:', blob.type, blob.size, 'bytes');
                        
                        if (blob.size === 0) {
                          throw new Error('Downloaded file is empty');
                        }
                        
                        // Create blob URL and download
                        const blobUrl = URL.createObjectURL(blob);
                        const downloadLink = document.createElement('a');
                        downloadLink.href = blobUrl;
                        downloadLink.download = filename || 'resume.pdf';
                        downloadLink.style.display = 'none';
                        document.body.appendChild(downloadLink);
                        
                        // Trigger download
                        downloadLink.click();
                        
                        // Cleanup
                        setTimeout(() => {
                          document.body.removeChild(downloadLink);
                          URL.revokeObjectURL(blobUrl);
                        }, 100);
                        
                        console.log('Download completed successfully');
                      } catch (error) {
                        console.error('Error downloading resume:', error);
                        alert('Failed to download resume: ' + ((error as any)?.message || 'Unknown error'));
                      }
                    }}
                    className="text-green-400 hover:text-green-300 text-xs font-medium px-3 py-1 hover:bg-green-500/20 rounded transition-colors"
                  >
                    View
                  </button>
                </div>
              </motion.div>
            )}


            <Button
              variant="primary"
              onClick={handleApply}
              disabled={applying || !seekerProfile?.resume_url}
              className="w-full"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </Button>
          </GlassCard>
        ) : (
          <GlassCard className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Application Submitted</h2>
            <p className="text-gray-400 mb-6">You've already applied to this position</p>
            <Button variant="secondary" onClick={() => navigate('/my-applications')}>
              View My Applications
            </Button>
          </GlassCard>
        )}
      </motion.div>
    </Layout>
  );
}
