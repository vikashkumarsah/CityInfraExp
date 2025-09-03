const express = require('express');
const UserService = require('../services/userService.js');
const { requireUser } = require('./middleware/auth.js');

const router = express.Router();

// Get current user profile
router.get('/me', requireUser, async (req, res) => {
  try {
    console.log(`Profile retrieved for user: ${req.user.email}`);
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error(`Profile retrieval error: ${error.message}`);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve profile' 
    });
  }
});

// Update current user profile
router.put('/me', requireUser, async (req, res) => {
  try {
    const { firstName, lastName, department, phone } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }

    const updatedUser = await UserService.update(req.user._id, {
      firstName,
      lastName,
      department: department || '',
      phone: phone || ''
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`Profile updated for user: ${updatedUser.email}`);
    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error(`Profile update error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;