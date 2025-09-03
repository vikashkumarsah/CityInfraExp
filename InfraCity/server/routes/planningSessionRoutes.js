const express = require('express');
const router = express.Router();
const PlanningSessionService = require('../services/planningSessionService');
const authMiddleware = require('./middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new planning session
router.post('/', async (req, res) => {
  console.log('POST /api/planning-sessions - Creating new planning session');

  try {
    const planningSessionService = new PlanningSessionService();
    const session = await planningSessionService.createSession(req.user.id, req.body);

    console.log('POST /api/planning-sessions - Session created successfully:', session._id);

    res.status(201).json({
      success: true,
      message: 'Planning session created successfully',
      data: session
    });
  } catch (error) {
    console.error('POST /api/planning-sessions - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all planning sessions for the authenticated user
router.get('/', async (req, res) => {
  console.log('GET /api/planning-sessions - Fetching sessions for user:', req.user.id);

  try {
    const planningSessionService = new PlanningSessionService();
    const sessions = await planningSessionService.getSessions(req.user.id);

    console.log('GET /api/planning-sessions - Found', sessions.length, 'sessions');

    res.json({
      success: true,
      data: {
        sessions,
        total: sessions.length
      }
    });
  } catch (error) {
    console.error('GET /api/planning-sessions - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get a specific planning session by ID
router.get('/:sessionId', async (req, res) => {
  console.log('GET /api/planning-sessions/:sessionId - Fetching session:', req.params.sessionId);

  try {
    const planningSessionService = new PlanningSessionService();
    const session = await planningSessionService.getSessionById(req.params.sessionId, req.user.id);

    console.log('GET /api/planning-sessions/:sessionId - Session fetched successfully');

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('GET /api/planning-sessions/:sessionId - Error:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Update a planning session
router.put('/:sessionId', async (req, res) => {
  console.log('PUT /api/planning-sessions/:sessionId - Updating session:', req.params.sessionId);

  try {
    const planningSessionService = new PlanningSessionService();
    const session = await planningSessionService.updateSession(req.params.sessionId, req.body, req.user.id);

    console.log('PUT /api/planning-sessions/:sessionId - Session updated successfully');

    res.json({
      success: true,
      message: 'Planning session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('PUT /api/planning-sessions/:sessionId - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a planning session
router.delete('/:sessionId', async (req, res) => {
  console.log('DELETE /api/planning-sessions/:sessionId - Deleting session:', req.params.sessionId);

  try {
    const planningSessionService = new PlanningSessionService();
    await planningSessionService.deleteSession(req.params.sessionId, req.user.id);

    console.log('DELETE /api/planning-sessions/:sessionId - Session deleted successfully');

    res.json({
      success: true,
      message: 'Planning session deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/planning-sessions/:sessionId - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create annotation in a planning session
router.post('/:sessionId/annotations', async (req, res) => {
  console.log('POST /api/planning-sessions/:sessionId/annotations - Creating annotation');

  try {
    const planningSessionService = new PlanningSessionService();
    const annotation = await planningSessionService.createAnnotation(req.params.sessionId, req.body, req.user.id);

    console.log('POST /api/planning-sessions/:sessionId/annotations - Annotation created successfully');

    res.status(201).json({
      success: true,
      message: 'Annotation created successfully',
      data: annotation
    });
  } catch (error) {
    console.error('POST /api/planning-sessions/:sessionId/annotations - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get annotations for a planning session
router.get('/:sessionId/annotations', async (req, res) => {
  console.log('GET /api/planning-sessions/:sessionId/annotations - Fetching annotations');

  try {
    const planningSessionService = new PlanningSessionService();
    const annotations = await planningSessionService.getAnnotations(req.params.sessionId, req.user.id);

    console.log('GET /api/planning-sessions/:sessionId/annotations - Found', annotations.length, 'annotations');

    res.json({
      success: true,
      data: {
        annotations,
        total: annotations.length
      }
    });
  } catch (error) {
    console.error('GET /api/planning-sessions/:sessionId/annotations - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete an annotation
router.delete('/:sessionId/annotations/:annotationId', async (req, res) => {
  console.log('DELETE /api/planning-sessions/:sessionId/annotations/:annotationId - Deleting annotation');

  try {
    const planningSessionService = new PlanningSessionService();
    await planningSessionService.deleteAnnotation(req.params.annotationId, req.user.id);

    console.log('DELETE /api/planning-sessions/:sessionId/annotations/:annotationId - Annotation deleted successfully');

    res.json({
      success: true,
      message: 'Annotation deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/planning-sessions/:sessionId/annotations/:annotationId - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;