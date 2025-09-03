const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const authMiddleware = require('./middleware/auth');

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  console.log('GET /api/users/profile - Fetching profile for user:', req.user.id);

  try {
    const userService = new UserService();
    const user = await userService.get(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('GET /api/users/profile - Profile fetched successfully');

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('GET /api/users/profile - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update current user profile
router.put('/profile', authMiddleware, async (req, res) => {
  console.log('PUT /api/users/profile - Updating profile for user:', req.user.id);

  try {
    const userService = new UserService();
    const updatedUser = await userService.update(req.user.id, req.body);

    console.log('PUT /api/users/profile - Profile updated successfully');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('PUT /api/users/profile - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;