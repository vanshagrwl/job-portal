import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function GlassCard({ children, className = '', glow = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group ${glow ? 'glow-sm' : ''} ${className}`}
      initial={props.initial ?? { opacity: 0, x: 40 }}
      animate={props.animate ?? { opacity: 1, x: 0 }}
      exit={props.exit}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
      }}
      transition={props.transition ?? { type: 'tween', ease: 'easeOut', duration: 0.5 }}
      {...props}
    >
      {/* Animated border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
          filter: 'blur(10px)',
        }}
      />

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          width: '100%',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
