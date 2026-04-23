const User = require("../models/User")
const logger = require("../utils/logger")

/**
 * Profile Controller
 * Handles user profile operations (get, update)
 */

// Get user profile by ID
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    logger.info(`Profile retrieved for user: ${userId}`)
    res.status(200).json({
      success: true,
      profile: user
    })
  } catch (err) {
    logger.error('Get profile error:', err.message)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Get current user profile (authenticated)
exports.getCurrentProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User ID not found" })
    }

    const user = await User.findById(userId).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    logger.info(`Current profile retrieved for user: ${userId}`)
    res.status(200).json({
      success: true,
      profile: user
    })
  } catch (err) {
    logger.error('Get current profile error:', err.message)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User ID not found" })
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

    // Build update object with only provided fields
    const updateData = {}
    
    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (avatar !== undefined) updateData.avatar = avatar
    if (phone !== undefined) updateData.phone = phone
    if (location !== undefined) updateData.location = location
    if (website !== undefined) updateData.website = website
    if (company !== undefined) updateData.company = company
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle
    if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills : []
    if (timezone !== undefined) updateData.timezone = timezone
    if (theme !== undefined) updateData.theme = theme
    if (language !== undefined) updateData.language = language

    // Mark profile as complete if key fields are filled
    if (name || bio || avatar) {
      updateData.isProfileComplete = true
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    logger.info(`Profile updated for user: ${userId}`)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: user
    })
  } catch (err) {
    logger.error('Update profile error:', err.message)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Update user avatar
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId
    const { avatar } = req.body

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!avatar) {
      return res.status(400).json({ message: "Avatar URL is required" })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    ).select('-password')

    logger.info(`Avatar updated for user: ${userId}`)
    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      profile: user
    })
  } catch (err) {
    logger.error('Update avatar error:', err.message)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Delete user profile (soft delete - just return message)
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // For now, just return a message. In production, implement proper deletion
    logger.warn(`Profile deletion requested for user: ${userId}`)
    res.status(200).json({
      success: true,
      message: "Profile deletion requested. Please contact support to complete the process."
    })
  } catch (err) {
    logger.error('Delete profile error:', err.message)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
