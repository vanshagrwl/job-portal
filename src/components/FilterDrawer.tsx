import { motion } from 'framer-motion';
import Drawer from './Drawer';
import Button from './Button';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  categories?: Array<{ value: string; label: string }>;
  theme?: 'employer' | 'seeker';
}

// Responsive stagger timing based on viewport
const getStaggerDelay = (index: number) => index * 0.05;

export default function FilterDrawer({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  locationFilter,
  onLocationChange,
  categoryFilter,
  onCategoryChange,
  onReset,
  categories = [],
  theme = 'seeker',
}: FilterDrawerProps) {
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      theme={theme}
      position="right"
      width="w-80"
    >
      <motion.div
        className="space-y-3 sm:space-y-4"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {/* Search Field */}
        <motion.div custom={0} variants={itemVariants}>
          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
            Job Title or Keyword
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="e.g., Frontend Developer"
            className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
          />
        </motion.div>

        {/* Location Filter */}
        <motion.div custom={1} variants={itemVariants}>
          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="e.g., New York, Remote"
            className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <motion.div custom={2} variants={itemVariants}>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Filter Actions */}
        <motion.div
          custom={3}
          variants={itemVariants}
          className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
            <Button
              variant="secondary"
              theme={theme}
              onClick={onReset}
              className="w-full text-xs sm:text-sm py-1.5 sm:py-2"
            >
              Reset
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
            <Button
              variant="primary"
              theme={theme}
              onClick={onClose}
              className="w-full text-xs sm:text-sm py-1.5 sm:py-2"
            >
              Apply
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Drawer>
  );
}
