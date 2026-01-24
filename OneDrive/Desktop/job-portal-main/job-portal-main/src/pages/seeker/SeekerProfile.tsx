import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SeekerProfile as SeekerProfileType, profileAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { Upload, FileText, X } from 'lucide-react';

export default function SeekerProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<SeekerProfileType | null>(null);
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
      setProfile(data);
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

      // Add resume file if selected
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      console.log('Saving seeker profile with:', { skills, bio, location, phone, hasResume: !!resumeFile });
      console.log('Token:', token.substring(0, 20) + '...');

      // Use FormData with file upload
      const response = await fetch('http://localhost:5000/api/profile/seeker', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      console.log('Seeker profile save response status:', response.status);
      const updatedProfile = await response.json();
      console.log('Seeker profile save response:', updatedProfile);
      
      if (!response.ok) {
        console.error('Server error response:', updatedProfile);
        throw new Error(updatedProfile?.error || `HTTP ${response.status}: Failed to save profile`);
      }

      setProfile(updatedProfile);
      setResumeUrl(updatedProfile.resume_url || '');
      setResumeFile(null);
      setResumeName('');
      alert('Profile saved successfully!');
      fetchProfile();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      alert(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-gray-400">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Keep your profile updated to attract employers</p>
        </div>

        <GlassCard className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="Tell employers about yourself..."
              />
            </div>

            <Input
              label="Location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
            />

            <PhoneInput
              value={phone}
              onChange={(value) => setPhone(value)}
              label="Contact Phone"
              placeholder="Enter phone number with country code"
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skills
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add a skill"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <Button variant="secondary" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-blue-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resume
              </label>
              {resumeUrl && !resumeFile && (
                <div className="mb-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-400">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Resume uploaded</span>
                  </div>
                  <span className="text-sm text-blue-400">
                    {resumeUrl.split('/').pop()}
                  </span>
                </div>
              )}
              <label className="block">
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-white mb-1">
                    {resumeFile ? resumeFile.name : 'Click to upload resume'}
                  </p>
                  <p className="text-sm text-gray-400">PDF or DOCX (Max 5MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </Layout>
  );
}
