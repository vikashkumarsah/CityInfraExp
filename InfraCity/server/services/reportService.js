const Report = require('../models/Report');
const InfrastructureService = require('./infrastructureService');
const TaskService = require('./taskService');
const PropertyAnalyticsService = require('./propertyAnalyticsService');

class ReportService {
  
  // Create a new report
  async createReport(userId, reportData) {
    console.log('ReportService: Creating new report for user:', userId);
    
    try {
      const report = new Report({
        title: reportData.title || this.generateDefaultTitle(reportData.type),
        type: reportData.type || 'comprehensive',
        description: reportData.description,
        createdBy: userId,
        parameters: {
          period: reportData.period || {
            preset: 'month',
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            endDate: new Date()
          },
          metrics: reportData.metrics || ['issues', 'performance'],
          filters: reportData.filters || {},
          format: reportData.format || 'pdf'
        },
        status: 'generating'
      });

      const savedReport = await report.save();
      console.log('ReportService: Report created with ID:', savedReport._id);

      // Start report generation in background
      this.generateReportData(savedReport._id).catch(error => {
        console.error('ReportService: Background report generation failed:', error);
      });

      return savedReport;
    } catch (error) {
      console.error('ReportService: Error creating report:', error);
      throw new Error(`Failed to create report: ${error.message}`);
    }
  }

  // Generate report data (background process)
  async generateReportData(reportId) {
    console.log('ReportService: Starting data generation for report:', reportId);
    
    const startTime = Date.now();
    
    try {
      const report = await Report.findById(reportId);
      if (!report) {
        throw new Error('Report not found');
      }

      const reportData = {
        summary: {},
        charts: {},
        tables: {},
        insights: []
      };

      // Generate data based on selected metrics
      for (const metric of report.parameters.metrics) {
        console.log('ReportService: Generating data for metric:', metric);
        
        switch (metric) {
          case 'issues':
            reportData.summary.issues = await this.generateIssuesSummary(report.parameters);
            reportData.charts.issuesTrend = await this.generateIssuesTrendChart(report.parameters);
            break;
          case 'performance':
            reportData.summary.performance = await this.generatePerformanceSummary(report.parameters);
            reportData.charts.performanceChart = await this.generatePerformanceChart(report.parameters);
            break;
          case 'budget':
            reportData.summary.budget = await this.generateBudgetSummary(report.parameters);
            reportData.charts.budgetChart = await this.generateBudgetChart(report.parameters);
            break;
          case 'traffic':
            reportData.summary.traffic = await this.generateTrafficSummary(report.parameters);
            reportData.charts.trafficChart = await this.generateTrafficChart(report.parameters);
            break;
          case 'maintenance':
            reportData.summary.maintenance = await this.generateMaintenanceSummary(report.parameters);
            break;
          case 'citizen':
            reportData.summary.citizen = await this.generateCitizenSummary(report.parameters);
            break;
        }
      }

      // Generate insights
      reportData.insights = await this.generateInsights(reportData.summary);

      const generationTime = Date.now() - startTime;

      // Update report with generated data
      await Report.findByIdAndUpdate(reportId, {
        data: reportData,
        status: 'completed',
        'metadata.generationTime': generationTime,
        'metadata.dataPoints': this.calculateDataPoints(reportData)
      });

      console.log('ReportService: Report generation completed in', generationTime, 'ms');
      
    } catch (error) {
      console.error('ReportService: Report generation failed:', error);
      await Report.findByIdAndUpdate(reportId, {
        status: 'failed'
      });
      throw error;
    }
  }

  // Get report by ID
  async getReportById(reportId, userId = null) {
    console.log('ReportService: Fetching report:', reportId);
    
    try {
      const query = { _id: reportId };
      if (userId) {
        query.createdBy = userId;
      }

      const report = await Report.findOne(query).populate('createdBy', 'name email');
      
      if (!report) {
        throw new Error('Report not found');
      }

      // Update last accessed time
      report.metadata.lastAccessed = new Date();
      await report.save();

      return report;
    } catch (error) {
      console.error('ReportService: Error fetching report:', error);
      throw new Error(`Failed to fetch report: ${error.message}`);
    }
  }

  // Get all reports for a user
  async getReports(userId, filters = {}) {
    console.log('ReportService: Fetching reports for user:', userId);
    
    try {
      const query = { createdBy: userId };
      
      if (filters.type) {
        query.type = filters.type;
      }
      
      if (filters.status) {
        query.status = filters.status;
      }

      const reports = await Report.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50);

      console.log('ReportService: Found', reports.length, 'reports');
      return reports;
    } catch (error) {
      console.error('ReportService: Error fetching reports:', error);
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }
  }

  // Get dashboard summary
  async getDashboardSummary(userId = null) {
    console.log('ReportService: Generating dashboard summary');
    
    try {
      const summary = await Report.getDashboardSummary(userId);
      
      // Get recent reports separately for better control
      const recentQuery = userId ? { createdBy: userId } : {};
      const recentReports = await Report.find(recentQuery)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title type status createdAt metadata.downloadCount');

      // Get type breakdown
      const typeBreakdown = await Report.aggregate([
        ...(userId ? [{ $match: { createdBy: userId } }] : []),
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      const result = {
        totalReports: summary[0]?.totalReports || 0,
        completedReports: summary[0]?.completedReports || 0,
        publishedReports: summary[0]?.publishedReports || 0,
        totalDownloads: summary[0]?.totalDownloads || 0,
        recentReports,
        typeBreakdown: typeBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      };

      console.log('ReportService: Dashboard summary generated');
      return result;
    } catch (error) {
      console.error('ReportService: Error generating dashboard summary:', error);
      throw new Error(`Failed to generate dashboard summary: ${error.message}`);
    }
  }

  // Update report status
  async updateReportStatus(reportId, status, userId) {
    console.log('ReportService: Updating report status:', reportId, 'to', status);
    
    try {
      const report = await Report.findOneAndUpdate(
        { _id: reportId, createdBy: userId },
        { status },
        { new: true }
      );

      if (!report) {
        throw new Error('Report not found or access denied');
      }

      return report;
    } catch (error) {
      console.error('ReportService: Error updating report status:', error);
      throw new Error(`Failed to update report status: ${error.message}`);
    }
  }

  // Delete report
  async deleteReport(reportId, userId) {
    console.log('ReportService: Deleting report:', reportId);
    
    try {
      const report = await Report.findOneAndDelete({
        _id: reportId,
        createdBy: userId
      });

      if (!report) {
        throw new Error('Report not found or access denied');
      }

      console.log('ReportService: Report deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('ReportService: Error deleting report:', error);
      throw new Error(`Failed to delete report: ${error.message}`);
    }
  }

  // Helper methods for data generation
  async generateIssuesSummary(parameters) {
    const infrastructureService = new InfrastructureService();
    const overview = await infrastructureService.getOverview();
    
    return {
      totalIssues: overview.totalIssues || 247,
      resolvedIssues: overview.resolvedIssues || 189,
      resolutionRate: overview.resolutionRate || 76.5,
      averageResponseTime: overview.averageResponseTime || 2.4,
      issuesByType: {
        potholes: 98,
        garbage: 67,
        roadMarkers: 45,
        trafficFlow: 37
      }
    };
  }

  async generatePerformanceSummary(parameters) {
    const taskService = new TaskService();
    const tasks = await taskService.getTasks({}, null);
    
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    
    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0,
      averageCompletionTime: 4.2,
      teamEfficiency: 87.3,
      activeTeams: 12
    };
  }

  async generateBudgetSummary(parameters) {
    return {
      totalBudget: 2500000,
      spentAmount: 1875000,
      utilizationRate: 75,
      costPerIssue: 9921,
      projectedSpending: 2100000,
      savings: 400000
    };
  }

  async generateTrafficSummary(parameters) {
    return {
      totalIntersections: 45,
      congestionLevel: 'Moderate',
      averageSpeed: 28.5,
      peakHourVolume: 1250,
      trafficIncidents: 23,
      signalOptimizations: 8
    };
  }

  async generateMaintenanceSummary(parameters) {
    return {
      scheduledTasks: 34,
      completedMaintenance: 28,
      upcomingMaintenance: 15,
      equipmentUtilization: 82.4,
      maintenanceCost: 456000,
      preventiveMaintenance: 67
    };
  }

  async generateCitizenSummary(parameters) {
    return {
      totalReports: 156,
      citizenSatisfaction: 4.2,
      responseRate: 94.5,
      averageResolutionTime: 3.1,
      feedbackScore: 4.4,
      publicEngagement: 78
    };
  }

  async generateIssuesTrendChart(parameters) {
    return {
      type: 'line',
      data: [
        { date: '2024-01-01', issues: 45, resolved: 38 },
        { date: '2024-01-02', issues: 52, resolved: 41 },
        { date: '2024-01-03', issues: 38, resolved: 45 },
        { date: '2024-01-04', issues: 61, resolved: 52 },
        { date: '2024-01-05', issues: 49, resolved: 58 },
        { date: '2024-01-06', issues: 55, resolved: 49 },
        { date: '2024-01-07', issues: 43, resolved: 51 }
      ]
    };
  }

  async generatePerformanceChart(parameters) {
    return {
      type: 'bar',
      data: [
        { team: 'Team A', completed: 24, pending: 6, efficiency: 80 },
        { team: 'Team B', completed: 19, pending: 8, efficiency: 70 },
        { team: 'Team C', completed: 31, pending: 4, efficiency: 89 },
        { team: 'Team D', completed: 16, pending: 12, efficiency: 57 }
      ]
    };
  }

  async generateBudgetChart(parameters) {
    return {
      type: 'pie',
      data: [
        { category: 'Personnel', amount: 875000, percentage: 35 },
        { category: 'Equipment', amount: 625000, percentage: 25 },
        { category: 'Materials', amount: 500000, percentage: 20 },
        { category: 'Operations', amount: 375000, percentage: 15 },
        { category: 'Other', amount: 125000, percentage: 5 }
      ]
    };
  }

  async generateTrafficChart(parameters) {
    return {
      type: 'area',
      data: [
        { hour: '00:00', volume: 120 },
        { hour: '04:00', volume: 80 },
        { hour: '08:00', volume: 890 },
        { hour: '12:00', volume: 650 },
        { hour: '16:00', volume: 920 },
        { hour: '20:00', volume: 540 }
      ]
    };
  }

  async generateInsights(summary) {
    const insights = [];
    
    if (summary.issues) {
      if (summary.issues.resolutionRate > 80) {
        insights.push('Excellent issue resolution rate indicates efficient response teams');
      }
      if (summary.issues.averageResponseTime < 3) {
        insights.push('Response times are within target parameters');
      }
    }

    if (summary.performance) {
      if (summary.performance.completionRate > 85) {
        insights.push('Task completion rate exceeds performance targets');
      }
    }

    if (summary.budget) {
      if (summary.budget.utilizationRate < 80) {
        insights.push('Budget utilization is below target - consider reallocating resources');
      }
    }

    return insights;
  }

  calculateDataPoints(reportData) {
    let count = 0;
    
    // Count summary data points
    Object.values(reportData.summary || {}).forEach(section => {
      if (typeof section === 'object') {
        count += Object.keys(section).length;
      }
    });

    // Count chart data points
    Object.values(reportData.charts || {}).forEach(chart => {
      if (chart.data && Array.isArray(chart.data)) {
        count += chart.data.length;
      }
    });

    return count;
  }

  generateDefaultTitle(type) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    const titles = {
      comprehensive: `Comprehensive Infrastructure Report - ${dateStr}`,
      performance: `Performance Analysis Report - ${dateStr}`,
      budget: `Budget & Cost Analysis - ${dateStr}`,
      public: `Public Progress Report - ${dateStr}`
    };

    return titles[type] || `Infrastructure Report - ${dateStr}`;
  }
}

module.exports = ReportService;