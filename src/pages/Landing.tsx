import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FluidBackground from '../components/FluidBackground';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import RoleToggle from '../components/RoleToggle';
import { Briefcase, Users, Building, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'employer'>('seeker');
  const navigate = useNavigate();

  const seekerFeatures = [
    {
      icon: Briefcase,
      title: 'Find Dream Jobs',
      description: 'Browse thousands of job opportunities from top companies with AI-powered matching',
      color: 'from-violet-600 to-purple-600',
      delay: 0,
    },
    {
      icon: Users,
      title: 'Build Your Network',
      description: 'Connect with industry professionals and expand your career network',
      color: 'from-teal-600 to-cyan-600',
      delay: 0.1,
    },
    {
      icon: TrendingUp,
      title: 'Track Applications',
      description: 'Real-time updates on your applications and interview status',
      color: 'from-orange-600 to-rose-600',
      delay: 0.2,
    },
    {
      icon: Sparkles,
      title: 'AI Recommendations',
      description: 'Get personalized job recommendations based on your profile',
      color: 'from-pink-600 to-rose-600',
      delay: 0.3,
    },
  ];

  const employerFeatures = [
    {
      icon: Building,
      title: 'Post Jobs Instantly',
      description: 'Create and publish job listings in minutes with our intuitive form',
      color: 'from-blue-600 to-indigo-600',
      delay: 0,
    },
    {
      icon: Users,
      title: 'Find Top Talent',
      description: 'Access a vetted pool of qualified candidates matching your requirements',
      color: 'from-slate-600 to-gray-600',
      delay: 0.1,
    },
    {
      icon: TrendingUp,
      title: 'Manage Applications',
      description: 'Streamlined dashboard to review, track, and manage all applications',
      color: 'from-cyan-600 to-blue-600',
      delay: 0.2,
    },
    {
      icon: Sparkles,
      title: 'Data-Driven Insights',
      description: 'Analytics to optimize your hiring process and candidate quality',
      color: 'from-purple-600 to-indigo-600',
      delay: 0.3,
    },
  ];

  const features = selectedRole === 'seeker' ? seekerFeatures : employerFeatures;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        type: 'spring',
        stiffness: 80,
      },
    }),
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <FluidBackground />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-blue-500/5"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Briefcase className="w-5 h-5 text-white" />
              </motion.div>
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                JobHub
              </motion.span>
            </Link>

            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/signup">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            custom={0}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center mb-8"
          >
            <RoleToggle
              defaultRole={selectedRole}
              onToggle={setSelectedRole}
            />
          </motion.div>

          <motion.h1
            custom={1}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tighter"
          >
            {selectedRole === 'seeker'
              ? 'Find Your Perfect Role'
              : 'Find Your Perfect Talent'
            }
          </motion.h1>

          <motion.div
            custom={2}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="relative inline-block mb-8"
          >
            <span className="relative inline-block">
              <motion.span
                className={`absolute inset-0 blur-xl opacity-50 rounded-lg ${
                  selectedRole === 'seeker'
                    ? 'bg-gradient-seeker'
                    : 'bg-gradient-employer'
                }`}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span
                className={`relative bg-clip-text text-transparent text-5xl md:text-6xl font-bold leading-tight ${
                  selectedRole === 'seeker'
                    ? 'bg-gradient-seeker'
                    : 'bg-gradient-employer'
                }`}
              >
                {selectedRole === 'seeker'
                  ? 'With AI Matching'
                  : 'With Smart Screening'
                }
              </span>
            </span>
          </motion.div>

          <motion.p
            variants={titleVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed mt-10"
          >
            {selectedRole === 'seeker'
              ? 'Discover opportunities that match your skills and career goals. Get real-time recommendations powered by advanced AI matching.'
              : 'Access a vetted pool of candidates and streamline your hiring process. Make data-driven decisions to build your perfect team.'
            }
          </motion.p>

          <motion.div
            variants={titleVariants}
            custom={4}
            initial="hidden"
            animate="visible"
            className="flex justify-center space-x-4 flex-wrap gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup">
                <Button
                  variant="primary"
                  theme={selectedRole}
                  className="text-lg px-8 py-4 flex items-center space-x-2"
                >
                  <span>
                    {selectedRole === 'seeker'
                      ? 'Start Searching'
                      : 'Post a Job'
                    }
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login">
                <Button variant="secondary" theme={selectedRole} className="text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Grid - Animated on role change */}
        <motion.div
          key={selectedRole}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <GlassCard className="p-6 h-full group cursor-pointer">
                <motion.div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl transition-shadow`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <motion.h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                  {feature.title}
                </motion.h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <motion.div
                  className="mt-4 flex items-center text-sm font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <GlassCard className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals using JobHub to find their next opportunity
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/signup">
                <Button variant="primary" theme={selectedRole} className="text-lg px-8 py-4">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" theme={selectedRole} className="text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
