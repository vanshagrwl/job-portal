import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type Theme = 'employer' | 'seeker';

interface ThemeContextType {
  theme: Theme;
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    bg: string;
    gradient: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  employer: {
    primary: '#1e3a8a',
    primaryLight: '#3b82f6',
    secondary: '#64748b',
    accent: '#cbd5e1',
    bg: '#f8fafc',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  },
  seeker: {
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    secondary: '#14b8a6',
    accent: '#f97316',
    bg: '#fafafa',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const theme: Theme = profile?.role === 'employer' ? 'employer' : 'seeker';
  const colors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export const getThemeClasses = (theme: Theme) => {
  return {
    primary: theme === 'employer' ? 'from-employer-primary to-employer-primary-light' : 'from-seeker-primary to-seeker-primary-light',
    shadow: theme === 'employer' ? 'shadow-lift-employer' : 'shadow-lift-seeker',
    glow: theme === 'employer' ? 'glow-employer' : 'glow-seeker',
    bg: theme === 'employer' ? 'bg-employer-bg' : 'bg-seeker-bg',
    text: theme === 'employer' ? 'text-employer-primary' : 'text-seeker-primary',
    border: theme === 'employer' ? 'border-employer-secondary' : 'border-seeker-secondary',
  };
};
