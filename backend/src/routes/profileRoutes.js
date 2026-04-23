const express = require("express")
const router = express.Router()
const {
  getProfile,
  getCurrentProfile,
  updateProfile,
  updateAvatar,
  deleteProfile
} = require("../controllers/profileController")
const authMiddleware = require("../middleware/authMiddleware")

/**
 * Profile Routes
 * All routes require authentication
 */

// Get current authenticated user's profile
router.get("/me", authMiddleware, getCurrentProfile)

// Get any user's public profile
router.get("/:userId", getProfile)

// Update current user's profile
router.put("/me", authMiddleware, updateProfile)

// Update user's avatar
router.put("/me/avatar", authMiddleware, updateAvatar)

// Delete profile (soft delete)
router.delete("/me", authMiddleware, deleteProfile)

module.exports = router
