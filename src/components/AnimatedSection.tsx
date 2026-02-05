import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { useMotionConfig } from '../lib/motion';

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
  const motionCfg = useMotionConfig();

  const distance = motionCfg.isSmall ? 24 : 40;

  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: -distance };
      case 'right':
        return { opacity: 0, x: distance };
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
        duration: motionCfg.reduce ? 0.01 : duration,
        type: motionCfg.reduce ? 'tween' : 'spring',
        stiffness: motionCfg.reduce ? 100 : 120,
      }}
      viewport={{ once: true, margin: '-120px' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
