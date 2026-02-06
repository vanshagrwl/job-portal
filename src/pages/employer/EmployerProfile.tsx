import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EmployerProfile as EmployerProfileType, profileAPI, authAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { Building, Globe, MapPin, Edit2 } from 'lucide-react';
import EditNameModal from '../../components/EditNameModal';

export default function EmployerProfilePage() {
  const { user, token, profile, updateProfile, refreshProfile } = useAuth();
  const [employerProfile, setEmployerProfile] = useState<EmployerProfileType | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [about, setAbout] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editNameLoading, setEditNameLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  const fetchProfile = async () => {
    if (!user || !token) return;

    try {
      const data = await profileAPI.getEmployerProfile(token);
      setEmployerProfile(data);
      setCompanyName(data.company_name || '');
      setAbout(data.about_company || '');
      setIndustry(data.industry || '');
      setCompanySize(data.company_size || '');
      setWebsite(data.website || '');
      setLocation(data.location || '');
      setPhone(data.phone || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async (newName: string) => {
    if (!user || !token) {
      throw new Error('User or token not available');
    }

    setEditNameLoading(true);
    try {
      console.log('=== Updating employer profile with name:', newName);
      const result = await profileAPI.updateEmployerProfile({ full_name: newName }, token);
      console.log('✓ API response received:', result);
      
      // Update local employer profile state
      setEmployerProfile(prev => prev ? { ...prev, full_name: newName } : null);
      console.log('✓ Local employerProfile state updated');
      
      // Update AuthContext
      updateProfile({ full_name: newName });
      console.log('✓ AuthContext profile updated');
      
      // Refresh from MongoDB to ensure we have the latest data
      console.log('✓ Refreshing profile from MongoDB...');
      await refreshProfile();
      console.log('✓ Profile refreshed from MongoDB');
      
      alert('Name updated successfully!');
    } catch (error: any) {
      console.error('❌ Error updating name:', error.message);
      throw new Error(error.message || 'Failed to update name. Please try again.');
    } finally {
      setEditNameLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !token) return;

    setSaving(true);
    try {
      const payload = {
        company_name: companyName,
        about_company: about,
        industry,
        company_size: companySize,
        website,
        location,
        phone: phone
      };
      
      console.log('Saving employer profile with payload:', payload);
      console.log('Token:', token.substring(0, 20) + '...');

      const result = await profileAPI.updateEmployerProfile(payload, token);
      
      console.log('Save result:', result);
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Company Profile</h1>
            <p className="text-gray-400">Manage your company information and contact details</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditNameOpen(true)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 text-purple-300 hover:text-purple-200 transition-all text-sm border border-purple-500/30 hover:border-purple-500/50 backdrop-blur-sm whitespace-nowrap shadow-lg hover:shadow-xl"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Name</span>
          </motion.button>
        </div>

        <GlassCard className="p-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 pb-6 border-b border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{companyName || 'Your Company'}</h2>
                <p className="text-gray-400">Company details and contact information</p>
              </div>
            </div>

            <Input
              label="Company Name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company Inc."
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                About Company
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="Tell job seekers about your company..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Technology, Finance"
              />

              <Input
                label="Company Size"
                type="text"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                placeholder="e.g., 50-200, 200-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <PhoneInput
              value={phone}
              onChange={(value) => setPhone(value)}
              label="Contact Phone"
              placeholder="Enter phone number with country code"
            />

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

      {/* Edit Name Modal */}
      <EditNameModal
        isOpen={editNameOpen}
        onClose={() => setEditNameOpen(false)}
        currentName={profile?.full_name || ''}
        onSave={handleSaveName}
        loading={editNameLoading}
        title="Edit Your Name"
        label="Full Name"
      />
    </Layout>
  );
}
