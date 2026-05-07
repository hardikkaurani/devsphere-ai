import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, X, AlertCircle } from 'lucide-react';
import { getCurrentProfile, updateProfile, updateAvatar, getProfileStats } from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import AvatarUpload from '../components/profile/AvatarUpload';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileStats from '../components/profile/ProfileStats';
import { ProfileCardSkeleton } from '../components/animations/SkeletonLoader';
import { useToast, ToastContainer } from '../components/common/Toast';

/**
 * Profile Page
 * Complete user profile management with premium UI
 * Production-grade with validation, animations, and error handling
 */

function ProfilePage() {
  const { toasts, success, error, addToast } = useToast()

  // State Management
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    company: '',
    jobTitle: ''
  })

  // Load profile data on mount
  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    setIsLoading(true)
    try {
      const [profileRes, statsRes] = await Promise.all([
        getCurrentProfile(),
        getProfileStats()
      ])

      if (profileRes.success && profileRes.profile) {
        setProfile(profileRes.profile)
        setFormData({
          name: profileRes.profile.name || '',
          email: profileRes.profile.email || '',
          bio: profileRes.profile.bio || '',
          phone: profileRes.profile.phone || '',
          location: profileRes.profile.location || '',
          website: profileRes.profile.website || '',
          company: profileRes.profile.company || '',
          jobTitle: profileRes.profile.jobTitle || ''
        })
      } else {
        error('Failed to load profile')
      }

      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats)
      }
    } catch (err) {
      error('Error loading profile: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const validateFormData = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (formData.name.length > 100) {
      errors.name = 'Name cannot exceed 100 characters'
    }

    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters'
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Website must be a valid URL starting with http:// or https://'
    }

    if (formData.phone && formData.phone.length > 20) {
      errors.phone = 'Phone cannot exceed 20 characters'
    }

    if (formData.location && formData.location.length > 100) {
      errors.location = 'Location cannot exceed 100 characters'
    }

    if (formData.company && formData.company.length > 100) {
      errors.company = 'Company cannot exceed 100 characters'
    }

    if (formData.jobTitle && formData.jobTitle.length > 100) {
      errors.jobTitle = 'Job title cannot exceed 100 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSaveProfile = async () => {
    if (!validateFormData()) {
      error('Please fix the errors before saving')
      return
    }

    setIsSaving(true)
    try {
      const response = await updateProfile(formData)
      if (response.success) {
        setProfile(response.profile)
        setIsEditing(false)
        success('Profile updated successfully!')
        
        // Reload stats to reflect changes
        const statsRes = await getProfileStats()
        if (statsRes.success) {
          setStats(statsRes.stats)
        }
      } else {
        const errorMsg = response.errors?.join(', ') || 'Failed to update profile'
        error(errorMsg)
      }
    } catch (err) {
      error('Error saving profile: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setValidationErrors({})
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
      })
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // For demonstration: use DiceBear API
      const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || 'user'}`
      try {
        const response = await updateAvatar(newAvatarUrl)
        if (response.success) {
          setProfile(response.profile)
          success('Avatar updated successfully!')
        } else {
          error('Failed to update avatar')
        }
      } catch (err) {
        error('Error updating avatar: ' + err.message)
      }
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          </motion.div>
          <ProfileCardSkeleton />
        </div>
      </MainLayout>
    )
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[400px] bg-red-500/10 border border-red-500/30 rounded-xl p-8"
          >
            <div className="text-center">
              <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-400 mb-2">
                Failed to Load Profile
              </h2>
              <p className="text-red-300/70 mb-4">
                Please refresh the page or contact support if the problem persists
              </p>
              <button
                onClick={loadProfileData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    )
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
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-400">
                Manage your profile information and preferences
              </p>
            </div>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 
                           hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition 
                           font-medium shadow-lg"
              >
                <Edit2 size={18} />
                Edit Profile
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} />

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-8 mb-8"
        >
          {/* Avatar Section */}
          <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-700">
            <AvatarUpload
              avatar={profile.avatar}
              name={profile.name}
              isEditing={isEditing}
              onAvatarChange={handleAvatarChange}
              size="lg"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">
                {profile.name}
              </h2>
              <p className="text-gray-400 text-sm mb-3">
                {profile.email}
              </p>
              {profile.isProfileComplete && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30"
                >
                  ✓ Profile Complete
                </motion.span>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-gray-700 flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
                           hover:from-green-700 hover:to-emerald-700 disabled:from-green-600/50 
                           disabled:to-emerald-600/50 text-white rounded-lg transition font-medium shadow-lg"
              >
                <Save size={18} />
                {isSaving ? (
                  <>
                    <span className="animate-spin inline-block">⏳</span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 
                           disabled:bg-gray-700/50 text-gray-300 rounded-lg transition font-medium"
              >
                <X size={18} />
                Cancel
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Profile Stats Section */}
        {stats && (
          <ProfileStats stats={stats} profile={profile} />
        )}

        {/* Account Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <p className="text-sm text-gray-400 mb-2">Account Created</p>
              <p className="text-white font-semibold">
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <p className="text-sm text-gray-400 mb-2">Last Updated</p>
              <p className="text-white font-semibold">
                {new Date(profile.lastProfileUpdate || profile.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
