import { motion } from 'framer-motion';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
  theme?: 'employer' | 'seeker';
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  theme = 'seeker',
  loading = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

  const variants = {
    employer: {
      primary: 'bg-gradient-employer text-white shadow-lg shadow-employer-primary/30 hover:shadow-employer-primary/50',
      secondary: 'bg-employer-secondary/10 hover:bg-employer-secondary/20 text-employer-primary border border-employer-secondary/30 hover:border-employer-secondary/50',
      danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50',
      ghost: 'bg-transparent hover:bg-employer-secondary/10 text-employer-primary',
    },
    seeker: {
      primary: 'bg-gradient-seeker text-white shadow-lg shadow-seeker-primary/30 hover:shadow-seeker-primary/50',
      secondary: 'bg-seeker-primary/10 hover:bg-seeker-primary/20 text-seeker-primary border border-seeker-primary/30 hover:border-seeker-primary/50',
      danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50',
      ghost: 'bg-transparent hover:bg-seeker-primary/10 text-seeker-primary',
    },
  };

  const variantStyles = variants[theme][variant];

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 280, damping: 25, mass: 1.2 }}
      disabled={props.disabled || loading}
      {...props}
    >
      {/* Liquid Fill Effect - Background layer that fills on hover */}
      {(variant === 'primary' || variant === 'danger') && (
        <motion.span
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileHover={{ 
            clipPath: 'inset(0% 0 0 0)',
            transition: { duration: 0.6, ease: 'easeInOut' }
          }}
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%)',
          }}
        />
      )}

      {/* Shimmer/Light Sweep Effect */}
      {(variant === 'primary' || variant === 'danger') && (
        <motion.span
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
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
              ? (theme === 'employer' ? 'inset 0 0 20px rgba(30, 58, 138, 0.3)' : 'inset 0 0 20px rgba(124, 58, 237, 0.3)')
              : 'inset 0 0 20px rgba(225, 29, 72, 0.3)',
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
