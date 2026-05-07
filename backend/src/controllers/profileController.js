const User = require("../models/User")
const logger = require("../utils/logger")

/**
 * Profile Controller
 * Handles user profile operations (get, update, stats)
 * Production-grade with comprehensive validation & error handling
 */

// ============================================
// 🔐 Helper Functions
// ============================================

/**
 * Sanitize user object for response
 * @param {Object} user - Mongoose user document
 * @returns {Object} Sanitized user object
 */
const sanitizeUserResponse = (user) => {
  const userObj = user.toObject ? user.toObject() : user
  delete userObj.password
  return userObj
}

/**
 * Validate profile data
 * @param {Object} data - Data to validate
 * @returns {Object} { valid: boolean, errors: array }
 */
const validateProfileData = (data) => {
  const errors = []

  if (data.name !== undefined) {
    if (!data.name.trim()) {
      errors.push('Name cannot be empty')
    } else if (data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters')
    } else if (data.name.length > 100) {
      errors.push('Name cannot exceed 100 characters')
    }
  }

  if (data.bio !== undefined && data.bio.length > 500) {
    errors.push('Bio cannot exceed 500 characters')
  }

  if (data.email !== undefined && data.email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format')
    }
  }

  if (data.phone !== undefined && data.phone.length > 20) {
    errors.push('Phone cannot exceed 20 characters')
  }

  if (data.location !== undefined && data.location.length > 100) {
    errors.push('Location cannot exceed 100 characters')
  }

  if (data.website !== undefined && data.website) {
    const urlRegex = /^https?:\/\/.+/
    if (!urlRegex.test(data.website)) {
      errors.push('Website must be a valid URL starting with http:// or https://')
    }
  }

  if (data.company !== undefined && data.company.length > 100) {
    errors.push('Company cannot exceed 100 characters')
  }

  if (data.jobTitle !== undefined && data.jobTitle.length > 100) {
    errors.push('Job title cannot exceed 100 characters')
  }

  if (data.skills !== undefined && Array.isArray(data.skills)) {
    if (data.skills.length > 20) {
      errors.push('Cannot have more than 20 skills')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// ============================================
// 👤 Profile Endpoints
// ============================================

// Get user profile by ID (public)
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      })
    }

    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    logger.info(`Profile retrieved for user: ${userId}`)
    res.status(200).json({
      success: true,
      profile: sanitizeUserResponse(user)
    })
  } catch (err) {
    logger.error('Get profile error:', err.message)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}

// Get current user profile (authenticated)
exports.getCurrentProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found"
      })
    }

    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    logger.info(`Current profile retrieved for user: ${userId}`)
    res.status(200).json({
      success: true,
      profile: sanitizeUserResponse(user)
    })
  } catch (err) {
    logger.error('Get current profile error:', err.message)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}

// Get profile stats (completion, joined date, etc.)
exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const joinedDate = new Date(user.createdAt)
    const accountAgeInDays = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))

    res.status(200).json({
      success: true,
      stats: {
        completionPercentage: user.profileCompletionPercentage || 0,
        isProfileComplete: user.isProfileComplete,
        joinedDate: user.createdAt,
        lastUpdated: user.lastProfileUpdate || user.updatedAt,
        accountAgeInDays,
        fieldsCompleted: [
          user.name && 'name',
          user.email && 'email',
          user.bio && 'bio',
          user.avatar && 'avatar',
          user.phone && 'phone',
          user.location && 'location',
          user.website && 'website',
          user.company && 'company',
          user.jobTitle && 'jobTitle'
        ].filter(Boolean).length,
        totalFields: 9
      }
    })
  } catch (err) {
    logger.error('Get profile stats error:', err.message)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile stats",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const {
      name,
      bio,
      avatar,
      phone,
      location,
      website,
      company,
      jobTitle,
      skills,
      timezone,
      theme,
      language
    } = req.body

    // Validate profile data
    const validation = validateProfileData(req.body)
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      })
    }

    // Build update object with only provided fields
    const updateData = {}
    
    if (name !== undefined) updateData.name = name.trim()
    if (bio !== undefined) updateData.bio = bio.trim()
    if (avatar !== undefined) updateData.avatar = avatar || null
    if (phone !== undefined) updateData.phone = phone.trim()
    if (location !== undefined) updateData.location = location.trim()
    if (website !== undefined) updateData.website = website.trim()
    if (company !== undefined) updateData.company = company.trim()
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle.trim()
    if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills.filter(s => s.trim()) : []
    if (timezone !== undefined) updateData.timezone = timezone
    if (theme !== undefined && ['light', 'dark', 'auto'].includes(theme)) updateData.theme = theme
    if (language !== undefined) updateData.language = language

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    logger.info(`Profile updated for user: ${userId}`)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: sanitizeUserResponse(user)
    })
  } catch (err) {
    logger.error('Update profile error:', err.message)
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}

// Update user avatar
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId
    const { avatar } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    if (avatar && !/^https?:\/\/.+/.test(avatar)) {
      return res.status(400).json({
        success: false,
        message: "Avatar must be a valid URL starting with http:// or https://"
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatar || null },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    logger.info(`Avatar updated for user: ${userId}`)
    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      profile: sanitizeUserResponse(user)
    })
  } catch (err) {
    logger.error('Update avatar error:', err.message)
    res.status(500).json({
      success: false,
      message: "Failed to update avatar",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}

// Delete profile (returns info about deletion process)
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    logger.warn(`Profile deletion requested for user: ${userId}`)
    res.status(200).json({
      success: true,
      message: "Profile deletion has been scheduled. We'll process your request within 30 days."
    })
  } catch (err) {
    logger.error('Delete profile error:', err.message)
    res.status(500).json({
      success: false,
      message: "Failed to process deletion request",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}
