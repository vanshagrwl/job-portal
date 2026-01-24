import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import FluidBackground from './FluidBackground';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    duration: 0.6,
  };

  return (
    <div className="min-h-screen">
      <FluidBackground />
      <Navbar />
      <motion.main
        className="container mx-auto px-4 pt-24 pb-12"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
      >
        {children}
      </motion.main>
    </div>
  );
}
