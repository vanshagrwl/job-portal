import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../lib/api';

export default function ProfileCompletion() {
  const { profile, token, profileUpdatedAt } = useAuth();
  const [seekerDetails, setSeekerDetails] = useState<any | null>(null);
  const [employerDetails, setEmployerDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDetails = async () => {
      if (!profile || !token) return;
      setLoading(true);
      try {
        if (profile.role === 'seeker') {
          const data = await profileAPI.getSeekerProfile(token);
          if (mounted) setSeekerDetails(data);
        } else if (profile.role === 'employer') {
          const data = await profileAPI.getEmployerProfile(token);
          if (mounted) setEmployerDetails(data);
        }
      } catch (err) {
        console.warn('Could not fetch profile details for completion bar', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDetails();
    return () => { mounted = false; };
    // Include profileUpdatedAt so details are refetched after an auth refresh
  }, [profile, token, profileUpdatedAt]);

  if (!profile) return null;

  // Base fields (common to both seeker and employer)
  let parts = 0;
  let filled = 0;

  // Base fields: full_name, email, phone
  parts = 3;
  if (profile.full_name && profile.full_name.trim() !== '') filled++;
  if (profile.email && profile.email.trim() !== '') filled++;
  if (profile.phone && profile.phone.trim() !== '') filled++;

  // If seeker, consider extra fields for a more granular score
  if (profile.role === 'seeker') {
    parts += 4; // bio, skills, resume, location
    if (seekerDetails) {
      if (seekerDetails.bio && seekerDetails.bio.trim() !== '') filled++;
      if (Array.isArray(seekerDetails.skills) && seekerDetails.skills.length > 0) filled++;
      if (seekerDetails.resume_url && seekerDetails.resume_url.trim() !== '') filled++;
      if (seekerDetails.location && seekerDetails.location.trim() !== '') filled++;
    }
  } else if (profile.role === 'employer') {
    // For employer: company_name, about_company, industry, website, location
    parts += 5;
    if (employerDetails) {
      if (employerDetails.company_name && employerDetails.company_name.trim() !== '') filled++;
      if (employerDetails.about_company && employerDetails.about_company.trim() !== '') filled++;
      if (employerDetails.industry && employerDetails.industry.trim() !== '') filled++;
      if (employerDetails.website && employerDetails.website.trim() !== '') filled++;
      if (employerDetails.location && employerDetails.location.trim() !== '') filled++;
    }
  }

  const percent = Math.round((filled / parts) * 100);

  return (
    <div className="w-full max-w-xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-300">Profile Completion</p>
        <p className="text-sm font-medium text-white">{percent}%</p>
      </div>
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-500 transition-width duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
