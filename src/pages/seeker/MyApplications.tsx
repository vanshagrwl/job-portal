import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Application, applicationsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { EmptyState } from '../../components';
import { Briefcase, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyApplications() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchApplications();
    }
  }, [user, token]);

  const fetchApplications = async () => {
    if (!user || !token) return;

    try {
      const data = await applicationsAPI.getMyApplications(token);
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'viewed':
        return 'bg-blue-500/20 text-blue-400';
      case 'shortlisted':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-rose-500/20 text-rose-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
            <p className="text-gray-400">Track the status of your job applications</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="flex justify-center py-12">
            <EmptyState 
              icon={Briefcase}
              title="No applications yet"
              description="Start applying to jobs to see them here"
              action={() => navigate('/dashboard')}
              variant="seeker"
            />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {applications.map((application) => (
              <motion.div key={application.id} variants={itemVariants}>
                <GlassCard className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {application.job?.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>
                      <p className="text-blue-400 font-medium mb-3">
                        {application.job?.employer_profile?.company_name}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                        {application.job?.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {application.job.location}
                          </div>
                        )}
                        {application.job?.job_type && (
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {application.job.job_type}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Applied {new Date(application.applied_at).toLocaleDateString()}
                        </div>
                      </div>


                    </div>

                    {application.job?.employer_profile?.company_logo_url && (
                      <img
                        src={application.job.employer_profile.company_logo_url}
                        alt={application.job.employer_profile.company_name}
                        className="w-16 h-16 rounded-lg object-cover ml-4"
                      />
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
}
