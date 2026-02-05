import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FluidBackground from './FluidBackground';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = shouldReduceMotion
    ? { initial: { opacity: 1, y: 0 }, in: { opacity: 1, y: 0 }, out: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 15 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -15 } };

  const pageTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'tween', ease: 'easeInOut', duration: 0.4 };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <FluidBackground />
      <Navbar />
      <motion.main
        className="relative w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-28 pb-12 mx-auto will-change-transform will-change-opacity"
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
