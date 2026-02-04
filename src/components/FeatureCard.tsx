import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  icon?: ReactNode;
  title?: string;
  description?: string;
  color?: string;
  variant?: 'default' | 'elevated' | 'minimal';
}

export default function FeatureCard({
  children,
  icon,
  title,
  description,
  color = 'from-blue-600 to-cyan-600',
  variant = 'default',
  className = '',
  ...props
}: FeatureCardProps) {
  const variantStyles = {
    default:
      'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-2xl hover:shadow-blue-500/20',
    elevated:
      'bg-white/8 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-blue-500/40',
    minimal:
      'bg-transparent border border-white/5 hover:border-white/20 hover:bg-white/5',
  };

  return (
    <motion.div
      className={`rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 ${variantStyles[variant]} ${className}`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, rgb(59, 130, 246, 0.1), rgb(6, 182, 212, 0.1))`,
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
        }}
      />

      {/* Content container */}
      <div className="relative z-10">
        {icon && (
          <motion.div
            className={`inline-flex p-3 bg-gradient-to-br ${color} rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-all`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {icon}
          </motion.div>
        )}

        {title && (
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors mb-4">
            {description}
          </p>
        )}

        {children}
      </div>
    </motion.div>
  );
}
