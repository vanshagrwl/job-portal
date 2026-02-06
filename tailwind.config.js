/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Employer Theme - Corporate Blue
        'employer-primary': '#1e3a8a', // Deep Royal Blue
        'employer-primary-light': '#3b82f6',
        'employer-secondary': '#64748b', // Slate Grey
        'employer-accent': '#cbd5e1', // Light Metallic Silver
        'employer-bg': '#f8fafc', // Clean Light Grey
        
        // Seeker Theme - Modern Violet
        'seeker-primary': '#7c3aed', // Vibrant Violet
        'seeker-primary-light': '#a78bfa',
        'seeker-secondary': '#14b8a6', // Soft Teal
        'seeker-accent': '#f97316', // Coral accent
        'seeker-bg': '#fafafa', // Clean White
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'glow-employer': 'glow-employer 3s ease-in-out infinite',
        'glow-seeker': 'glow-seeker 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'drift-right': 'drift-right 8s ease-in-out infinite',
        'drift-left': 'drift-left 8s ease-in-out infinite',
        'scale-pulse': 'scale-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'liquid-fill': 'liquid-fill 0.6s ease-in-out',
        'hover-lift': 'hover-lift 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in',
        'drawer-overlay': 'drawer-overlay 0.3s ease-out',
        'card-stack': 'card-stack 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        'glow-employer': {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 20px rgba(30, 58, 138, 0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 40px rgba(30, 58, 138, 0.6)' },
        },
        'glow-seeker': {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'drift-right': {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(30px)' },
        },
        'drift-left': {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(-30px)' },
        },
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'liquid-fill': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        'hover-lift': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-8px)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'drawer-overlay': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'card-stack': {
          '0%': { transform: 'translateY(20px) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-animated': 'linear-gradient(270deg, #3b82f6, #06b6d4, #3b82f6)',
        'gradient-employer': 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        'gradient-seeker': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        'gradient-mesh': 'radial-gradient(at 20% 50%, rgba(30, 58, 138, 0.5) 0px, transparent 50%),radial-gradient(at 80% 80%, rgba(124, 58, 237, 0.5) 0px, transparent 50%)',
      },
      backgroundSize: {
        'gradient-animated': '200% 200%',
      },
      boxShadow: {
        'lift': '0 20px 40px rgba(0, 0, 0, 0.3)',
        'lift-employer': '0 20px 40px rgba(30, 58, 138, 0.2)',
        'lift-seeker': '0 20px 40px rgba(124, 58, 237, 0.2)',
        'glow-employer': '0 0 30px rgba(30, 58, 138, 0.4)',
        'glow-seeker': '0 0 30px rgba(124, 58, 237, 0.4)',
        // Depth System Shadows
        'depth-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'depth-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'depth-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'depth-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'depth-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'depth-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // Glass Morphism Shadows
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 8px 32px rgba(255, 255, 255, 0.1)',
        // Hover/Interactive Shadows
        'hover-md': '0 10px 20px -5px rgba(0, 0, 0, 0.15), 0 5px 10px -3px rgba(0, 0, 0, 0.1)',
        'hover-lg': '0 15px 30px -5px rgba(0, 0, 0, 0.2), 0 10px 15px -5px rgba(0, 0, 0, 0.1)',
        'hover-employer': '0 15px 30px -5px rgba(30, 58, 138, 0.25), 0 10px 15px -5px rgba(59, 130, 246, 0.15)',
        'hover-seeker': '0 15px 30px -5px rgba(124, 58, 237, 0.25), 0 10px 15px -5px rgba(167, 139, 250, 0.15)',
      },
      backdropBlur: {
        'xl': '20px',
        'xxl': '40px',
      },
    },
  },
  plugins: [],
};
