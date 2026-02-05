import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Provides consistent animation settings that adapt to viewport size and reduced-motion preference
export function useMotionConfig() {
  const [width, setWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isSmall = width < 640; // mobile
  const isMedium = width >= 640 && width < 1024;

  const cardDistance = isSmall ? 20 : isMedium ? 40 : 60;
  const cardTransition = reduce
    ? { duration: 0 }
    : { type: 'spring', stiffness: 250, damping: 22, mass: 1 };

  const cardInitial = reduce ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: cardDistance, y: 0 };
  const cardAnimate = { opacity: 1, x: 0, y: 0 };

  const pageTransition = reduce ? { duration: 0 } : { type: 'tween', ease: 'easeInOut', duration: 0.45 };
  const pageVariants = reduce
    ? { initial: { opacity: 1, y: 0 }, in: { opacity: 1, y: 0 }, out: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 18 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -18 } };

  const listStagger = isSmall ? 0.06 : 0.08;

  return {
    reduce,
    isSmall,
    isMedium,
    cardDistance,
    cardInitial,
    cardAnimate,
    cardTransition,
    pageTransition,
    pageVariants,
    listStagger,
  };
}
