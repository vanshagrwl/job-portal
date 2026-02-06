import React from 'react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'seeker' | 'employer';
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'seeker',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      {/* Animated icon */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
          variant === 'seeker'
            ? 'bg-purple-600/20 text-purple-400'
            : 'bg-blue-600/20 text-blue-400'
        }`}
      >
        <Icon className="w-10 h-10" />
      </motion.div>

      {/* Title and description */}
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-400 text-sm sm:text-base text-center max-w-xs mb-6">
        {description}
      </p>

      {/* Action button */}
      {action && (
        <Button
          variant="primary"
          theme={variant}
          onClick={action.onClick}
          className="flex items-center gap-2"
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
