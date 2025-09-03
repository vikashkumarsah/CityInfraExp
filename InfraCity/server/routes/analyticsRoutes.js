const express = require('express');
const router = express.Router();
const propertyAnalyticsService = require('../services/propertyAnalyticsService');
const authMiddleware = require('../middleware/auth.js');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/analytics/neighborhood-trends/:neighborhoodId - Get property price trends for a neighborhood
router.get('/neighborhood-trends/:neighborhoodId', async (req, res) => {
  try {
    const { neighborhoodId } = req.params;
    const { timeRange = '12m' } = req.query;

    console.log(`GET /api/analytics/neighborhood-trends/${neighborhoodId} - Fetching property trends, timeRange: ${timeRange}`);

    const trends = await propertyAnalyticsService.getNeighborhoodTrends(neighborhoodId, timeRange);

    res.status(200).json({
      success: true,
      data: trends,
      message: 'Neighborhood property trends retrieved successfully'
    });
  } catch (error) {
    console.error(`Error in GET /api/analytics/neighborhood-trends/${req.params.neighborhoodId}:`, error);
    res.status(error.message === 'Neighborhood not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to retrieve neighborhood trends'
    });
  }
});

// POST /api/analytics/neighborhood-comparison - Compare property metrics between neighborhoods
router.post('/neighborhood-comparison', async (req, res) => {
  try {
    const { neighborhoodIds, metrics } = req.body;

    console.log('POST /api/analytics/neighborhood-comparison - Comparing neighborhoods:', neighborhoodIds);

    // Validate input
    if (!neighborhoodIds || !Array.isArray(neighborhoodIds) || neighborhoodIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'neighborhoodIds array is required and must not be empty'
      });
    }

    if (neighborhoodIds.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Cannot compare more than 10 neighborhoods at once'
      });
    }

    const validMetrics = ['averagePrice', 'medianPrice', 'pricePerSqFt', 'salesVolume', 'averageSize', 'amenityScore', 'transportScore'];
    const requestedMetrics = metrics && Array.isArray(metrics) ? metrics : ['averagePrice', 'medianPrice', 'pricePerSqFt', 'salesVolume'];
    
    // Validate metrics
    const invalidMetrics = requestedMetrics.filter(metric => !validMetrics.includes(metric));
    if (invalidMetrics.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid metrics: ${invalidMetrics.join(', ')}. Valid metrics are: ${validMetrics.join(', ')}`
      });
    }

    const comparison = await propertyAnalyticsService.compareNeighborhoods(neighborhoodIds, requestedMetrics);

    res.status(200).json({
      success: true,
      data: comparison,
      message: 'Neighborhood comparison completed successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/analytics/neighborhood-comparison:', error);
    res.status(error.message.includes('not found') ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to compare neighborhoods'
    });
  }
});

// POST /api/analytics/property-prediction - Predict property value based on characteristics
router.post('/property-prediction', async (req, res) => {
  try {
    const propertyData = req.body;

    console.log('POST /api/analytics/property-prediction - Predicting property value');

    // Validate required fields
    const requiredFields = ['neighborhoodId', 'type', 'bedrooms', 'bathrooms', 'squareFootage', 'yearBuilt'];
    const missingFields = requiredFields.filter(field => !propertyData[field] && propertyData[field] !== 0);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate property type
    const validTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial'];
    if (!validTypes.includes(propertyData.type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid property type. Valid types are: ${validTypes.join(', ')}`
      });
    }

    // Validate numeric fields
    if (propertyData.bedrooms < 0 || propertyData.bathrooms < 0 || propertyData.squareFootage <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bedrooms and bathrooms must be non-negative, square footage must be positive'
      });
    }

    const currentYear = new Date().getFullYear();
    if (propertyData.yearBuilt < 1800 || propertyData.yearBuilt > currentYear + 5) {
      return res.status(400).json({
        success: false,
        error: `Year built must be between 1800 and ${currentYear + 5}`
      });
    }

    const prediction = await propertyAnalyticsService.predictPropertyValue(propertyData);

    res.status(200).json({
      success: true,
      data: prediction,
      message: 'Property value prediction completed successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/analytics/property-prediction:', error);
    res.status(error.message.includes('not found') || error.message.includes('Insufficient') ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to predict property value'
    });
  }
});

module.exports = router;