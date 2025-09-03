const express = require('express');
const router = express.Router();
const infrastructureService = require('../services/infrastructureService');
const authMiddleware = require('../middleware/auth.js');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/infrastructure/metrics - Get real-time infrastructure metrics
router.get('/metrics', async (req, res) => {
  try {
    console.log('GET /api/infrastructure/metrics - Fetching system metrics');
    
    const metrics = await infrastructureService.getSystemMetrics();
    
    res.status(200).json({
      success: true,
      data: metrics,
      message: 'System metrics retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/infrastructure/metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve system metrics'
    });
  }
});

module.exports = router;