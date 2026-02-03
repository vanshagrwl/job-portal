import { motion } from 'framer-motion';
import { useState } from 'react';
import { Briefcase, User } from 'lucide-react';

interface RoleToggleProps {
  onToggle: (role: 'seeker' | 'employer') => void;
  defaultRole?: 'seeker' | 'employer';
}

export default function RoleToggle({ onToggle, defaultRole = 'seeker' }: RoleToggleProps) {
  const [activeRole, setActiveRole] = useState<'seeker' | 'employer'>(defaultRole);

  const handleToggle = (role: 'seeker' | 'employer') => {
    if (role !== activeRole) {
      setActiveRole(role);
      onToggle(role);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="inline-flex items-center gap-2 p-1 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-lg"
    >
      {/* Seeker Button */}
      <motion.button
        onClick={() => handleToggle('seeker')}
        className={`relative px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
          activeRole === 'seeker'
            ? 'text-white'
            : 'text-white/60 hover:text-white/80'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {activeRole === 'seeker' && (
          <motion.div
            layoutId="toggle-background"
            className="absolute inset-0 bg-gradient-seeker rounded-full -z-10"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <User className="w-4 h-4" />
        <span>Job Seeker</span>
      </motion.button>

      {/* Employer Button */}
      <motion.button
        onClick={() => handleToggle('employer')}
        className={`relative px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
          activeRole === 'employer'
            ? 'text-white'
            : 'text-white/60 hover:text-white/80'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {activeRole === 'employer' && (
          <motion.div
            layoutId="toggle-background"
            className="absolute inset-0 bg-gradient-employer rounded-full -z-10"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Briefcase className="w-4 h-4" />
        <span>Employer</span>
      </motion.button>
    </motion.div>
  );
}
