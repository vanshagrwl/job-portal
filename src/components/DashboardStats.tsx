import React, { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import { applicationsAPI, jobsAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Users, Eye, CheckCircle } from 'lucide-react';

export default function DashboardStats() {
  const { token, user, profile } = useAuth();
  const [myAppsCount, setMyAppsCount] = useState(0);
  const [openJobsCount, setOpenJobsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!token || !user) return;

    const load = async () => {
      try {
        // Load seeker applications and derive counts
        if (profile?.role === 'seeker') {
          try {
            const apps = await applicationsAPI.getMyApplications(token);
            const items = apps || [];
            setMyAppsCount(items.length);
            // Pending = not yet viewed by employer
            setPendingCount(items.filter((a: any) => a.status === 'pending' || a.status === 'viewed').length || 0);
            // Completed = has a final decision (shortlisted or rejected)
            setCompletedCount(items.filter((a: any) => a.status === 'shortlisted' || a.status === 'rejected').length || 0);
          } catch (e) {
            console.warn('Failed to load seeker apps', e);
            setMyAppsCount(0);
            setPendingCount(0);
            setCompletedCount(0);
          }
        }

        // Load jobs (for both seeker and employer)
        try {
          const allJobs = await jobsAPI.getAll();
          if (profile?.role === 'employer') {
            const myJobs = allJobs.filter((j: any) => j.employer_id === user._id);
            setOpenJobsCount(myJobs.filter((j: any) => j.status === 'active').length);
          } else {
            // For seekers show total active job openings
            setOpenJobsCount(allJobs.filter((j: any) => j.status === 'active').length);
          }
        } catch (e) {
          console.warn('Failed to load jobs', e);
          setOpenJobsCount(0);
        }

        // Load employer applications (pending) when employer
        if (profile?.role === 'employer') {
          try {
            const empApps = await applicationsAPI.getEmployerApplications(token);
            // Pending = applications waiting for employer review
            setPendingCount(empApps?.filter((a: any) => a.status === 'pending').length || 0);
            // Completed = has a final decision (shortlisted or rejected)
            setCompletedCount(empApps?.filter((a: any) => a.status === 'shortlisted' || a.status === 'rejected').length || 0);
          } catch (e) {
            console.warn('Failed to load employer apps', e);
            setPendingCount(0);
            setCompletedCount(0);
          }
        }
      } catch (e) {
        console.error('Error loading dashboard stats', e);
      }
    };

    // initial load
    load();

    // keep stats fresh by polling periodically
    const interval = setInterval(() => {
      load();
    }, 10000); // refresh every 10s

    return () => clearInterval(interval);
  }, [token, user, profile?.role, profile?.profileUpdatedAt, profile]);

  const stats = [
    { label: 'My Applications', value: myAppsCount, icon: Users, color: 'from-blue-600 to-cyan-500' },
    { label: 'Open Jobs', value: openJobsCount, icon: Briefcase, color: 'from-emerald-600 to-teal-500' },
    { label: 'Pending Reviews', value: pendingCount, icon: Eye, color: 'from-amber-500 to-orange-400' },
    { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'from-rose-500 to-pink-400' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => (
        <GlassCard key={idx} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${s.color}`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
