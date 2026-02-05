import { createContext, useContext, useEffect, useState } from 'react';

interface MotionPrefContextValue {
  reduced: boolean;
  setReduced: (v: boolean) => void;
}

const MotionPrefContext = createContext<MotionPrefContextValue | null>(null);

export function MotionPrefProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReducedState] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('motion:reduced');
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('motion:reduced', JSON.stringify(reduced));
    } catch {}
  }, [reduced]);

  const setReduced = (v: boolean) => setReducedState(v);

  return (
    <MotionPrefContext.Provider value={{ reduced, setReduced }}>
      {children}
    </MotionPrefContext.Provider>
  );
}

export function useMotionPref() {
  const ctx = useContext(MotionPrefContext);
  if (!ctx) throw new Error('useMotionPref must be used within MotionPrefProvider');
  return ctx;
}

export default MotionPrefContext;
