import { motion } from 'framer-motion';
import { MapPin, Banknote, Briefcase, ArrowRight } from 'lucide-react';
import { Job } from '../lib/api';
import Button from './Button';
import Card from './Card';
import { useMotionConfig } from '../lib/motion';

interface StackedJobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
  theme?: 'employer' | 'seeker';
  index?: number;
  applied?: boolean;
}

export default function StackedJobCard({
  job,
  onViewDetails,
  theme = 'seeker',
  index = 0,
  applied = false,
}: StackedJobCardProps) {
  const motionCfg = useMotionConfig();

  return (
    <motion.div
      // Simple fade-in, no side sliding
      initial={motionCfg.cardInitial}
      animate={motionCfg.cardAnimate}
      transition={{
        delay: index * motionCfg.listStagger,
        ...motionCfg.cardTransition,
      }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Card
        theme={theme}
        stackEffect={true}
        glow={false}
        className="p-6 cursor-pointer group overflow-hidden h-full flex flex-col min-h-[400px]"
      >
        {/* Top section with company and title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 flex items-center gap-4">
              {/* Company logo if present */}
              {job.employer_profile?.company_logo_url ? (
                <img src={job.employer_profile.company_logo_url} alt="logo" className="w-10 h-10 rounded-md object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-sm text-gray-300">{(job.employer_profile?.company_name||'')[0] || 'C'}</div>
              )}
              <div>
                <motion.h3
                  className={`text-xl font-bold mb-1 ${
                    theme === 'employer'
                      ? 'text-employer-primary'
                      : 'text-seeker-primary'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {job.title}
                </motion.h3>
                <p className="text-gray-600 text-sm">
                  {job.employer_profile?.company_name || 'Company Name'}
                </p>
              </div>
            </div>
          <motion.div
            className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
              theme === 'employer'
                ? 'bg-gradient-employer'
                : 'bg-gradient-seeker'
            }`}
            whileHover={{ scale: 1.1 }}
          >
            {job.job_type || 'Full-time'}
          </motion.div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-200">
          {/* Location */}
          <motion.div
            className="flex items-center gap-2 text-gray-600"
            whileHover={{ x: 2 }}
          >
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{job.location || 'Remote'}</span>
          </motion.div>

          {/* Salary */}
          <motion.div
            className="flex items-center gap-2 text-gray-600"
            whileHover={{ x: 2 }}
          >
            <Banknote className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {job.salary_max ? `₹${job.salary_max}` : 'Competitive'}
            </span>
          </motion.div>

          {/* Category */}
          <motion.div
            className="flex items-center gap-2 text-gray-600"
            whileHover={{ x: 2 }}
          >
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{job.category || 'Tech'}</span>
          </motion.div>

          {/* Posted Date */}
          <motion.div
            className="flex items-center gap-2 text-gray-600"
            whileHover={{ x: 2 }}
          >
            <span className="text-sm">
              {new Date(job.created_at).toLocaleDateString()}
            </span>
          </motion.div>
        </div>

        {/* Description snippet */}
        <motion.p
          className="text-gray-700 text-sm mb-5 line-clamp-2 flex-grow"
          whileHover={{ color: '#000000' }}
        >
          {job.description}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-auto w-full"
        >
          {applied ? (
            <div className="flex items-center justify-between w-full">
              <span className="px-3 py-2 rounded-full bg-emerald-600/20 text-emerald-300 text-sm font-semibold">Applied</span>
              <Button variant="secondary" className="text-sm" onClick={() => onViewDetails(job._id)}>
                View
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              theme={theme}
              onClick={() => onViewDetails(job._id)}
              className="w-full flex items-center justify-center gap-2"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </motion.div>

        {/* Hover indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent"
          initial={{ scaleX: 0 }}
          whileHover={{
            scaleX: 1,
            backgroundImage:
              theme === 'employer'
                ? 'linear-gradient(to right, transparent, rgb(30, 58, 138))'
                : 'linear-gradient(to right, transparent, rgb(124, 58, 237))',
          }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
