import { SelectHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
  error?: string;
}

export default function Select({
  label,
  children,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div>
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-300 mb-2 transition-colors duration-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.label>
      )}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <select
          className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none cursor-pointer transition-all duration-300 hover:bg-white/8 hover:border-white/20 ${className}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '36px',
          }}
          {...props}
        >
          {children}
        </select>

        {/* Animated border glow on focus */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          whileFocus={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.1), 0 0 15px rgba(59, 130, 246, 0.1)',
          }}
        />
      </motion.div>

      {error && (
        <motion.p
          className="mt-2 text-sm text-rose-400 font-medium"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {error}
        </motion.p>
      )}
      <style>{`
        select option {
          background-color: #1f2937;
          color: #ffffff;
          padding: 8px 12px;
        }
        select option:hover {
          background-color: #374151;
        }
        select option:checked {
          background: linear-gradient(#3b82f6, #3b82f6);
          background-color: #3b82f6 !important;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
