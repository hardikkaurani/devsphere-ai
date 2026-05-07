const express = require("express")
const router = express.Router()
const {
  getProfile,
  getCurrentProfile,
  getProfileStats,
  updateProfile,
  updateAvatar,
  deleteProfile
} = require("../controllers/profileController")
const authMiddleware = require("../middleware/authMiddleware")

/**
 * Profile Routes
 * RESTful API for user profile management
 */

// Get current authenticated user's profile
router.get("/me", authMiddleware, getCurrentProfile)

// Get current user's profile stats (completion %, joined date, etc.)
router.get("/me/stats", authMiddleware, getProfileStats)

// Get any user's public profile
router.get("/:userId", getProfile)

// Update current user's profile
router.put("/me", authMiddleware, updateProfile)

// Update user's avatar
router.put("/me/avatar", authMiddleware, updateAvatar)

// Delete profile (schedule deletion)
router.delete("/me", authMiddleware, deleteProfile)

module.exports = router
