const IntersectionAnalysis = require('../models/IntersectionAnalysis');
const Intersection = require('../models/Intersection');

class IntersectionAnalysisService {

  // Create a new intersection analysis record
  async createAnalysis(analysisData, userId) {
    try {
      console.log('Creating new intersection analysis for intersection:', analysisData.intersectionId);

      // Verify intersection exists
      const intersection = await Intersection.findById(analysisData.intersectionId);
      if (!intersection) {
        throw new Error('Intersection not found');
      }

      // Create analysis record
      const analysis = new IntersectionAnalysis({
        ...analysisData,
        createdBy: userId,
      });

      await analysis.save();

      // Populate intersection data for response
      await analysis.populate('intersectionId', 'name coordinates');
      await analysis.populate('createdBy', 'name email');

      console.log('Intersection analysis created successfully with ID:', analysis._id);
      return analysis;
    } catch (error) {
      console.error('Error creating intersection analysis:', error);
      throw new Error(error.message || 'Failed to create intersection analysis');
    }
  }

  // Retrieve intersection analysis records with filtering
  async getAnalysisRecords(filters = {}) {
    try {
      console.log('Fetching intersection analysis records with filters:', filters);

      const query = {};

      // Apply filters
      if (filters.intersectionId) {
        query.intersectionId = filters.intersectionId;
      }

      if (filters.congestionLevel) {
        query.congestionLevel = filters.congestionLevel;
      }

      if (filters.dateFrom || filters.dateTo) {
        query.analysisDate = {};
        if (filters.dateFrom) {
          query.analysisDate.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.analysisDate.$lte = new Date(filters.dateTo);
        }
      }

      if (filters.createdBy) {
        query.createdBy = filters.createdBy;
      }

      // Set up pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;
      const skip = (page - 1) * limit;

      // Execute query
      const [analyses, totalCount] = await Promise.all([
        IntersectionAnalysis.find(query)
          .populate('intersectionId', 'name coordinates congestionLevel')
          .populate('createdBy', 'name email')
          .sort({ analysisDate: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        IntersectionAnalysis.countDocuments(query)
      ]);

      console.log(`Found ${analyses.length} intersection analysis records (${totalCount} total)`);

      return {
        analyses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        }
      };
    } catch (error) {
      console.error('Error fetching intersection analysis records:', error);
      throw new Error('Failed to retrieve intersection analysis records');
    }
  }

  // Get analysis by ID
  async getAnalysisById(analysisId) {
    try {
      console.log('Fetching intersection analysis by ID:', analysisId);

      const analysis = await IntersectionAnalysis.findById(analysisId)
        .populate('intersectionId', 'name coordinates congestionLevel')
        .populate('createdBy', 'name email')
        .lean();

      if (!analysis) {
        throw new Error('Intersection analysis not found');
      }

      console.log('Intersection analysis retrieved successfully');
      return analysis;
    } catch (error) {
      console.error('Error fetching intersection analysis by ID:', error);
      throw new Error(error.message || 'Failed to retrieve intersection analysis');
    }
  }

  // Update analysis record
  async updateAnalysis(analysisId, updateData, userId) {
    try {
      console.log('Updating intersection analysis:', analysisId);

      const analysis = await IntersectionAnalysis.findById(analysisId);
      if (!analysis) {
        throw new Error('Intersection analysis not found');
      }

      // Check if user has permission to update (creator or admin)
      if (analysis.createdBy.toString() !== userId.toString()) {
        // In a real app, you'd check for admin role here
        console.warn('User attempting to update analysis they did not create');
      }

      // Update the analysis
      Object.assign(analysis, updateData);
      analysis.updatedAt = new Date();

      await analysis.save();

      // Populate for response
      await analysis.populate('intersectionId', 'name coordinates');
      await analysis.populate('createdBy', 'name email');

      console.log('Intersection analysis updated successfully');
      return analysis;
    } catch (error) {
      console.error('Error updating intersection analysis:', error);
      throw new Error(error.message || 'Failed to update intersection analysis');
    }
  }

  // Delete analysis record
  async deleteAnalysis(analysisId, userId) {
    try {
      console.log('Deleting intersection analysis:', analysisId);

      const analysis = await IntersectionAnalysis.findById(analysisId);
      if (!analysis) {
        throw new Error('Intersection analysis not found');
      }

      // Check if user has permission to delete (creator or admin)
      if (analysis.createdBy.toString() !== userId.toString()) {
        console.warn('User attempting to delete analysis they did not create');
      }

      await IntersectionAnalysis.findByIdAndDelete(analysisId);

      console.log('Intersection analysis deleted successfully');
      return { message: 'Analysis deleted successfully' };
    } catch (error) {
      console.error('Error deleting intersection analysis:', error);
      throw new Error(error.message || 'Failed to delete intersection analysis');
    }
  }

  // Get analysis statistics
  async getAnalysisStatistics(filters = {}) {
    try {
      console.log('Calculating intersection analysis statistics');

      const matchStage = {};
      if (filters.dateFrom || filters.dateTo) {
        matchStage.analysisDate = {};
        if (filters.dateFrom) {
          matchStage.analysisDate.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          matchStage.analysisDate.$lte = new Date(filters.dateTo);
        }
      }

      const stats = await IntersectionAnalysis.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalAnalyses: { $sum: 1 },
            avgTrafficVolume: { $avg: '$trafficVolume.totalDailyVolume' },
            congestionLevelCounts: {
              $push: '$congestionLevel'
            },
            avgOverallSpeed: { $avg: '$averageSpeed.overall' },
          }
        },
        {
          $project: {
            _id: 0,
            totalAnalyses: 1,
            avgTrafficVolume: { $round: ['$avgTrafficVolume', 0] },
            avgOverallSpeed: { $round: ['$avgOverallSpeed', 1] },
            congestionDistribution: {
              $reduce: {
                input: ['Low', 'Medium', 'High', 'Very High'],
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: [[
                        { k: '$$this', v: { $size: { $filter: { input: '$congestionLevelCounts', cond: { $eq: ['$$item', '$$this'] } } } } }
                      ]]
                    }
                  ]
                }
              }
            }
          }
        }
      ]);

      const result = stats[0] || {
        totalAnalyses: 0,
        avgTrafficVolume: 0,
        avgOverallSpeed: 0,
        congestionDistribution: { Low: 0, Medium: 0, High: 0, 'Very High': 0 }
      };

      console.log('Analysis statistics calculated successfully');
      return result;
    } catch (error) {
      console.error('Error calculating analysis statistics:', error);
      throw new Error('Failed to calculate analysis statistics');
    }
  }
}

module.exports = new IntersectionAnalysisService();