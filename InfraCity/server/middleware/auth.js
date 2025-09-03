const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    console.log('Auth middleware: Processing request for:', req.path);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    console.log('Auth middleware: Token found, verifying...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret'); // INPUT_REQUIRED {JWT secret key for token verification}
    req.user = decoded;
    
    console.log('Auth middleware: Token verified successfully for user:', decoded.id);
    next();
  } catch (error) {
    console.error('Auth middleware: Token verification failed:', error);
    console.error('Auth middleware: Full error trace:', error.stack);
    
    return res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

module.exports = authMiddleware;