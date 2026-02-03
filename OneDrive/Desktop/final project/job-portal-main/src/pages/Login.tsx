import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import FluidBackground from '../components/FluidBackground';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { Briefcase, ArrowRight, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
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
        className="w-full max-w-md relative z-10"
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
            Welcome Back
          </motion.h1>

          <motion.p
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-gray-300 mb-8"
          >
            Sign in to your account to continue
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
            {/* Email Field */}
            <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
              <label className="block text-sm font-semibold text-white mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email Address
                </div>
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-400"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
              <label className="block text-sm font-semibold text-white mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Password
                </div>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-400"
              />
            </motion.div>

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

            {/* Sign In Button */}
            <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
              <Button
                type="submit"
                variant="primary"
                theme="seeker"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
              custom={6}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative py-4"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Don't have an account?</span>
              </div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible">
              <Link to="/signup">
                <Button
                  type="button"
                  variant="secondary"
                  theme="seeker"
                  className="w-full py-3"
                >
                  Create Account
                </Button>
              </Link>
            </motion.div>
          </motion.form>
        </GlassCard>
        {/* Footer Link */}
        <motion.div
          custom={8}
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
