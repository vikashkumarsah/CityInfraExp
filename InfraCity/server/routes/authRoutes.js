const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const authMiddleware = require('../middleware/auth');

// Add debugging to see what methods are available
console.log('=== UserService Methods Debug ===');
console.log('UserService type:', typeof UserService);
console.log('UserService methods:', Object.getOwnPropertyNames(UserService));
console.log('UserService prototype methods:', Object.getOwnPropertyNames(UserService.prototype));

// Check if it's a class that needs to be instantiated
if (typeof UserService === 'function') {
  console.log('UserService is a function/class');
  try {
    const userServiceInstance = new UserService();
    console.log('UserService instance methods:', Object.getOwnPropertyNames(userServiceInstance));
    console.log('UserService instance prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(userServiceInstance)));
  } catch (error) {
    console.log('Error creating UserService instance:', error.message);
  }
}

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('=== Login Route Debug ===');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    console.log('Environment variables check:');
    console.log('- ACCESS_TOKEN_SECRET exists:', !!process.env.ACCESS_TOKEN_SECRET);
    console.log('- REFRESH_TOKEN_SECRET exists:', !!process.env.REFRESH_TOKEN_SECRET);
    console.log('- NODE_ENV:', process.env.NODE_ENV);

    console.log('Attempting to authenticate user:', email);
    console.log('About to call UserService.authenticateUser');
    console.log('UserService.authenticateUser type:', typeof UserService.authenticateUser);
    
    // This is where the error occurs
    const user = await UserService.authenticateUser(email, password);
    
    if (!user) {
      console.log('Authentication failed for user:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    console.log('User authenticated successfully:', user.email);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log('Tokens generated successfully');

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error for', req.body.email + ':', error.message);
    console.error('Full error stack:', error.stack);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    console.log('=== Register Route Debug ===');
    console.log('Registration attempt for email:', req.body.email);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    console.log('Creating new user:', email);
    const user = await UserService.createUser({ name, email, password, role });
    console.log('New user created:', email, 'with role:', role || 'user');

    console.log('About to generate access token for new user...');
    const accessToken = generateAccessToken(user);
    console.log('Access token generated for new user:', email);

    console.log('User registered successfully:', email, 'with role:', user.role);
    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Full error stack:', error.stack);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// Logout route
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await UserService.updateRefreshToken(req.user.id, null);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Refresh token route
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    const user = await UserService.validateRefreshToken(refreshToken);

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await UserService.updateRefreshToken(user._id, newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error.message);
    res.status(401).json({ error: 'Token refresh failed' });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

module.exports = router;