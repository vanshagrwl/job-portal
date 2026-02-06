// Design System - Colors, Shadows, Spacing, and Tokens
export const designTokens = {
  // Colors - Seeker (Purple/Violet)
  seeker: {
    primary: '#7c3aed', // violet-600
    primaryLight: '#a78bfa', // violet-400
    primaryDark: '#5b21b6', // violet-900
    accent: '#06b6d4', // cyan-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
  },

  // Colors - Employer (Blue)
  employer: {
    primary: '#3b82f6', // blue-600
    primaryLight: '#60a5fa', // blue-400
    primaryDark: '#1e3a8a', // blue-900
    accent: '#14b8a6', // teal-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
  },

  // Neutral colors (shared)
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Shadows - Depth System
  shadows: {
    none: '0 0 0 rgba(0, 0, 0, 0)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    // Glassmorphism shadows
    glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
    glassInset: 'inset 0 8px 32px rgba(255, 255, 255, 0.1)',
  },

  // Spacing Scale
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '0.125rem',
    base: '0.375rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },

  // Gradients
  gradients: {
    seeker: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    seekerSubtle: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
    employer: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
    employerSubtle: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)',
    danger: 'linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)',
  },

  // Z-Index scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },
};

// Helper function to get color by role
export const getColorByRole = (role: 'seeker' | 'employer', property: keyof typeof designTokens.seeker) => {
  return role === 'seeker' ? designTokens.seeker[property] : designTokens.employer[property];
};

export default designTokens;
