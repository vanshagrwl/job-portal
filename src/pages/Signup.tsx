import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import FluidBackground from '../components/FluidBackground';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { Briefcase, Users, Building, CheckCircle, Mail, Lock, User as UserIcon } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated gradient mesh background */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: 'radial-gradient(at 20% 50%, rgba(124, 58, 237, 0.3) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(20, 184, 166, 0.3) 0px, transparent 50%)',
          backgroundSize: '200% 200%',
        }}
      />
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
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight"
          >
            Join JobHub
          </motion.h1>

          <motion.p
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-gray-300 mb-8"
          >
            Create your account to get started
          </motion.p>
        </div>

        {/* Form Card */}
        <GlassCard className="p-8 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-2xl">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Role selection */}
            <motion.div
              custom={3}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-sm font-semibold text-white mb-4">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'seeker', label: 'Job Seeker', icon: Users, color: 'from-violet-600 to-purple-600' },
                  { id: 'employer', label: 'Employer', icon: Building, color: 'from-blue-600 to-indigo-600' },
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
                          ? `bg-gradient-to-br ${option.color} border-transparent shadow-lg`
                          : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div className="relative z-10 flex flex-col items-center space-y-2">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 8 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        </motion.div>
                        <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Full Name */}
            <motion.div
              custom={4}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-sm font-semibold text-white mb-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  Full Name
                </div>
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-400"
              />
            </motion.div>

            {/* Company Name - Only for Employer */}
            {role === 'employer' && (
              <motion.div
                custom={5}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="block text-sm font-semibold text-white mb-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    Company Name
                  </div>
                </label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company Inc."
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-400"
                />
              </motion.div>
            )}

            {/* Email */}
            <motion.div
              custom={role === 'employer' ? 6 : 5}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-sm font-semibold text-white mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email Address
                </div>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-400"
              />
            </motion.div>

            {/* Password */}
            <motion.div
              custom={role === 'employer' ? 7 : 6}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-sm font-semibold text-white mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Password
                </div>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-400"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              custom={role === 'employer' ? 8 : 7}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                type="submit"
                variant="primary"
                theme={role === 'employer' ? 'employer' : 'seeker'}
                disabled={loading}
                className="w-full py-3 text-lg"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
              custom={role === 'employer' ? 9 : 8}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative py-4"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Already have an account?</span>
              </div>
            </motion.div>

            {/* Sign In Link */}
            <motion.div
              custom={role === 'employer' ? 10 : 9}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link to="/login">
                <Button
                  type="button"
                  variant="secondary"
                  theme={role === 'employer' ? 'employer' : 'seeker'}
                  className="w-full py-3"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.form>
        </GlassCard>

        {/* Back to Home */}
        <motion.div
          custom={role === 'employer' ? 11 : 10}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-center mt-8"
        >
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
