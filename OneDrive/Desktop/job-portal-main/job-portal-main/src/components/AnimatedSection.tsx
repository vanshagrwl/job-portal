import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function AnimatedSection({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  ...props
}: AnimatedSectionProps) {
  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 40 };
      case 'down':
        return { opacity: 0, y: -40 };
      case 'left':
        return { opacity: 0, x: -40 };
      case 'right':
        return { opacity: 0, x: 40 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialState()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        delay,
        duration,
        type: 'spring',
        stiffness: 100,
      }}
      viewport={{ once: true, margin: '-100px' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
