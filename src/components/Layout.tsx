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
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <FluidBackground />
      <Navbar />
      <motion.main
        className="relative w-full max-w-full px-4 pt-20 md:pt-24 lg:pt-28 pb-12 mx-auto"
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
