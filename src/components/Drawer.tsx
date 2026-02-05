import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  position?: 'right' | 'left';
  width?: string;
  theme?: 'employer' | 'seeker';
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'w-96',
  theme = 'seeker',
}: DrawerProps) {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const headerBg = theme === 'employer'
    ? 'bg-gradient-employer'
    : 'bg-gradient-seeker';

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    if (isOpen) {
      // Prevent background from scrolling while drawer is open.
      // Also compensate for scrollbar width to avoid layout shift.
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.paddingRight = originalPaddingRight || '';
    }

    return () => {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.paddingRight = originalPaddingRight || '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
          />

          {/* Drawer - Responsive: full width on mobile, fixed width on desktop */}
          <motion.div
            initial={{ x: position === 'right' ? 400 : -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: position === 'right' ? 400 : -400, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className={`fixed top-16 ${position}-0 h-[calc(100%-4rem)] bg-white shadow-2xl z-[70] flex flex-col overflow-hidden w-full md:w-96`}
          >
            {/* Header */}
            <div className={`${headerBg} p-4 sm:p-6 flex items-center justify-between text-white flex-shrink-0`}>
              <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Lock background scrolling when the drawer is open
// We add a small helper to toggle body scroll when `isOpen` changes.
// Move this logic inside the component so it runs with the proper `isOpen`.
