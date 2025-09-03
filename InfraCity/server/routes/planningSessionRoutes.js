const express = require('express');
const router = express.Router();
const planningSessionService = require('../services/planningSessionService');
const authMiddleware = require('./middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new planning session
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/planning-sessions - Creating new session');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);

    const { title, description, settings } = req.body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Session title is required'
      });
    }

    const sessionData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      settings: settings || {}
    };

    const session = await planningSessionService.createSession(sessionData, req.user.id);

    console.log('Planning session created successfully:', session._id);
    res.status(201).json({
      success: true,
      data: session,
      message: 'Planning session created successfully'
    });
  } catch (error) {
    console.error('Error creating planning session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create planning session'
    });
  }
});

// Get all planning sessions for the authenticated user
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/planning-sessions - Fetching sessions for user:', req.user.id);
    
    const { status, limit, skip } = req.query;
    const filters = {
      status,
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined
    };

    const sessions = await planningSessionService.getSessions(req.user.id, filters);

    console.log('Found', sessions.length, 'planning sessions');
    res.json({
      success: true,
      data: {
        sessions,
        count: sessions.length
      },
      message: 'Planning sessions retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching planning sessions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch planning sessions'
    });
  }
});

// Get a specific planning session by ID
router.get('/:sessionId', async (req, res) => {
  try {
    console.log('GET /api/planning-sessions/:sessionId - Fetching session:', req.params.sessionId);
    
    const session = await planningSessionService.getSessionById(req.params.sessionId, req.user.id);

    console.log('Planning session retrieved successfully');
    res.json({
      success: true,
      data: session,
      message: 'Planning session retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching planning session:', error);
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('Access denied') ? 403 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to fetch planning session'
    });
  }
});

// Update a planning session
router.put('/:sessionId', async (req, res) => {
  try {
    console.log('PUT /api/planning-sessions/:sessionId - Updating session:', req.params.sessionId);
    console.log('Update data:', req.body);

    const session = await planningSessionService.updateSession(
      req.params.sessionId, 
      req.body, 
      req.user.id
    );

    console.log('Planning session updated successfully');
    res.json({
      success: true,
      data: session,
      message: 'Planning session updated successfully'
    });
  } catch (error) {
    console.error('Error updating planning session:', error);
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('permissions') ? 403 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to update planning session'
    });
  }
});

// Delete a planning session
router.delete('/:sessionId', async (req, res) => {
  try {
    console.log('DELETE /api/planning-sessions/:sessionId - Deleting session:', req.params.sessionId);

    const result = await planningSessionService.deleteSession(req.params.sessionId, req.user.id);

    console.log('Planning session deleted successfully');
    res.json({
      success: true,
      data: result,
      message: 'Planning session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting planning session:', error);
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('permissions') ? 403 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to delete planning session'
    });
  }
});

// Create an annotation in a planning session
router.post('/:sessionId/annotations', async (req, res) => {
  try {
    console.log('POST /api/planning-sessions/:sessionId/annotations - Creating annotation');
    console.log('Session ID:', req.params.sessionId);
    console.log('Annotation data:', req.body);

    const { type, content, position, style } = req.body;

    // Validate required fields
    if (!type || !content || !position) {
      return res.status(400).json({
        success: false,
        error: 'Type, content, and position are required for annotations'
      });
    }

    if (!position.x || !position.y) {
      return res.status(400).json({
        success: false,
        error: 'Position must include x and y coordinates'
      });
    }

    const annotationData = {
      type,
      content: content.trim(),
      position,
      style: style || {}
    };

    const annotation = await planningSessionService.createAnnotation(
      req.params.sessionId,
      annotationData,
      req.user.id
    );

    console.log('Annotation created successfully:', annotation._id);
    res.status(201).json({
      success: true,
      data: annotation,
      message: 'Annotation created successfully'
    });
  } catch (error) {
    console.error('Error creating annotation:', error);
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('permissions') ? 403 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to create annotation'
    });
  }
});

// Get annotations for a planning session
router.get('/:sessionId/annotations', async (req, res) => {
  try {
    console.log('GET /api/planning-sessions/:sessionId/annotations - Fetching annotations');
    console.log('Session ID:', req.params.sessionId);

    const annotations = await planningSessionService.getAnnotations(req.params.sessionId, req.user.id);

    console.log('Found', annotations.length, 'annotations');
    res.json({
      success: true,
      data: {
        annotations,
        count: annotations.length
      },
      message: 'Annotations retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching annotations:', error);
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('Access denied') ? 403 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to fetch annotations'
    });
  }
});

// Delete an annotation
router.delete('/:sessionId/annotations/:annotationId', async (req, res) => {
  try {
    console.log('DELETE /api/planning-sessions/:sessionId/annotations/:annotationId - Deleting annotation');
    console.log('Session ID:', req.params.sessionId);
    console.log('Annotation ID:', req.params.annotationId);

    const result = await planningSessionService.deleteAnnotation(
      req.params.sessionId,
      req.params.annotationId,
      req.user.id
    );

    console.log('Annotation deleted successfully');
    res.json({
      success: true,
      data: result,
      message: 'Annotation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting annotation:', error);
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('permissions') ? 403 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to delete annotation'
    });
  }
});

// Get planning session statistics
router.get('/statistics/summary', async (req, res) => {
  try {
    console.log('GET /api/planning-sessions/statistics/summary - Fetching statistics');

    const statistics = await planningSessionService.getSessionStatistics(req.user.id);

    console.log('Statistics retrieved successfully');
    res.json({
      success: true,
      data: statistics,
      message: 'Statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch statistics'
    });
  }
});

module.exports = router;