import { motion } from 'framer-motion';

export default function LoadingSkeletonCard() {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="space-y-4">
        <div className="h-6 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
        <div className="h-10 bg-white/10 rounded w-1/3 mt-6" />
      </div>
    </motion.div>
  );
}
