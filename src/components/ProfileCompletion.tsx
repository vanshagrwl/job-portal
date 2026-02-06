import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileCompletion() {
  const { profile } = useAuth();

  if (!profile) return null;

  // Compute completion: full_name, phone, email, (for seeker additional checks handled by page)
  let parts = 3; // base: full_name, email, phone
  let filled = 0;
  if (profile.full_name && profile.full_name.trim() !== '') filled++;
  if (profile.email && profile.email.trim() !== '') filled++;
  if (profile.phone && profile.phone.trim() !== '') filled++;

  const percent = Math.round((filled / parts) * 100);

  return (
    <div className="w-full max-w-xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-300">Profile Completion</p>
        <p className="text-sm font-medium text-white">{percent}%</p>
      </div>
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
