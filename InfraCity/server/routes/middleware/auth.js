const jwt = require('jsonwebtoken');
const UserService = require('../../services/userService.js');

const requireUser = async (req, res, next) => {
  console.log('Authentication middleware - Processing request');
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authentication middleware - No valid authorization header found');
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      console.log('Authentication middleware - No token found in authorization header');
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    console.log('Authentication middleware - Verifying token');
    // Verify the access token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log('Authentication middleware - Token verified, fetching user:', decoded.sub);
    // Get user from database
    const user = await UserService.get(decoded.sub);

    if (!user || !user.isActive) {
      console.log('Authentication middleware - User not found or inactive:', decoded.sub);
      return res.status(403).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    console.log('Authentication middleware - User authenticated successfully:', user.id);
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);

    if (error.name === 'TokenExpiredError') {
      console.log('Authentication middleware - Token expired');
      return res.status(401).json({
        success: false,
        message: 'Access token has expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      console.log('Authentication middleware - Invalid token');
      return res.status(401).json({
        success: false,
        message: 'Invalid access token'
      });
    }

    console.error('Authentication middleware - Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = requireUser;