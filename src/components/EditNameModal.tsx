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

export default function EditNameModal({ isOpen, onClose, currentName, onSave, loading = false, title = 'Edit Name', label = 'Full Name' }: EditNameModalProps) {
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-[100] p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && handleSave()}
                  placeholder="Enter your full name"
                  autoFocus
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={loading}
                    className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </motion.div>
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
