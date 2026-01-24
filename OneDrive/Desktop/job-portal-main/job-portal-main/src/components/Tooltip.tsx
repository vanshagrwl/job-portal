import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 0.2,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClass = {
    top: '-top-12 left-1/2 -translate-x-1/2',
    bottom: 'top-12 left-1/2 -translate-x-1/2',
    left: 'right-12 top-1/2 -translate-y-1/2',
    right: 'left-12 top-1/2 -translate-y-1/2',
  };

  const arrowClass = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 border-t-gray-800',
    bottom: 'top-0 left-1/2 -translate-x-1/2 border-b-gray-800',
    left: 'right-0 top-1/2 -translate-y-1/2 border-l-gray-800',
    right: 'left-0 top-1/2 -translate-y-1/2 border-r-gray-800',
  };

  const animationVariants = {
    hidden: {
      opacity: 0,
      ...(position === 'top' && { y: 10 }),
      ...(position === 'bottom' && { y: -10 }),
      ...(position === 'left' && { x: 10 }),
      ...(position === 'right' && { x: -10 }),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.2,
        delay,
      },
    },
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute ${positionClass[position]} z-50 whitespace-nowrap`}
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg shadow-lg border border-white/10 backdrop-blur-sm">
              {content}

              {/* Arrow indicator */}
              <div
                className={`absolute w-0 h-0 border-4 border-transparent ${arrowClass[position]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
