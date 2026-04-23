import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Building2, Briefcase, Save, Edit2, X } from 'lucide-react';
import { getCurrentProfile, updateProfile, updateAvatar } from '../services/api';
import MainLayout from '../components/layout/MainLayout';

/**
 * Profile Page
 * Display and edit user profile information
 */

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    company: '',
    jobTitle: ''
  });

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await getCurrentProfile();
      if (response.success && response.profile) {
        setProfile(response.profile);
        setFormData({
          name: response.profile.name || '',
          email: response.profile.email || '',
          bio: response.profile.bio || '',
          phone: response.profile.phone || '',
          location: response.profile.location || '',
          website: response.profile.website || '',
          company: response.profile.company || '',
          jobTitle: response.profile.jobTitle || ''
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Error loading profile: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setProfile(response.profile);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Error saving profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        company: profile.company || '',
        jobTitle: profile.jobTitle || ''
      });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, use DiceBear API to generate avatar from name
      const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`;
      try {
        const response = await updateAvatar(newAvatarUrl);
        if (response.success) {
          setProfile(response.profile);
          setSuccess('Avatar updated!');
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (err) {
        setError('Error updating avatar');
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>

        {/* Alert Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
              <X size={20} />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg flex items-center justify-between"
          >
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-300">
              <X size={20} />
            </button>
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-8 mb-8"
        >
          {/* Avatar Section */}
          <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-700">
            <div className="relative">
              <img
                src={profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-2 border-blue-500"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition">
                  <Edit2 size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
              <p className="text-gray-400 flex items-center gap-2 mt-2">
                <Mail size={16} />
                {profile?.email}
              </p>
              {profile?.isProfileComplete && (
                <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  ✓ Profile Complete
                </span>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                />
              ) : (
                <p className="text-gray-300">{formData.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <p className="text-gray-400">{formData.email}</p>
              <span className="text-xs text-gray-500 mt-1">Email cannot be changed</span>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition resize-none"
                />
              ) : (
                <p className="text-gray-300">{formData.bio || '—'}</p>
              )}
            </div>

            {/* Grid Layout for Contact & Professional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-300">{formData.phone || '—'}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-300">{formData.location || '—'}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Globe size={16} />
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-300">
                    {formData.website ? (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {formData.website}
                      </a>
                    ) : (
                      '—'
                    )}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Building2 size={16} />
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company Name"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-300">{formData.company || '—'}</p>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Briefcase size={16} />
                  Job Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="Your job title"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                ) : (
                  <p className="text-gray-300">{formData.jobTitle || '—'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 pt-8 border-t border-gray-700 flex gap-4"
            >
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition font-medium"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition font-medium"
              >
                <X size={18} />
                Cancel
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Account Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Member Since</p>
              <p className="text-white font-medium">
                {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Last Updated</p>
              <p className="text-white font-medium">
                {new Date(profile?.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
