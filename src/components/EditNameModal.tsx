import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => Promise<void>;
  loading?: boolean;
  title?: string;
  label?: string;
}

export default function EditNameModal({ 
  isOpen, 
  onClose, 
  currentName, 
  onSave, 
  loading = false, 
  title = 'Edit Name', 
  label = 'Full Name' 
}: EditNameModalProps) {
  const [newName, setNewName] = useState(currentName);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (newName === currentName) {
      onClose();
      return;
    }

    try {
      setError('');
      await onSave(newName.trim());
      onClose();
    } catch (err: any) {
      console.error('Modal save error:', err);
      const errorMsg = err.message || 'Failed to update name';
      setError(errorMsg);
    }
  };

  const handleClose = () => {
    setNewName(currentName);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Responsive Overlay with Glassmorphism Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[90]"
          />

          {/* Responsive Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 60 }}
            transition={{ type: 'spring', stiffness: 280, damping: 35 }}
            className="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6"
          >
            {/* Glass Card Modal with Glassmorphism */}
            <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />

              {/* Header */}
              <div className="relative bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-xl p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  {title}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/80 hover:text-white" />
                </motion.button>
              </div>

              {/* Body */}
              <div className="relative p-4 sm:p-6 space-y-5">
                {/* Label */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2.5 uppercase tracking-wide">
                    {label}
                  </label>

                  {/* Input Field with Glassmorphism */}
                  <motion.input
                    type="text"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && handleSave()}
                    placeholder="Enter your full name"
                    autoFocus
                    whileFocus={{ scale: 1.02 }}
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all text-sm sm:text-base font-medium"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg"
                    >
                      <p className="text-sm text-red-300">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 transition-all font-medium text-sm sm:text-base disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-sm sm:text-base transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
