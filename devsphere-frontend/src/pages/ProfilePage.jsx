import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, X, AlertCircle, Key, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentProfile, updateProfile, updateAvatar, getProfileStats, changePassword } from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import AvatarUpload from '../components/profile/AvatarUpload';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileStats from '../components/profile/ProfileStats';
import { ProfileCardSkeleton } from '../components/animations/SkeletonLoader';
import toast from 'react-hot-toast';

/**
 * Profile Page
 * User profile management, password updating, and activity statistics
 */
function ProfilePage() {
  // State Management
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Form State
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

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        getCurrentProfile(),
        getProfileStats()
      ]);

      if (profileRes.success && profileRes.profile) {
        setProfile(profileRes.profile);
        setFormData({
          name: profileRes.profile.name || '',
          email: profileRes.profile.email || '',
          bio: profileRes.profile.bio || '',
          phone: profileRes.profile.phone || '',
          location: profileRes.profile.location || '',
          website: profileRes.profile.website || '',
          company: profileRes.profile.company || '',
          jobTitle: profileRes.profile.jobTitle || ''
        });
      } else {
        toast.error('Failed to load profile settings');
      }

      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      toast.error('Error loading profile: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateFormData = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      errors.name = 'Name cannot exceed 100 characters';
    }

    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Website must be a valid URL starting with http:// or https://';
    }

    if (formData.phone && formData.phone.length > 20) {
      errors.phone = 'Phone cannot exceed 20 characters';
    }

    if (formData.location && formData.location.length > 100) {
      errors.location = 'Location cannot exceed 100 characters';
    }

    if (formData.company && formData.company.length > 100) {
      errors.company = 'Company cannot exceed 100 characters';
    }

    if (formData.jobTitle && formData.jobTitle.length > 100) {
      errors.jobTitle = 'Job title cannot exceed 100 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (!validateFormData()) {
      toast.error('Please fix the validation errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setProfile(response.profile);
        setIsEditing(false);
        toast.success('Profile updated successfully!');

        // Reload stats to reflect completeness percentage changes
        const statsRes = await getProfileStats();
        if (statsRes.success) {
          setStats(statsRes.stats);
        }
      } else {
        const errorMsg = response.errors?.join(', ') || 'Failed to update profile';
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error('Error saving profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors({});
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

  const handleAvatarChange = async () => {
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'user'}_${Date.now()}`;
    try {
      const response = await updateAvatar(newAvatarUrl);
      if (response.success) {
        setProfile(response.profile);
        toast.success('Avatar generated successfully!');
      } else {
        toast.error('Failed to update avatar image');
      }
    } catch (err) {
      toast.error('Error updating avatar: ' + err.message);
    }
  };

  // Change Password Submit Handler
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.error || "Failed to update password. Verify current password is correct.");
      }
    } catch (err) {
      toast.error("Error updating password: " + err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout showBg={true}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8 flex items-center gap-3">
            <Link to="/dashboard" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          </div>
          <ProfileCardSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout showBg={true}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px] bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
            <div className="text-center">
              <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-400 mb-2">Failed to Load Profile</h2>
              <p className="text-red-300/70 mb-4">Please refresh the page or check your internet connection.</p>
              <button
                onClick={loadProfileData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showBg={true}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2.5 bg-slate-900 border border-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile Settings</h1>
              <p className="text-xs sm:text-sm text-slate-400">Manage account information and security</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600
                         hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all
                         text-xs font-semibold shadow-lg shadow-blue-500/15"
            >
              <Edit2 size={14} />
              Edit Profile
            </button>
          )}
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8"
        >
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-850">
            <AvatarUpload
              avatar={profile.avatar}
              name={profile.name}
              isEditing={isEditing}
              onAvatarChange={handleAvatarChange}
              size="lg"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-0.5">{profile.name}</h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-2.5">{profile.email}</p>
              {profile.isProfileComplete && (
                <span className="inline-block px-2.5 py-0.5 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold border border-green-500/20">
                  Profile Complete
                </span>
              )}
            </div>
          </div>

          {/* Form Section */}
          <ProfileForm
            formData={formData}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            errors={validationErrors}
          />

          {/* Action Buttons */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-6 border-t border-slate-850 flex gap-3"
            >
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600
                           hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white rounded-xl
                           transition-all text-xs font-semibold shadow-lg shadow-green-500/15"
              >
                <Save size={14} />
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700
                           text-slate-300 rounded-xl transition-colors text-xs font-semibold"
              >
                <X size={14} />
                Cancel
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Double Column: Stats & Security */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Stats */}
          {stats && (
            <div className="space-y-6">
              <ProfileStats stats={stats} />

              {/* Account Timestamps */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Created</p>
                    <p className="text-slate-200 text-xs font-bold">
                      {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Last Updated</p>
                    <p className="text-slate-200 text-xs font-bold">
                      {new Date(profile.lastProfileUpdate || profile.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Security (Change Password) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 h-fit"
          >
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-400" />
              Security Settings
            </h3>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs text-white focus:outline-none transition-all placeholder:text-slate-600"
                  />
                  <Key className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs text-white focus:outline-none transition-all placeholder:text-slate-600"
                  />
                  <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/40 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs text-white focus:outline-none transition-all placeholder:text-slate-600"
                  />
                  <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-600" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600
                           hover:from-indigo-650 hover:to-purple-650 disabled:opacity-50 text-white rounded-xl
                           transition-all text-xs font-semibold shadow-md shadow-indigo-500/10"
              >
                {isChangingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
