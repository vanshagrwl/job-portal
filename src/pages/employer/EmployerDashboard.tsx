import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Job, Application, jobsAPI, applicationsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import LoadingSkeletonCard from '../../components/LoadingSkeletonCard';
import { Plus, Briefcase, Users, Eye, TrendingUp, MapPin } from 'lucide-react';
import ProfileCompletion from '../../components/ProfileCompletion';

export default function EmployerDashboard() {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const isFirstAppsLoad = useRef(true);

  useEffect(() => {
    if (user && token) {
      fetchJobs();
      fetchApplications();
      // Poll for new applications every 5 seconds (original behavior)
      const interval = setInterval(() => {
        fetchApplications();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const fetchJobs = async () => {
    if (!user || !token) return;

    try {
      const allJobs = await jobsAPI.getAll();
      const myJobs = allJobs.filter((job: Job) => job.employer_id === user._id);
      setJobs(myJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!user || !token) return;

    // Only show the skeleton on the initial load. Subsequent polls should
    // fetch silently to avoid flicker.
    if (isFirstAppsLoad.current) setLoadingApps(true);
    try {
      const apps = await applicationsAPI.getEmployerApplications(token);
      setApplications(apps || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      if (isFirstAppsLoad.current) {
        setLoadingApps(false);
        isFirstAppsLoad.current = false;
      }
    }
  };

  const getJobApplicationCount = (jobId: string) => {
    return applications.filter(app => app.job_id === jobId).length;
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const stats = [
    {
      label: 'Active Jobs',
      value: jobs.filter(j => j.status === 'active').length,
      icon: Briefcase,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      label: 'Total Applications',
      value: applications.length,
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      label: 'Pending Review',
      value: applications.filter(a => a.status === 'pending').length,
      icon: Eye,
      color: 'from-amber-600 to-orange-600',
    },
    {
      label: 'Shortlisted',
      value: applications.filter(a => a.status === 'shortlisted').length,
      icon: TrendingUp,
      color: 'from-rose-600 to-pink-600',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4"
        >
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">Employer Dashboard</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your job postings and applications</p>
          </div>
          <Link to="/post-job" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Post New Job</span>
            </Button>
          </Link>
        </motion.div>

        <div className="mt-4">
          <ProfileCompletion />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassCard className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Your Job Postings</h2>
            {loading ? (
              <div className="text-gray-400">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg font-semibold text-white mb-2">No jobs posted yet</h3>
                <p className="text-gray-400 mb-4">Start by posting your first job</p>
                <Link to="/post-job">
                  <Button variant="primary">Post a Job</Button>
                </Link>
              </GlassCard>
            ) : (
              <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                {jobs.map((job, idx) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                  >
                      <GlassCard className="p-4 sm:p-6">
                        <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            {job.location && (
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.location}
                              </span>
                            )}
                            {job.salary_min && job.salary_max && (
                              <span className="flex items-center">
                                <span className="w-3 h-3 mr-1 text-gray-400">₹</span>
                                {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} /M
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          {getJobApplicationCount(job._id)} application{getJobApplicationCount(job._id) !== 1 ? 's' : ''}
                        </span>
                        <Link to={`/jobs/${job._id}/edit`}>
                          <Button variant="secondary" className="text-sm">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Recent Applications</h2>
            {loadingApps ? (
              <div className="space-y-4">
                <LoadingSkeletonCard />
                <LoadingSkeletonCard />
                <LoadingSkeletonCard />
              </div>
            ) : applications.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg font-semibold text-white mb-2">No applications yet</h3>
                <p className="text-gray-400">Applications will appear here</p>
              </GlassCard>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <motion.div key={application._id} variants={itemVariants}>
                    <GlassCard className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-medium mb-1">
                            Applicant Details
                          </h3>
                          <p className="text-sm text-gray-400">Job ID: {application.job_id}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            application.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400'
                              : application.status === 'shortlisted'
                              ? 'bg-green-500/20 text-green-400'
                              : application.status === 'viewed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(application.applied_at).toLocaleDateString()}
                        </span>
                        <Link to={`/applications/${application._id}`}>
                          <Button variant="secondary" className="text-sm">
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
        </div>
      </div>
    </Layout>
  );
}
