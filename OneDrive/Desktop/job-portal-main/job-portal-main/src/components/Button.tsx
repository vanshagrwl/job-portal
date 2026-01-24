import { motion } from 'framer-motion';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50',
    ghost: 'bg-transparent hover:bg-white/5 text-white',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Shimmer effect background for primary and danger variants */}
      {(variant === 'primary' || variant === 'danger') && (
        <motion.span
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          }}
        />
      )}

      {/* Glow effect for primary and danger variants */}
      {(variant === 'primary' || variant === 'danger') && (
        <motion.span
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: variant === 'primary' 
              ? 'inset 0 0 20px rgba(59, 130, 246, 0.3)' 
              : 'inset 0 0 20px rgba(225, 29, 72, 0.3)',
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
