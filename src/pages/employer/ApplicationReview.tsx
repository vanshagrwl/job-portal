import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Application, applicationsAPI, jobsAPI, profileAPI, SeekerProfile, Profile, API_URL } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { ArrowLeft, Mail, Phone, MapPin, Download, Check, X, Eye, Briefcase, FileText, ExternalLink } from 'lucide-react';

export default function ApplicationReview() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [seekerProfile, setSeekerProfile] = useState<SeekerProfile | null>(null);
  const [seekerInfo, setSeekerInfo] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    if (id && token) {
      fetchApplication();
    }
  }, [id, token]);

  const fetchApplication = async () => {
    if (!id || !token) return;

    try {
      const appData = await applicationsAPI.getById(id, token);
      
      // The backend now returns both application and seeker_profile
      setApplication(appData);
      if (appData.seeker_profile) {
        setSeekerProfile(appData.seeker_profile);
      }

      // Fetch job title
      try {
        const job = await jobsAPI.getById(appData.job_id);
        setJobTitle(job.title);
      } catch (err) {
        console.error('Error fetching job:', err);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      alert('Failed to load application');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (status: 'viewed' | 'shortlisted' | 'rejected') => {
    if (!id || !token) return;

    setUpdating(true);
    try {
      await applicationsAPI.updateStatus(id, status, token);
      setApplication(prev => prev ? { ...prev, status } : null);
      alert(`Application marked as ${status}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-2xl">Application not found</div>
        </div>
      </Layout>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    viewed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    shortlisted: 'bg-green-500/20 text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">Application Review</h1>
          <p className="text-gray-400 text-sm sm:text-base">Position: {jobTitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">Status</h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${statusColors[application.status]}`}>
                    {application.status}
                  </span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Resume Section */}
            {application.resume_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Resume</span>
                  </h2>
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg p-4 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <p className="text-emerald-300 font-semibold">Resume Attached</p>
                    </motion.div>
                  </div>
                  <Button 
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all"
                    onClick={async () => {
                      try {
                        if (!token) {
                          alert('You must be logged in to download resume');
                          return;
                        }
                        
                        const filename = application.resume_url.split('/').pop();
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
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </Button>
                </GlassCard>
              </motion.div>
            )}

            {/* Seeker Information */}
            {seekerProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Briefcase className="w-5 h-5" />
                    <span>Seeker Profile</span>
                  </h2>

                  {/* Bio */}
                  {seekerProfile.bio && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm font-medium mb-1">Bio</p>
                      <p className="text-gray-200">{seekerProfile.bio}</p>
                    </div>
                  )}

                  {/* Location */}
                  {seekerProfile.location && (
                    <div className="mb-4 flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Location</p>
                        <p className="text-gray-200">{seekerProfile.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {seekerProfile.skills && seekerProfile.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm font-medium mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {seekerProfile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Application Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Application Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Applied On</p>
                    <p className="text-gray-200">
                      {application.applied_at
                        ? new Date(application.applied_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Application ID</p>
                    <p className="text-gray-200 text-sm break-all font-mono">{application._id}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  {application.status !== 'viewed' && (
                    <Button
                      onClick={() => updateApplicationStatus('viewed')}
                      disabled={updating}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Mark as Viewed</span>
                    </Button>
                  )}

                  {application.status !== 'shortlisted' && (
                    <Button
                      onClick={() => updateApplicationStatus('shortlisted')}
                      disabled={updating}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Shortlist</span>
                    </Button>
                  )}

                  {application.status !== 'rejected' && (
                    <Button
                      onClick={() => updateApplicationStatus('rejected')}
                      disabled={updating}
                      className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


