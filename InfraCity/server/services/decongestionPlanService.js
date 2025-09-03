const DecongestionPlan = require('../models/DecongestionPlan');
const IntersectionAnalysis = require('../models/IntersectionAnalysis');
const Intersection = require('../models/Intersection');

class DecongestionPlanService {

  // Create a new decongestion plan
  async createPlan(planData, userId) {
    try {
      console.log('Creating new decongestion plan for intersection:', planData.intersectionId);

      // Verify intersection exists
      const intersection = await Intersection.findById(planData.intersectionId);
      if (!intersection) {
        throw new Error('Intersection not found');
      }

      // Verify analysis exists
      const analysis = await IntersectionAnalysis.findById(planData.analysisId);
      if (!analysis) {
        throw new Error('Intersection analysis not found');
      }

      // Verify analysis belongs to the same intersection
      if (analysis.intersectionId.toString() !== planData.intersectionId.toString()) {
        throw new Error('Analysis does not belong to the specified intersection');
      }

      // Create decongestion plan
      const plan = new DecongestionPlan({
        ...planData,
        createdBy: userId,
      });

      await plan.save();

      // Populate related data for response
      await plan.populate('intersectionId', 'name coordinates congestionLevel');
      await plan.populate('analysisId', 'analysisDate congestionLevel');
      await plan.populate('createdBy', 'name email');

      console.log('Decongestion plan created successfully with ID:', plan._id);
      return plan;
    } catch (error) {
      console.error('Error creating decongestion plan:', error);
      throw new Error(error.message || 'Failed to create decongestion plan');
    }
  }

  // Retrieve decongestion plans with filtering
  async getPlans(filters = {}) {
    try {
      console.log('Fetching decongestion plans with filters:', filters);

      const query = {};

      // Apply filters
      if (filters.intersectionId) {
        query.intersectionId = filters.intersectionId;
      }

      if (filters.status) {
        query['implementation.status'] = filters.status;
      }

      if (filters.currentCongestionLevel) {
        query.currentCongestionLevel = filters.currentCongestionLevel;
      }

      if (filters.targetCongestionLevel) {
        query.targetCongestionLevel = filters.targetCongestionLevel;
      }

      if (filters.createdBy) {
        query.createdBy = filters.createdBy;
      }

      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
          query.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.createdAt.$lte = new Date(filters.dateTo);
        }
      }

      // Set up pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;
      const skip = (page - 1) * limit;

      // Execute query
      const [plans, totalCount] = await Promise.all([
        DecongestionPlan.find(query)
          .populate('intersectionId', 'name coordinates congestionLevel')
          .populate('analysisId', 'analysisDate congestionLevel')
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        DecongestionPlan.countDocuments(query)
      ]);

      console.log(`Found ${plans.length} decongestion plans (${totalCount} total)`);

      return {
        plans,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        }
      };
    } catch (error) {
      console.error('Error fetching decongestion plans:', error);
      throw new Error('Failed to retrieve decongestion plans');
    }
  }

  // Get plan by ID
  async getPlanById(planId) {
    try {
      console.log('Fetching decongestion plan by ID:', planId);

      const plan = await DecongestionPlan.findById(planId)
        .populate('intersectionId', 'name coordinates congestionLevel')
        .populate('analysisId', 'analysisDate congestionLevel trafficVolume')
        .populate('createdBy', 'name email')
        .lean();

      if (!plan) {
        throw new Error('Decongestion plan not found');
      }

      console.log('Decongestion plan retrieved successfully');
      return plan;
    } catch (error) {
      console.error('Error fetching decongestion plan by ID:', error);
      throw new Error(error.message || 'Failed to retrieve decongestion plan');
    }
  }

  // Update plan
  async updatePlan(planId, updateData, userId) {
    try {
      console.log('Updating decongestion plan:', planId);

      const plan = await DecongestionPlan.findById(planId);
      if (!plan) {
        throw new Error('Decongestion plan not found');
      }

      // Check if user has permission to update (creator or admin)
      if (plan.createdBy.toString() !== userId.toString()) {
        console.warn('User attempting to update plan they did not create');
      }

      // Update the plan
      Object.assign(plan, updateData);
      plan.updatedAt = new Date();

      await plan.save();

      // Populate for response
      await plan.populate('intersectionId', 'name coordinates');
      await plan.populate('analysisId', 'analysisDate congestionLevel');
      await plan.populate('createdBy', 'name email');

      console.log('Decongestion plan updated successfully');
      return plan;
    } catch (error) {
      console.error('Error updating decongestion plan:', error);
      throw new Error(error.message || 'Failed to update decongestion plan');
    }
  }

  // Delete plan
  async deletePlan(planId, userId) {
    try {
      console.log('Deleting decongestion plan:', planId);

      const plan = await DecongestionPlan.findById(planId);
      if (!plan) {
        throw new Error('Decongestion plan not found');
      }

      // Check if user has permission to delete (creator or admin)
      if (plan.createdBy.toString() !== userId.toString()) {
        console.warn('User attempting to delete plan they did not create');
      }

      await DecongestionPlan.findByIdAndDelete(planId);

      console.log('Decongestion plan deleted successfully');
      return { message: 'Plan deleted successfully' };
    } catch (error) {
      console.error('Error deleting decongestion plan:', error);
      throw new Error(error.message || 'Failed to delete decongestion plan');
    }
  }

  // Update plan status
  async updatePlanStatus(planId, status, userId) {
    try {
      console.log('Updating plan status:', planId, 'to', status);

      const plan = await DecongestionPlan.findById(planId);
      if (!plan) {
        throw new Error('Decongestion plan not found');
      }

      plan.implementation.status = status;
      plan.updatedAt = new Date();

      // Set dates based on status
      if (status === 'In Progress' && !plan.implementation.startDate) {
        plan.implementation.startDate = new Date();
      } else if (status === 'Completed' && !plan.implementation.endDate) {
        plan.implementation.endDate = new Date();
      }

      await plan.save();

      console.log('Plan status updated successfully');
      return plan;
    } catch (error) {
      console.error('Error updating plan status:', error);
      throw new Error(error.message || 'Failed to update plan status');
    }
  }

  // Get plan statistics
  async getPlanStatistics(filters = {}) {
    try {
      console.log('Calculating decongestion plan statistics');

      const matchStage = {};
      if (filters.dateFrom || filters.dateTo) {
        matchStage.createdAt = {};
        if (filters.dateFrom) {
          matchStage.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          matchStage.createdAt.$lte = new Date(filters.dateTo);
        }
      }

      const stats = await DecongestionPlan.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalPlans: { $sum: 1 },
            statusCounts: {
              $push: '$implementation.status'
            },
            avgEstimatedCost: { $avg: { $sum: '$proposedActions.estimatedCost' } },
            totalBudgetAllocated: { $sum: '$implementation.budget.allocated' },
            totalBudgetSpent: { $sum: '$implementation.budget.spent' },
            avgTrafficFlowImprovement: { $avg: '$expectedImpact.trafficFlowImprovement' },
          }
        },
        {
          $project: {
            _id: 0,
            totalPlans: 1,
            avgEstimatedCost: { $round: ['$avgEstimatedCost', 0] },
            totalBudgetAllocated: { $round: ['$totalBudgetAllocated', 0] },
            totalBudgetSpent: { $round: ['$totalBudgetSpent', 0] },
            avgTrafficFlowImprovement: { $round: ['$avgTrafficFlowImprovement', 1] },
            statusDistribution: {
              $reduce: {
                input: ['Draft', 'Under Review', 'Approved', 'In Progress', 'Completed', 'Cancelled'],
                initialValue: {},
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $arrayToObject: [[
                        { k: '$$this', v: { $size: { $filter: { input: '$statusCounts', cond: { $eq: ['$$item', '$$this'] } } } } }
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
        totalPlans: 0,
        avgEstimatedCost: 0,
        totalBudgetAllocated: 0,
        totalBudgetSpent: 0,
        avgTrafficFlowImprovement: 0,
        statusDistribution: {
          'Draft': 0,
          'Under Review': 0,
          'Approved': 0,
          'In Progress': 0,
          'Completed': 0,
          'Cancelled': 0
        }
      };

      console.log('Plan statistics calculated successfully');
      return result;
    } catch (error) {
      console.error('Error calculating plan statistics:', error);
      throw new Error('Failed to calculate plan statistics');
    }
  }
}

module.exports = new DecongestionPlanService();