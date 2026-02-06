/**
 * Search & Filter Animations
 * 
 * Enhanced animations for search interactions, filter drawer polish,
 * and suggestion lists with smooth transitions and micro-interactions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  isLoading?: boolean;
}

/**
 * Animated Search Input Component
 * Features smooth expansion, suggestion list animations, and loading states
 */
export const AnimatedSearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  suggestions = [],
  onSuggestionSelect,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setShowSuggestions(isExpanded && value.length > 0 && suggestions.length > 0);
  }, [isExpanded, value, suggestions]);

  const handleClear = () => {
    onChange('');
    setIsExpanded(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <motion.div
        className="relative"
        animate={{ width: isExpanded ? '100%' : 'auto' }}
      >
        <div className="flex items-center gap-2 relative">
          <motion.div
            className="absolute left-0 h-full flex items-center pointer-events-none"
            animate={{ left: isExpanded ? '14px' : '12px' }}
          >
            <Search className="w-4 h-4 text-gray-400" />
          </motion.div>

          <motion.input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-${value ? '10' : '4'} py-2 rounded-lg
              bg-white/10 border-2 border-white/20
              text-white placeholder-gray-500
              focus:outline-none focus:border-blue-500 focus:bg-white/15
              transition-all duration-300
            `}
            initial={{ borderRadius: '50px' }}
            animate={{
              borderRadius: isExpanded ? '8px' : '50px',
              width: isExpanded ? '100%' : '200px',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Clear Button */}
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={handleClear}
                className="absolute right-3 p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Loading Spinner */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute right-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-xl z-50 max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white/20 transition-colors border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3 h-3 text-gray-500" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

/**
 * Filter Button with Animated Badge
 */
interface FilterButtonProps {
  label: string;
  options: string[];
  selected: string[];
  onSelect: (option: string) => void;
  onClear?: () => void;
  icon?: React.ReactNode;
}

export const AnimatedFilterButton: React.FC<FilterButtonProps> = ({
  label,
  options,
  selected,
  onSelect,
  onClear,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-white transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
        {selected.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-1 px-2 py-0.5 rounded-full bg-blue-500/50 text-xs text-white"
          >
            {selected.length}
          </motion.span>
        )}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-xl z-50 min-w-44"
          >
            {options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(option)}
                className={`
                  w-full px-4 py-2 text-left text-sm transition-colors
                  ${selected.includes(option) ? 'bg-blue-500/30 text-white' : 'text-gray-200 hover:bg-white/10'}
                  border-b border-white/5 last:border-b-0
                `}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    readOnly
                    className="w-4 h-4 rounded bg-white/20 border-white/30 accent-blue-500"
                  />
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
            {selected.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClear}
                className="w-full px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5"
              >
                Clear filters
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Filter Drawer with Smooth Animations
 */
interface FilterDrawerContentProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  filters: {
    label: string;
    options: string[];
    selected: string[];
    onSelect: (option: string) => void;
  }[];
  onApply?: () => void;
}

export const AnimatedFilterDrawer: React.FC<FilterDrawerContentProps> = ({
  title,
  isOpen,
  onClose,
  filters,
  onApply,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-gray-900 to-black border-l border-white/10 z-50 overflow-y-auto"
          >
            {/* Header */}
            <motion.div className="sticky top-0 px-6 py-4 border-b border-white/10 bg-gradient-to-b from-gray-900 to-gray-900/50">
              <div className="flex items-center justify-between">
                <motion.h2 className="text-xl font-semibold text-white">{title}</motion.h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </motion.div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {filters.map((filter, idx) => (
                <motion.div
                  key={filter.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h3 className="text-sm font-semibold text-white mb-3">{filter.label}</h3>
                  <div className="space-y-2">
                    {filter.options.map((option, optIdx) => (
                      <motion.label
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + optIdx * 0.05 }}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filter.selected.includes(option)}
                          onChange={() => filter.onSelect(option)}
                          className="w-4 h-4 rounded bg-white/10 border border-white/30 accent-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <motion.div className="sticky bottom-0 px-6 py-4 border-t border-white/10 bg-gradient-to-t from-gray-900 to-gray-900/50 flex gap-3">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onApply}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Apply
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSearchInput;
