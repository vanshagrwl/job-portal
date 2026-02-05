import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  theme?: 'employer' | 'seeker';
  stackEffect?: boolean;
  hoverLift?: boolean;
}

export default function Card({
  children,
  className = '',
  glow = false,
  theme = 'seeker',
  stackEffect = false,
  hoverLift = true,
  ...props
}: CardProps) {
  const glowColor = theme === 'employer'
    ? 'rgba(30, 58, 138, 0.2)'
    : 'rgba(124, 58, 237, 0.2)';

  const shadowColor = theme === 'employer'
    ? 'rgba(30, 58, 138, 0.15)'
    : 'rgba(124, 58, 237, 0.15)';

  return (
    <motion.div
      className={`bg-white backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg relative overflow-hidden group ${className}`}
      initial={props.initial ?? { opacity: 0, x: 40 }}
      animate={props.animate ?? { opacity: 1, x: 0 }}
      exit={props.exit}
      whileHover={hoverLift ? {
        scale: 1.02,
        y: -12,
        boxShadow: `0 30px 60px ${shadowColor}`,
      } : undefined}
      whileTap={stackEffect ? { scale: 0.98 } : undefined}
      transition={props.transition ?? {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.5,
      }}
      {...props}
    >
      {/* Stack Effect - Multiple shadow layers */}
      {stackEffect && (
        <>
          <motion.div
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background: glow ? glowColor : 'transparent',
              filter: 'blur(20px)',
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          {/* Back shadow layer */}
          <motion.div
            className="absolute -inset-4 rounded-2xl -z-20"
            style={{
              background: glowColor,
              filter: 'blur(30px)',
            }}
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          />
        </>
      )}

      {/* Animated Border Glow on Hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(45deg, transparent, ${glowColor}, transparent)`,
          filter: 'blur(10px)',
        }}
      />

      {/* Shimmer Effect on Hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          width: '100%',
        }}
      />

      {/* Glow Border Effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            border: `2px solid ${theme === 'employer' ? 'rgba(30, 58, 138, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
            boxShadow: `inset 0 0 20px ${glowColor}`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
