const express = require('express');
const router = express.Router();
const infrastructureService = require('../services/infrastructureService');
const taskService = require('../services/taskService');
const authMiddleware = require('../middleware/auth.js');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/issues/heatmap - Get issue density heatmap data
router.get('/heatmap', async (req, res) => {
  try {
    console.log('GET /api/issues/heatmap - Generating heatmap data');
    
    const heatmapData = await infrastructureService.getIssueHeatmapData();
    
    res.status(200).json({
      success: true,
      data: heatmapData,
      message: 'Heatmap data generated successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/issues/heatmap:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate heatmap data'
    });
  }
});

// POST /api/issues/:issueId/convert-to-task - Convert issue to task
router.post('/:issueId/convert-to-task', async (req, res) => {
  try {
    console.log('POST /api/issues/:issueId/convert-to-task - Converting issue to task');
    
    const issueId = req.params.issueId;
    const { title, description, priority, assignedTo, dueDate, estimatedDuration } = req.body;

    // Validate required fields for task conversion
    if (!assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assignedTo, dueDate'
      });
    }

    const taskData = {
      title,
      description,
      priority,
      assignedTo,
      dueDate: new Date(dueDate),
      estimatedDuration
    };

    const task = await taskService.convertIssueToTask(issueId, taskData, req.user._id);

    res.status(201).json({
      success: true,
      data: { task },
      message: 'Issue converted to task successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/issues/:issueId/convert-to-task:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to convert issue to task'
    });
  }
});

module.exports = router;