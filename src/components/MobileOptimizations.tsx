/**
 * Mobile Touch Target & Responsive UX Enhancements
 * 
 * Ensures all interactive elements meet WCAG AA standards
 * - Minimum 48x48px touch targets on mobile
 * - Proper spacing between interactive elements
 * - Enhanced tap feedback and animations
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TouchTargetProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * TouchTarget Wrapper Component
 * Ensures minimum 48x48px touch target size for accessibility
 */
export const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  size = 'md',
  className = '',
  onClick,
  ariaLabel,
}) => {
  const sizeClasses = {
    sm: 'min-h-10 min-w-10', // 40x40px
    md: 'min-h-12 min-w-12', // 48x48px (WCAG AA standard)
    lg: 'min-h-14 min-w-14', // 56x56px
  };

  return (
    <motion.div
      className={`flex items-center justify-center cursor-pointer ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Mobile-Optimized Spacing Classes
 * Use these in responsive design for better mobile UX
 */
export const MobileSpacing = {
  // Padding for buttons and interactive elements on mobile
  buttonPaddingMobile: 'px-4 py-3 md:px-6 md:py-2.5',

  // Spacing between interactive elements (minimum 8px gap)
  interactiveGap: 'gap-2 md:gap-3',

  // Main content padding on mobile
  contentPaddingMobile: 'px-4 md:px-6 lg:px-8',

  // Margin bottom for form fields (better spacing on mobile)
  formSpacingMobile: 'mb-6 md:mb-4',

  // Touch-friendly list item height
  listItemHeightMobile: 'min-h-12 md:min-h-10',
};

/**
 * Gesture Handler Component
 * Handles swipe and tap gestures for mobile
 */
interface GestureHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}

export const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = '',
}) => {
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = {
      x: touchStart.x - touchEnd.x,
      y: touchStart.y - touchEnd.y,
    };

    const isLeftSwipe = distance.x > minSwipeDistance;
    const isRightSwipe = distance.x < -minSwipeDistance;
    const isUpSwipe = distance.y > minSwipeDistance;
    const isDownSwipe = distance.y < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
    if (isUpSwipe && onSwipeUp) onSwipeUp();
    if (isDownSwipe && onSwipeDown) onSwipeDown();
  };

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
};

/**
 * Mobile-Responsive Typography Sizes
 * Ensures readability on all screen sizes
 */
export const ResponsiveTypography = {
  // Hero heading
  heroTitle: 'text-4xl md:text-6xl lg:text-7xl font-black',

  // Page heading
  pageTitle: 'text-3xl md:text-4xl lg:text-5xl font-bold',

  // Section heading
  sectionTitle: 'text-2xl md:text-3xl lg:text-4xl font-bold',

  // Card heading
  cardTitle: 'text-lg md:text-xl lg:text-2xl font-semibold',

  // Body text
  body: 'text-sm md:text-base lg:text-lg',

  // Small text
  small: 'text-xs md:text-sm lg:text-base',

  // Caption
  caption: 'text-xs md:text-sm text-gray-500',
};

/**
 * Mobile Navigation Spacing
 * Safe area insets for notched devices
 */
export const MobileNavigationSafe = {
  topSafe: 'pt-safe md:pt-0',
  bottomSafe: 'pb-safe md:pb-0',
  leftSafe: 'pl-safe md:pl-0',
  rightSafe: 'pr-safe md:pr-0',
};

/**
 * Haptic Feedback Hook (for browsers that support it)
 */
export const useHapticFeedback = () => {
  const trigger = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const durations: Record<string, number> = {
        light: 10,
        medium: 20,
        heavy: 30,
      };
      navigator.vibrate(durations[intensity]);
    }
  };

  return { trigger };
};

/**
 * Viewport Height Helper
 * Accounts for mobile browser address bar
 */
export const useViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = React.useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );

  React.useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('orientationchange', updateHeight);
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('orientationchange', updateHeight);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return viewportHeight;
};

export default TouchTarget;
