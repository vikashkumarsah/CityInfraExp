const express = require('express');
const router = express.Router();
const infrastructureService = require('../services/infrastructureService');
const authMiddleware = require('../middleware/auth.js');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/metrics/performance - Get key performance metrics
router.get('/performance', async (req, res) => {
  try {
    console.log('GET /api/metrics/performance - Calculating performance metrics');
    
    const performanceMetrics = await infrastructureService.getPerformanceMetrics();
    
    res.status(200).json({
      success: true,
      data: performanceMetrics,
      message: 'Performance metrics calculated successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/metrics/performance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate performance metrics'
    });
  }
});

module.exports = router;