import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'cyan' | 'white';
  text?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'blue',
  text,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    cyan: 'from-cyan-500 to-blue-500',
    white: 'from-white to-gray-200',
  };

  // Smooth continuous rotation without stops
  const spinVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop' as const,
      },
    },
  };

  // Smoother pulse animation for dots
  const dotVariants = {
    animate: (i: number) => ({
      scale: [1, 1.15, 1],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.15,
        repeatType: 'loop' as const,
      },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizes[size]} relative`}>
        {/* Outer gradient ring - smooth rotation */}
        <motion.div
          className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r ${colors[color]} bg-clip-border shadow-lg`}
          style={{ boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.3)' }}
          variants={spinVariants}
          animate="animate"
        />

        {/* Middle rotating ring - opposite direction for smooth effect */}
        <motion.div
          className={`absolute inset-3 rounded-full border-3 border-transparent bg-gradient-to-l ${colors[color]} bg-clip-border opacity-60`}
          animate={{ rotate: -360 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop' as const,
          }}
        />

        {/* Center pulsing circle */}
        <motion.div
          className={`absolute inset-1/3 rounded-full bg-gradient-to-r ${colors[color]} blur-sm`}
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'loop' as const,
          }}
        />

        {/* Inner smoothly animated dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-1 h-1 rounded-full bg-gradient-to-r ${colors[color]} mx-1.5`}
              custom={i}
              variants={dotVariants}
              animate="animate"
            />
          ))}
        </div>
      </div>

      {text && (
        <motion.p
          className="text-gray-400 text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'loop' as const,
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
