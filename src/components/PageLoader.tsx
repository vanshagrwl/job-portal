import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PageLoader({ text = 'Loading...', size = 'lg' }: PageLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50"
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={size} color="cyan" text={text} />
      </div>
    </motion.div>
  );
}
