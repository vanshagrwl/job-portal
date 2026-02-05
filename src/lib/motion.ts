import { useEffect, useState } from 'react';

// Provides consistent animation settings that adapt to viewport size and reduced-motion preference
export function useMotionConfig() {
  const [width, setWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  const [reduce, setReduce] = useState<boolean>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('motion:reduced') : null;
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setWidth(window.innerWidth);
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === 'motion:reduced' && e.newValue) setReduce(JSON.parse(e.newValue));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('storage', onStorageChange);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  const isSmall = width < 640; // mobile
  const isMedium = width >= 640 && width < 1024;

  // Simplified: fade-in only (no side animations)
  const cardTransition = reduce
    ? { duration: 0 }
    : { type: 'tween', ease: 'easeOut', duration: 0.4 };

  const cardInitial = { opacity: 0 };
  const cardAnimate = { opacity: 1 };

  const pageTransition = reduce ? { duration: 0 } : { type: 'tween', ease: 'easeInOut', duration: 0.5 };
  const pageVariants = reduce
    ? { initial: { opacity: 1, y: 0 }, in: { opacity: 1, y: 0 }, out: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };

  const listStagger = isSmall ? 0.06 : 0.08;

  return {
    reduce,
    isSmall,
    isMedium,
    cardInitial,
    cardAnimate,
    cardTransition,
    pageTransition,
    pageVariants,
    listStagger,
  };
}
