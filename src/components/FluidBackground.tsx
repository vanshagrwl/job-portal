import { motion } from 'framer-motion';

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Premium base gradient background - sophisticated dark to darker */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />

      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />

      {/* Primary blue-cyan gradient blob - subtle */}
      <motion.div
        className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-blue-600/8 to-cyan-500/8 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary emerald-teal gradient blob - subtle */}
      <motion.div
        className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-600/6 to-teal-500/6 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Tertiary rose-orange gradient blob - subtle */}
      <motion.div
        className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-rose-600/5 to-orange-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 120, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Quaternary amber-yellow gradient blob - subtle */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-amber-600/6 to-yellow-500/6 rounded-full blur-3xl"
        animate={{
          x: [0, -60, 0],
          y: [0, 60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Additional accent blob - purple-pink - subtle */}
      <motion.div
        className="absolute top-1/2 -right-32 w-[350px] h-[350px] bg-gradient-to-br from-purple-600/5 to-pink-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -60, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Light accent blob - cyan-blue - subtle */}
      <motion.div
        className="absolute -bottom-20 right-1/3 w-[280px] h-[280px] bg-gradient-to-br from-cyan-400/3 to-blue-400/3 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-gray-900/40 pointer-events-none" />

      {/* Optional animated light rays effect */}
      <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
