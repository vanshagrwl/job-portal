import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import FluidBackground from '../components/FluidBackground';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { Briefcase, Users, Building, CheckCircle } from 'lucide-react';
import { UserRole } from '../lib/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<UserRole>('seeker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, fullName, role, role === 'employer' ? companyName : undefined);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        type: 'spring',
        stiffness: 100,
      },
    }),
  };

  const roleVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
      },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FluidBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl relative z-10"
      >
        {/* Main content */}
        <div className="text-center mb-10">
          {/* Logo - Clickable */}
          <motion.button
            onClick={handleLogoClick}
            custom={0}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl mb-6 shadow-lg shadow-blue-500/20 group hover:shadow-blue-500/30 transition-shadow cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 8 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Briefcase className="w-10 h-10 text-white" />
            </motion.div>
          </motion.button>

          <motion.h1
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl font-bold text-white mb-3 leading-tight"
          >
            Join JobHub
          </motion.h1>

          <motion.p
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-gray-400 text-lg"
          >
            Create your account to get started
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          custom={3}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <GlassCard className="p-8 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-sm font-medium flex items-center space-x-2"
                >
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Role selection */}
              <motion.div
                custom={4}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="block text-sm font-semibold text-gray-200 mb-4">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'seeker', label: 'Job Seeker', icon: Users, color: 'from-blue-600 to-cyan-600' },
                    { id: 'employer', label: 'Employer', icon: Building, color: 'from-emerald-600 to-teal-600' },
                  ].map((option, idx) => {
                    const isSelected = role === option.id;
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        custom={idx}
                        variants={roleVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => setRole(option.id as UserRole)}
                        className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/30'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            layoutId="selectedRole"
                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}

                        <motion.div className="relative z-10 flex flex-col items-center space-y-2">
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 8 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                          </motion.div>
                          <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            {option.label}
                          </span>
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckCircle className="w-5 h-5 text-blue-400" />
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                custom={5}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Input
                  label="Full Name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
              </motion.div>

              {role === 'employer' && (
                <motion.div
                  custom={6}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Input
                    label="Company Name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Inc."
                    required
                    autoComplete="organization"
                  />
                </motion.div>
              )}

              <motion.div
                custom={role === 'employer' ? 7 : 6}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </motion.div>

              <motion.div
                custom={role === 'employer' ? 8 : 7}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </motion.div>

              <motion.div
                custom={role === 'employer' ? 9 : 8}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full py-3 text-lg font-semibold"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </motion.div>
            </form>

            <motion.div
              custom={role === 'employer' ? 10 : 9}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 pt-8 border-t border-white/10"
            >
              <p className="text-gray-400 text-center">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-semibold hover:from-blue-300 hover:to-cyan-300 transition-all"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </GlassCard>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}
