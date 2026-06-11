const express = require('express');
const router = express.Router();
const {
  getProfile,
  getCurrentProfile,
  getProfileStats,
  updateProfile,
  updateAvatar,
  deleteProfile,
  changePassword
} = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  updateProfileSchema,
  updateAvatarSchema,
  changePasswordSchema
} = require('../utils/validationSchemas');

/**
 * Profile Routes
 * RESTful API for user profile management
 */

// Get current authenticated user's profile
router.get('/me', authMiddleware, getCurrentProfile);

// Get current user's profile stats (completion %, joined date, etc.)
router.get('/me/stats', authMiddleware, getProfileStats);

// Get any user's public profile
router.get('/:userId', getProfile);

// Update current user's profile
router.put('/me', authMiddleware, validateRequest(updateProfileSchema), updateProfile);

// Update user's avatar
router.put('/me/avatar', authMiddleware, validateRequest(updateAvatarSchema), updateAvatar);

// Change user's password
router.put('/me/password', authMiddleware, validateRequest(changePasswordSchema), changePassword);

// Delete profile (schedule deletion)
router.delete('/me', authMiddleware, deleteProfile);

module.exports = router;
