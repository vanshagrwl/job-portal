import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import { Briefcase, User, LogOut, Bell, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { applicationsAPI } from '../lib/api';

export default function Navbar() {
  const { user, profile, signOut, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (profile?.role === 'employer' && token) {
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 3000); // Refetch every 3 seconds
      return () => clearInterval(interval);
    }
  }, [profile?.role, token]);

  // Refetch when user navigates back from applications page
  useEffect(() => {
    if (profile?.role === 'employer' && token && location.pathname !== '/employer-applications') {
      fetchPendingCount();
    }
  }, [location.pathname, profile?.role, token]);

  const fetchPendingCount = async () => {
    if (!token) return;
    try {
      const apps = await applicationsAPI.getEmployerApplications(token);
      const pending = apps?.filter((app: any) => app.status === 'pending').length || 0;
      setPendingCount(pending);
    } catch (error) {
      console.error('Error fetching pending applications:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 18,
        mass: 1.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        type: 'spring' as const,
        stiffness: 250,
        damping: 22,
        mass: 1.0,
      },
    }),
  };

  return (
    <>
      {/* Blur overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}
      
      <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-blue-500/10"
    >
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-1 sm:space-x-2 group flex-shrink-0">
            <motion.div
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            <motion.span
              className="hidden sm:inline text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              JobHub
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {user && (
              <>
                {profile?.role === 'seeker' && (
                  <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                    <Link to="/profile">
                      <Button variant="ghost" className="flex items-center space-x-2 text-sm lg:text-base">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Button>
                    </Link>
                  </motion.div>
                )}

                {profile?.role === 'employer' && (
                  <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
                    <Link to="/employer-profile">
                      <Button variant="ghost" className="flex items-center space-x-2 text-sm lg:text-base">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Button>
                    </Link>
                  </motion.div>
                )}

                <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="flex items-center space-x-2 text-sm lg:text-base">
                      <span>{profile?.full_name?.split(' ')[0]}</span>
                    </Button>
                  </Link>
                </motion.div>

                {profile?.role === 'employer' && (
                  <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                    <Link to="/employer-applications">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" className="relative">
                          <Bell className="w-5 h-5" />
                          {pendingCount > 0 && (
                            <motion.span
                              className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                )}

                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Button
                    variant="secondary"
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-sm lg:text-base"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 pt-3 border-t border-white/10 space-y-2 flex flex-col"
          >
            {/* Mobile menu items: stacked icon above label for a clean, consistent look */}
            {profile?.role === 'seeker' && (
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="ghost" className="w-full py-3 px-4 hover:bg-white/5">
                  <div className="flex flex-col items-center gap-1">
                    <User className="w-6 h-6" />
                    <span className="text-sm">Profile</span>
                  </div>
                </Button>
              </Link>
            )}

            {profile?.role === 'employer' && (
              <Link to="/employer-profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="ghost" className="w-full py-3 px-4 hover:bg-white/5">
                  <div className="flex flex-col items-center gap-1">
                    <User className="w-6 h-6" />
                    <span className="text-sm">Profile</span>
                  </div>
                </Button>
              </Link>
            )}

            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="ghost" className="w-full py-3 px-4 hover:bg-white/5">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm truncate max-w-[160px] text-center">{profile?.full_name}</span>
                </div>
              </Button>
            </Link>

            {profile?.role === 'employer' && (
              <Link to="/employer-applications" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="ghost" className="w-full py-3 px-4 hover:bg-white/5">
                  <div className="flex flex-col items-center gap-1">
                    <Bell className="w-6 h-6" />
                    <span className="text-sm">Applications</span>
                  </div>
                </Button>
              </Link>
            )}

            <div className="px-4">
              <Button
                variant="secondary"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Sign Out</span>
                </div>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
    </>
  );
}
