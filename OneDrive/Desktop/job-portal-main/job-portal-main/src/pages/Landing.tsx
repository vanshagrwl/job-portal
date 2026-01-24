import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FluidBackground from '../components/FluidBackground';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Briefcase, Users, Building, TrendingUp, ArrowRight } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Briefcase,
      title: 'Find Dream Jobs',
      description: 'Browse thousands of job opportunities from top companies',
      color: 'from-blue-600 to-cyan-600',
      delay: 0,
    },
    {
      icon: Users,
      title: 'Connect with Talent',
      description: 'Access a pool of qualified job seekers ready to contribute',
      color: 'from-emerald-600 to-teal-600',
      delay: 0.1,
    },
    {
      icon: Building,
      title: 'Build Your Career',
      description: 'Get real-time updates and track your application status',
      color: 'from-amber-600 to-orange-600',
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Team',
      description: 'Post jobs and receive applications instantly',
      color: 'from-rose-600 to-pink-600',
      delay: 0.3,
    },
  ];

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
          <motion.h1
            custom={0}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Your Career Journey
          </motion.h1>

          <motion.div
            custom={1}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="relative inline-block"
          >
            <span className="relative inline-block">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-xl opacity-50 rounded-lg"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span className="relative bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-5xl md:text-7xl font-bold">
                Starts Here
              </span>
            </span>
          </motion.div>

          <motion.p
            variants={titleVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with opportunities that match your skills or find the perfect
            talent for your team. Experience real-time job matching like never before.
          </motion.p>

          <motion.div
            variants={titleVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            className="flex justify-center space-x-4 flex-wrap gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup">
                <Button variant="primary" className="text-lg px-8 py-4 flex items-center space-x-2">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login">
                <Button variant="secondary" className="text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <GlassCard className="p-6 h-full group" glow={true}>
                <motion.div
                  className={`inline-flex p-3 bg-gradient-to-br ${feature.color} rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-all`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Gradient background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-2xl pointer-events-none"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <GlassCard className="p-12 text-center relative z-10 border-2 border-blue-500/30">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              whileInView={{ scale: [0.95, 1.05, 1] }}
              transition={{ duration: 0.6 }}
            >
              Ready to take the next step?
            </motion.h2>
            <motion.p
              className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Join thousands of job seekers and employers who are already using JobHub
              to build their future.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link to="/signup">
                <Button variant="primary" className="text-lg px-8 py-4">
                  Create Your Account
                </Button>
              </Link>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
