import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import { Briefcase, User, LogOut, Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
      },
    }),
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-blue-500/10"
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
                          <Bell className="w-4 h-4" />
                          <motion.span
                            className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
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
            {profile?.role === 'seeker' && (
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="ghost" className="w-full flex items-center justify-start space-x-3 text-sm py-2 px-4">
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span>Profile</span>
                </Button>
              </Link>
            )}

            {profile?.role === 'employer' && (
              <Link to="/employer-profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="ghost" className="w-full flex items-center justify-start space-x-3 text-sm py-2 px-4">
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span>Profile</span>
                </Button>
              </Link>
            )}

            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="ghost" className="w-full flex items-center justify-start text-sm py-2 px-4">
                <span className="truncate">{profile?.full_name}</span>
              </Button>
            </Link>

            {profile?.role === 'employer' && (
              <Link to="/employer-applications" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="ghost" className="w-full flex items-center justify-start space-x-3 text-sm py-2 px-4">
                  <Bell className="w-5 h-5 flex-shrink-0" />
                  <span>Applications</span>
                </Button>
              </Link>
            )}

            <Button
              variant="secondary"
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-start space-x-3 text-sm py-2 px-4 text-center"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left">Sign Out</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
