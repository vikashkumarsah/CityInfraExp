const express = require('express');
const router = express.Router();
const intersectionAnalysisService = require('../services/intersectionAnalysisService');
const authMiddleware = require('../middleware/auth.js');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/intersections/analysis - Create new intersection analysis
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/intersections/analysis - Creating new intersection analysis');

    const analysisData = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!analysisData.intersectionId) {
      return res.status(400).json({
        success: false,
        error: 'Intersection ID is required'
      });
    }

    if (!analysisData.trafficVolume || !analysisData.congestionLevel) {
      return res.status(400).json({
        success: false,
        error: 'Traffic volume and congestion level are required'
      });
    }

    const analysis = await intersectionAnalysisService.createAnalysis(analysisData, userId);

    res.status(201).json({
      success: true,
      data: analysis,
      message: 'Intersection analysis created successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/intersections/analysis:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create intersection analysis'
    });
  }
});

// GET /api/intersections/analysis - Get intersection analysis records with filtering
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/intersections/analysis - Fetching intersection analysis records');

    const filters = {
      intersectionId: req.query.intersectionId,
      congestionLevel: req.query.congestionLevel,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      createdBy: req.query.createdBy,
      page: req.query.page,
      limit: req.query.limit,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const result = await intersectionAnalysisService.getAnalysisRecords(filters);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Intersection analysis records retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/intersections/analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve intersection analysis records'
    });
  }
});

// GET /api/intersections/analysis/statistics - Get analysis statistics
router.get('/statistics', async (req, res) => {
  try {
    console.log('GET /api/intersections/analysis/statistics - Fetching analysis statistics');

    const filters = {
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const statistics = await intersectionAnalysisService.getAnalysisStatistics(filters);

    res.status(200).json({
      success: true,
      data: statistics,
      message: 'Analysis statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/intersections/analysis/statistics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve analysis statistics'
    });
  }
});

// GET /api/intersections/analysis/:analysisId - Get specific analysis by ID
router.get('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    console.log(`GET /api/intersections/analysis/${analysisId} - Fetching specific analysis`);

    const analysis = await intersectionAnalysisService.getAnalysisById(analysisId);

    res.status(200).json({
      success: true,
      data: analysis,
      message: 'Intersection analysis retrieved successfully'
    });
  } catch (error) {
    console.error(`Error in GET /api/intersections/analysis/${req.params.analysisId}:`, error);
    res.status(error.message === 'Intersection analysis not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to retrieve intersection analysis'
    });
  }
});

// PUT /api/intersections/analysis/:analysisId - Update analysis
router.put('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const updateData = req.body;
    const userId = req.user.id;

    console.log(`PUT /api/intersections/analysis/${analysisId} - Updating analysis`);

    const analysis = await intersectionAnalysisService.updateAnalysis(analysisId, updateData, userId);

    res.status(200).json({
      success: true,
      data: analysis,
      message: 'Intersection analysis updated successfully'
    });
  } catch (error) {
    console.error(`Error in PUT /api/intersections/analysis/${req.params.analysisId}:`, error);
    res.status(error.message === 'Intersection analysis not found' ? 404 : 400).json({
      success: false,
      error: error.message || 'Failed to update intersection analysis'
    });
  }
});

// DELETE /api/intersections/analysis/:analysisId - Delete analysis
router.delete('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user.id;

    console.log(`DELETE /api/intersections/analysis/${analysisId} - Deleting analysis`);

    const result = await intersectionAnalysisService.deleteAnalysis(analysisId, userId);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Intersection analysis deleted successfully'
    });
  } catch (error) {
    console.error(`Error in DELETE /api/intersections/analysis/${req.params.analysisId}:`, error);
    res.status(error.message === 'Intersection analysis not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to delete intersection analysis'
    });
  }
});

module.exports = router;