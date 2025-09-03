const express = require('express');
const router = express.Router();
const decongestionPlanService = require('../services/decongestionPlanService');
const authMiddleware = require('../middleware/auth.js');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/decongestion-plans - Create new decongestion plan
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/decongestion-plans - Creating new decongestion plan');

    const planData = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!planData.planName || !planData.intersectionId || !planData.analysisId) {
      return res.status(400).json({
        success: false,
        error: 'Plan name, intersection ID, and analysis ID are required'
      });
    }

    if (!planData.currentCongestionLevel || !planData.targetCongestionLevel) {
      return res.status(400).json({
        success: false,
        error: 'Current and target congestion levels are required'
      });
    }

    if (!planData.proposedActions || !Array.isArray(planData.proposedActions) || planData.proposedActions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one proposed action is required'
      });
    }

    const plan = await decongestionPlanService.createPlan(planData, userId);

    res.status(201).json({
      success: true,
      data: plan,
      message: 'Decongestion plan created successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/decongestion-plans:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create decongestion plan'
    });
  }
});

// GET /api/decongestion-plans - Get decongestion plans with filtering
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/decongestion-plans - Fetching decongestion plans');

    const filters = {
      intersectionId: req.query.intersectionId,
      status: req.query.status,
      currentCongestionLevel: req.query.currentCongestionLevel,
      targetCongestionLevel: req.query.targetCongestionLevel,
      createdBy: req.query.createdBy,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      page: req.query.page,
      limit: req.query.limit,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const result = await decongestionPlanService.getPlans(filters);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Decongestion plans retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/decongestion-plans:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve decongestion plans'
    });
  }
});

// GET /api/decongestion-plans/statistics - Get plan statistics
router.get('/statistics', async (req, res) => {
  try {
    console.log('GET /api/decongestion-plans/statistics - Fetching plan statistics');

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

    const statistics = await decongestionPlanService.getPlanStatistics(filters);

    res.status(200).json({
      success: true,
      data: statistics,
      message: 'Plan statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/decongestion-plans/statistics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve plan statistics'
    });
  }
});

// GET /api/decongestion-plans/:planId - Get specific plan by ID
router.get('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    console.log(`GET /api/decongestion-plans/${planId} - Fetching specific plan`);

    const plan = await decongestionPlanService.getPlanById(planId);

    res.status(200).json({
      success: true,
      data: plan,
      message: 'Decongestion plan retrieved successfully'
    });
  } catch (error) {
    console.error(`Error in GET /api/decongestion-plans/${req.params.planId}:`, error);
    res.status(error.message === 'Decongestion plan not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to retrieve decongestion plan'
    });
  }
});

// PUT /api/decongestion-plans/:planId - Update plan
router.put('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const updateData = req.body;
    const userId = req.user.id;

    console.log(`PUT /api/decongestion-plans/${planId} - Updating plan`);

    const plan = await decongestionPlanService.updatePlan(planId, updateData, userId);

    res.status(200).json({
      success: true,
      data: plan,
      message: 'Decongestion plan updated successfully'
    });
  } catch (error) {
    console.error(`Error in PUT /api/decongestion-plans/${req.params.planId}:`, error);
    res.status(error.message === 'Decongestion plan not found' ? 404 : 400).json({
      success: false,
      error: error.message || 'Failed to update decongestion plan'
    });
  }
});

// PATCH /api/decongestion-plans/:planId/status - Update plan status
router.patch('/:planId/status', async (req, res) => {
  try {
    const { planId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    console.log(`PATCH /api/decongestion-plans/${planId}/status - Updating plan status to ${status}`);

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['Draft', 'Under Review', 'Approved', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const plan = await decongestionPlanService.updatePlanStatus(planId, status, userId);

    res.status(200).json({
      success: true,
      data: plan,
      message: 'Plan status updated successfully'
    });
  } catch (error) {
    console.error(`Error in PATCH /api/decongestion-plans/${req.params.planId}/status:`, error);
    res.status(error.message === 'Decongestion plan not found' ? 404 : 400).json({
      success: false,
      error: error.message || 'Failed to update plan status'
    });
  }
});

// DELETE /api/decongestion-plans/:planId - Delete plan
router.delete('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    console.log(`DELETE /api/decongestion-plans/${planId} - Deleting plan`);

    const result = await decongestionPlanService.deletePlan(planId, userId);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Decongestion plan deleted successfully'
    });
  } catch (error) {
    console.error(`Error in DELETE /api/decongestion-plans/${req.params.planId}:`, error);
    res.status(error.message === 'Decongestion plan not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to delete decongestion plan'
    });
  }
});

module.exports = router;