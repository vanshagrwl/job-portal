import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import FluidBackground from '../components/FluidBackground';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { Briefcase, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
            className="text-gray-400 text-lg"
          >
            Sign in to your account to continue
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

              <motion.div
                custom={4}
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
                custom={5}
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
                  autoComplete="current-password"
                />
              </motion.div>

              <motion.div
                custom={6}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 text-lg"
                >
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </motion.div>
            </form>

            <motion.div
              custom={7}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 pt-8 border-t border-white/10"
            >
              <p className="text-gray-400 text-center">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-semibold hover:from-blue-300 hover:to-cyan-300 transition-all"
                >
                  Create account
                </Link>
              </p>
            </motion.div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
