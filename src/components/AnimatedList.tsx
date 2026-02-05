import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useMotionConfig } from '../lib/motion';

interface AnimatedListProps {
  children: ReactNode;
  component?: 'div' | 'ul' | 'section';
  className?: string;
}

export default function AnimatedList({ children, component = 'div', className = '' }: AnimatedListProps) {
  const motionCfg = useMotionConfig();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: motionCfg.listStagger,
      },
    },
  };

  const itemVariants = {
    hidden: motionCfg.cardInitial,
    visible: motionCfg.cardAnimate,
  };

  const Comp: any = motion[component as keyof typeof motion] || motion.div;

  return (
    <Comp variants={containerVariants} initial="hidden" animate="visible" className={className}>
      {Array.isArray(children)
        ? children.map((child: any, idx: number) => (
            <motion.div key={idx} variants={itemVariants} className="w-full">
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>}
    </Comp>
  );
}
