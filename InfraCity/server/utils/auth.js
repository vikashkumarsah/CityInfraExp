const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  console.log('=== generateAccessToken Debug ===');
  console.log('ACCESS_TOKEN_SECRET exists:', !!process.env.ACCESS_TOKEN_SECRET);
  console.log('ACCESS_TOKEN_SECRET length:', process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET.length : 0);
  console.log('ACCESS_TOKEN_SECRET value (first 10 chars):', process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET.substring(0, 10) : 'undefined');
  console.log('User object:', { id: user.id || user._id, email: user.email });
  
  try {
    const token = jwt.sign(
      { 
        id: user._id || user.id, 
        email: user.email 
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    console.log('Access token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating access token:', error.message);
    throw error;
  }
};

const generateRefreshToken = (user) => {
  console.log('=== generateRefreshToken Debug ===');
  console.log('REFRESH_TOKEN_SECRET exists:', !!process.env.REFRESH_TOKEN_SECRET);
  console.log('REFRESH_TOKEN_SECRET length:', process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET.length : 0);
  console.log('REFRESH_TOKEN_SECRET value (first 10 chars):', process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET.substring(0, 10) : 'undefined');
  
  try {
    const token = jwt.sign(
      { 
        id: user._id || user.id, 
        email: user.email 
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    console.log('Refresh token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating refresh token:', error.message);
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};