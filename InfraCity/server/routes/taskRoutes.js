const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');
const authMiddleware = require('../middleware/auth.js');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/tasks - Fetching all tasks');
    
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      assignedTo: req.query.assignedTo,
      issueType: req.query.issueType
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) delete filters[key];
    });

    const tasks = await taskService.getAllTasks(filters);

    res.status(200).json({
      success: true,
      data: { tasks },
      message: 'Tasks retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve tasks'
    });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/tasks - Creating new task');
    
    const { title, description, priority, assignedTo, dueDate, location, issueType, estimatedDuration } = req.body;

    // Validate required fields
    if (!title || !description || !priority || !assignedTo || !dueDate || !location || !issueType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, priority, assignedTo, dueDate, location, issueType'
      });
    }

    const taskData = {
      title,
      description,
      priority,
      assignedTo,
      dueDate: new Date(dueDate),
      location,
      issueType,
      estimatedDuration: estimatedDuration || 60
    };

    const task = await taskService.createTask(taskData, req.user._id);

    res.status(201).json({
      success: true,
      data: { task },
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create task'
    });
  }
});

// PUT /api/tasks/:id/status - Update task status
router.put('/:id/status', async (req, res) => {
  try {
    console.log('PUT /api/tasks/:id/status - Updating task status');
    
    const { status } = req.body;
    const taskId = req.params.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, in-progress, or completed'
      });
    }

    const task = await taskService.updateTaskStatus(taskId, status, req.user._id);

    res.status(200).json({
      success: true,
      data: { task },
      message: 'Task status updated successfully'
    });
  } catch (error) {
    console.error('Error in PUT /api/tasks/:id/status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update task status'
    });
  }
});

// POST /api/tasks/optimize-route - Optimize route for selected tasks
router.post('/optimize-route', async (req, res) => {
  try {
    console.log('POST /api/tasks/optimize-route - Optimizing route');
    
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task IDs array is required and must not be empty'
      });
    }

    const optimizedRoute = await taskService.optimizeRoute(taskIds);

    res.status(200).json({
      success: true,
      data: optimizedRoute,
      message: 'Route optimized successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/tasks/optimize-route:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to optimize route'
    });
  }
});

module.exports = router;