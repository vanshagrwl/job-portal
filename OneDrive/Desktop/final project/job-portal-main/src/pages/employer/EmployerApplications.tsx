import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Application, applicationsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { ArrowLeft, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function EmployerApplications() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (token) {
      fetchApplications();
      // Poll every 5 seconds
      const interval = setInterval(() => {
        fetchApplications();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchApplications = async () => {
    if (!token) return;

    try {
      const apps = await applicationsAPI.getEmployerApplications(token);
      setApplications(apps || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    viewed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    shortlisted: 'bg-green-500/20 text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    viewed: <Eye className="w-4 h-4" />,
    shortlisted: <CheckCircle className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />,
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
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

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">All Applications</h1>
          <p className="text-gray-400 text-sm sm:text-base">Total: {applications.length} applications</p>
        </motion.div>

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Pending ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('viewed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'viewed'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Viewed ({applications.filter(a => a.status === 'viewed').length})
          </button>
          <button
            onClick={() => setStatusFilter('shortlisted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'shortlisted'
                ? 'bg-green-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Shortlisted ({applications.filter(a => a.status === 'shortlisted').length})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Rejected ({applications.filter(a => a.status === 'rejected').length})
          </button>
        </motion.div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-8 text-center">
              <p className="text-gray-400 mb-4">No applications found</p>
              <Link to="/dashboard">
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredApplications.map((application) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center space-x-1 ${statusColors[application.status]}`}>
                          {statusIcons[application.status]}
                          <span>{application.status}</span>
                        </span>
                      </div>
                      <p className="text-white font-medium">Application ID: {application._id}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Applied on {new Date(application.applied_at).toLocaleDateString()}
                      </p>

                    </div>
                    <Link to={`/applications/${application._id}`}>
                      <Button variant="primary" className="ml-4">
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
