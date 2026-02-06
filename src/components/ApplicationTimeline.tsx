import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

interface TimelineStep {
  status: 'pending' | 'viewed' | 'shortlisted' | 'rejected';
  date?: string;
}

interface ApplicationTimelineProps {
  status: 'pending' | 'viewed' | 'shortlisted' | 'rejected';
  appliedDate: string;
  viewedDate?: string;
  shortlistedDate?: string;
  rejectedDate?: string;
}

export default function ApplicationTimeline({
  status,
  appliedDate,
  viewedDate,
  shortlistedDate,
  rejectedDate,
}: ApplicationTimelineProps) {
  const steps: TimelineStep[] = [
    { status: 'pending', date: appliedDate },
    { status: 'viewed', date: viewedDate },
    { status: 'shortlisted', date: shortlistedDate },
    { status: 'rejected', date: rejectedDate },
  ];

  const statusConfig = {
    pending: { color: 'bg-amber-500/20 text-amber-400', icon: Clock, label: 'Applied' },
    viewed: { color: 'bg-blue-500/20 text-blue-400', icon: Eye, label: 'Viewed' },
    shortlisted: {
      color: 'bg-emerald-500/20 text-emerald-400',
      icon: CheckCircle,
      label: 'Shortlisted',
    },
    rejected: { color: 'bg-rose-500/20 text-rose-400', icon: XCircle, label: 'Rejected' },
  };

  const isStepActive = (stepStatus: string): boolean => {
    const statusOrder = ['pending', 'viewed', 'shortlisted', 'rejected'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepStatus);
    return stepIndex <= currentIndex;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2" />

        {/* Steps */}
        {statusConfig && Object.entries(statusConfig).map(([key, config], idx) => {
          const active = isStepActive(key);
          const Icon = config.icon;

          return (
            <motion.div
              key={key}
              className="relative flex flex-col items-center gap-2 flex-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* Circle */}
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                  active ? config.color : 'bg-white/10 text-white/40'
                }`}
                whileHover={{ scale: 1.15 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              {/* Label and date */}
              <div className="text-center">
                <p className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-500'}`}>
                  {config.label}
                </p>
                <p className={`text-xs ${active ? 'text-gray-300' : 'text-gray-600'}`}>
                  {formatDate(steps[idx].date)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
