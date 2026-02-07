import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SeekerProfile as SeekerProfileType, profileAPI, API_URL } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import PageLoader from '../../components/PageLoader';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

export default function SeekerProfilePage() {
  const { user, token, profile, updateProfile, refreshProfile } = useAuth();
  const [seekerProfile, setSeekerProfile] = useState<SeekerProfileType | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeName, setResumeName] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  const fetchProfile = async () => {
    if (!user || !token) return;

    try {
      const data = await profileAPI.getSeekerProfile(token);
      setSeekerProfile(data);
      setSkills(data.skills || []);
      setBio(data.bio || '');
      setLocation(data.location || '');
      setPhone(data.phone || '');
      setResumeUrl(data.resume_url || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeFile(file);
        setResumeName(file.name);
      } else {
        alert('Please upload a PDF or DOCX file');
      }
    }
  };

  const handleSave = async () => {
    if (!user || !token) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('skills', JSON.stringify(skills));
      formData.append('bio', bio);
      formData.append('location', location);
      formData.append('phone', phone);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await fetch(`${API_URL}/profile/seeker`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const updatedProfile = await response.json();
      
      if (!response.ok) {
        throw new Error(updatedProfile?.error || `HTTP ${response.status}: Failed to save profile`);
      }

      setSeekerProfile(updatedProfile);
      setResumeUrl(updatedProfile.resume_url || '');
      setResumeFile(null);
      setResumeName('');
      alert('Profile saved successfully!');
      // Update auth context so profile completion and other UI update in real-time
      try {
        // Refresh profile first to get fresh data from server, which sets profileUpdatedAt
        await refreshProfile();
        // Small delay to ensure server data is consistent
        await new Promise(resolve => setTimeout(resolve, 300));
        // Then update specific fields in auth context
        updateProfile({
          full_name: (updatedProfile.full_name as string) || undefined,
          phone: (updatedProfile.phone as string) || undefined,
        });
      } catch (e) {
        // Non-fatal - UI already updated locally
        console.warn('Could not refresh auth profile after save', e);
      }
      // Final fetch to ensure consistency
      fetchProfile();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return <PageLoader text="Loading your profile..." />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400 text-sm sm:text-base">Keep your profile updated to attract employers</p>
        </motion.div>

        {/* Main Card */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6 sm:space-y-8">
              
              {/* Bio Section */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-200 mb-3">About You</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none transition-all duration-300"
                  placeholder="Tell employers about yourself and your career goals..."
                />
              </motion.div>

              {/* Location & Phone Section */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Input
                    label="Location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <PhoneInput
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    label="Contact Phone"
                    placeholder="Enter phone number"
                  />
                </div>
              </motion.div>

              {/* Skills Section */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Professional Skills</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Add a skill and press Enter"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  />
                  <Button 
                    variant="secondary" 
                    onClick={handleAddSkill}
                    className="w-full sm:w-auto"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 border border-blue-500/30 rounded-full text-sm font-medium hover:border-blue-500/50 transition-all duration-300"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-blue-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Resume Section */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-200 mb-4">Professional Resume</label>
                
                {/* Resume Status Badge */}
                {resumeUrl && !resumeFile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="p-2 bg-emerald-500/20 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </motion.div>
                        <div>
                          <p className="text-sm font-semibold text-emerald-300">Resume Active</p>
                          <p className="text-xs text-emerald-200/70">Your profile is complete</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full">✓</span>
                    </div>
                  </motion.div>
                )}

                {/* Upload Area */}
                <label className="block cursor-pointer">
                  <motion.div
                    whileHover={{ borderColor: 'rgba(59, 130, 246, 0.5)', backgroundColor: 'rgba(59, 130, 246, 0.03)' }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-dashed border-white/20 rounded-xl p-6 sm:p-8 lg:p-10 text-center transition-all duration-300 hover:bg-blue-500/5"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="mb-3"
                    >
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-blue-400/60" />
                    </motion.div>
                    <p className="text-white font-semibold text-sm sm:text-base mb-1">
                      {resumeFile ? resumeFile.name : 'Upload Your Resume'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      PDF or DOCX • Max 5MB • Click or drag to upload
                    </p>
                  </motion.div>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </motion.div>

              {/* Save Button */}
              <motion.div variants={itemVariants}>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold"
                >
                  {saving ? (
                    <span className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ⚙
                      </motion.div>
                      <span>Saving...</span>
                    </span>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

    </Layout>
  );
}
