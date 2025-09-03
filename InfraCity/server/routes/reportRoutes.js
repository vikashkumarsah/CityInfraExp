const express = require('express');
const router = express.Router();
const ReportService = require('../services/reportService');
const authMiddleware = require('./middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new report
router.post('/', async (req, res) => {
  console.log('POST /api/reports - Creating new report');
  
  try {
    const reportService = new ReportService();
    const report = await reportService.createReport(req.user.id, req.body);
    
    console.log('POST /api/reports - Report created successfully:', report._id);
    
    res.status(201).json({
      success: true,
      message: 'Report creation started',
      data: {
        reportId: report._id,
        title: report.title,
        type: report.type,
        status: report.status,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('POST /api/reports - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all reports for the authenticated user
router.get('/', async (req, res) => {
  console.log('GET /api/reports - Fetching reports for user:', req.user.id);
  
  try {
    const reportService = new ReportService();
    const filters = {
      type: req.query.type,
      status: req.query.status,
      limit: parseInt(req.query.limit) || 50
    };
    
    const reports = await reportService.getReports(req.user.id, filters);
    
    console.log('GET /api/reports - Found', reports.length, 'reports');
    
    res.json({
      success: true,
      data: {
        reports,
        total: reports.length
      }
    });
  } catch (error) {
    console.error('GET /api/reports - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get a specific report by ID
router.get('/:reportId', async (req, res) => {
  console.log('GET /api/reports/:reportId - Fetching report:', req.params.reportId);
  
  try {
    const reportService = new ReportService();
    const report = await reportService.getReportById(req.params.reportId, req.user.id);
    
    console.log('GET /api/reports/:reportId - Report fetched successfully');
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('GET /api/reports/:reportId - Error:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Update report status
router.patch('/:reportId/status', async (req, res) => {
  console.log('PATCH /api/reports/:reportId/status - Updating status for report:', req.params.reportId);
  
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const reportService = new ReportService();
    const report = await reportService.updateReportStatus(req.params.reportId, status, req.user.id);
    
    console.log('PATCH /api/reports/:reportId/status - Status updated successfully');
    
    res.json({
      success: true,
      message: 'Report status updated',
      data: report
    });
  } catch (error) {
    console.error('PATCH /api/reports/:reportId/status - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a report
router.delete('/:reportId', async (req, res) => {
  console.log('DELETE /api/reports/:reportId - Deleting report:', req.params.reportId);
  
  try {
    const reportService = new ReportService();
    await reportService.deleteReport(req.params.reportId, req.user.id);
    
    console.log('DELETE /api/reports/:reportId - Report deleted successfully');
    
    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/reports/:reportId - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get dashboard summary
router.get('/dashboard/summary', async (req, res) => {
  console.log('GET /api/reports/dashboard/summary - Generating dashboard summary');
  
  try {
    const reportService = new ReportService();
    const summary = await reportService.getDashboardSummary(req.user.id);
    
    console.log('GET /api/reports/dashboard/summary - Summary generated successfully');
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('GET /api/reports/dashboard/summary - Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;