const express = require('express');
const router = express.Router();
const roadSegmentService = require('../services/roadSegmentService');
const authMiddleware = require('../middleware/auth.js');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/road-segments/:segmentId/condition-scores - Get condition scores for a road segment
router.get('/:segmentId/condition-scores', async (req, res) => {
  try {
    const { segmentId } = req.params;
    console.log(`GET /api/road-segments/${segmentId}/condition-scores - Fetching condition scores`);

    const conditionScores = await roadSegmentService.getConditionScores(segmentId);

    res.status(200).json({
      success: true,
      data: conditionScores,
      message: 'Condition scores retrieved successfully'
    });
  } catch (error) {
    console.error(`Error in GET /api/road-segments/${req.params.segmentId}/condition-scores:`, error);
    res.status(error.message === 'Road segment not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to retrieve condition scores'
    });
  }
});

// GET /api/road-segments/:segmentId/events - Get event timeline for a road segment
router.get('/:segmentId/events', async (req, res) => {
  try {
    const { segmentId } = req.params;
    console.log(`GET /api/road-segments/${segmentId}/events - Fetching event timeline`);

    const events = await roadSegmentService.getEventTimeline(segmentId);

    res.status(200).json({
      success: true,
      data: events,
      message: 'Event timeline retrieved successfully'
    });
  } catch (error) {
    console.error(`Error in GET /api/road-segments/${req.params.segmentId}/events:`, error);
    res.status(error.message === 'Road segment not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to retrieve event timeline'
    });
  }
});

// GET /api/road-segments/:segmentId/visual-evidence - Get visual evidence for a road segment
router.get('/:segmentId/visual-evidence', async (req, res) => {
  try {
    const { segmentId } = req.params;
    console.log(`GET /api/road-segments/${segmentId}/visual-evidence - Fetching visual evidence`);

    const visualEvidence = await roadSegmentService.getVisualEvidence(segmentId);

    res.status(200).json({
      success: true,
      data: visualEvidence,
      message: 'Visual evidence retrieved successfully'
    });
  } catch (error) {
    console.error(`Error in GET /api/road-segments/${req.params.segmentId}/visual-evidence:`, error);
    res.status(error.message === 'Road segment not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to retrieve visual evidence'
    });
  }
});

// GET /api/road-segments/:segmentId - Get complete road segment details (existing functionality)
router.get('/:segmentId', async (req, res) => {
  try {
    const { segmentId } = req.params;
    console.log(`GET /api/road-segments/${segmentId} - Fetching complete road segment details`);

    const segmentDetails = await roadSegmentService.getRoadSegmentDetails(segmentId);

    res.status(200).json({
      success: true,
      data: { segment: segmentDetails },
      message: 'Road segment details retrieved successfully'
    });
  } catch (error) {
    console.error(`Error in GET /api/road-segments/${req.params.segmentId}:`, error);
    res.status(error.message === 'Road segment not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to retrieve road segment details'
    });
  }
});

module.exports = router;