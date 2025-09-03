import api from './api';

// Description: Create a new decongestion plan
// Endpoint: POST /api/decongestion-plans
// Request: { planName: string, intersectionId: string, analysisId: string, currentCongestionLevel: string, targetCongestionLevel: string, proposedActions: Array<{ actionType: string, description: string, estimatedCost?: number, estimatedDuration?: number, priority: string, coordinates?: Array<number> }>, expectedImpact?: { trafficFlowImprovement?: number, timeSavings?: number, safetyImprovement?: string, environmentalImpact?: string }, implementation?: { status?: string, startDate?: Date, endDate?: Date, assignedTeam?: string, budget?: { allocated?: number, spent?: number } } }
// Response: { success: boolean, data: DecongestionPlan, message: string }
export const createDecongestionPlan = async (planData: {
  planName: string;
  intersectionId: string;
  analysisId: string;
  currentCongestionLevel: string;
  targetCongestionLevel: string;
  proposedActions: Array<{
    actionType: string;
    description: string;
    estimatedCost?: number;
    estimatedDuration?: number;
    priority: string;
    coordinates?: Array<number>;
  }>;
  expectedImpact?: {
    trafficFlowImprovement?: number;
    timeSavings?: number;
    safetyImprovement?: string;
    environmentalImpact?: string;
  };
  implementation?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
    assignedTeam?: string;
    budget?: {
      allocated?: number;
      spent?: number;
    };
  };
}) => {
  try {
    console.log('Creating decongestion plan for intersection:', planData.intersectionId);
    const response = await api.post('/api/decongestion-plans', planData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating decongestion plan:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get decongestion plans with filtering options
// Endpoint: GET /api/decongestion-plans
// Request: { intersectionId?: string, status?: string, currentCongestionLevel?: string, targetCongestionLevel?: string, createdBy?: string, dateFrom?: string, dateTo?: string, page?: number, limit?: number }
// Response: { success: boolean, data: { plans: Array<DecongestionPlan>, pagination: { currentPage: number, totalPages: number, totalRecords: number, hasNext: boolean, hasPrev: boolean } }, message: string }
export const getDecongestionPlans = async (filters?: {
  intersectionId?: string;
  status?: string;
  currentCongestionLevel?: string;
  targetCongestionLevel?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    console.log('Fetching decongestion plans with filters:', filters);
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/api/decongestion-plans?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching decongestion plans:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get specific decongestion plan by ID
// Endpoint: GET /api/decongestion-plans/:planId
// Request: { planId: string }
// Response: { success: boolean, data: DecongestionPlan, message: string }
export const getDecongestionPlanById = async (planId: string) => {
  try {
    console.log('Fetching decongestion plan by ID:', planId);
    const response = await api.get(`/api/decongestion-plans/${planId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching decongestion plan by ID:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update decongestion plan
// Endpoint: PUT /api/decongestion-plans/:planId
// Request: { planId: string, updateData: Partial<DecongestionPlan> }
// Response: { success: boolean, data: DecongestionPlan, message: string }
export const updateDecongestionPlan = async (planId: string, updateData: any) => {
  try {
    console.log('Updating decongestion plan:', planId);
    const response = await api.put(`/api/decongestion-plans/${planId}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating decongestion plan:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update decongestion plan status
// Endpoint: PATCH /api/decongestion-plans/:planId/status
// Request: { planId: string, status: string }
// Response: { success: boolean, data: DecongestionPlan, message: string }
export const updateDecongestionPlanStatus = async (planId: string, status: string) => {
  try {
    console.log('Updating decongestion plan status:', planId, 'to', status);
    const response = await api.patch(`/api/decongestion-plans/${planId}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error('Error updating decongestion plan status:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete decongestion plan
// Endpoint: DELETE /api/decongestion-plans/:planId
// Request: { planId: string }
// Response: { success: boolean, data: { message: string }, message: string }
export const deleteDecongestionPlan = async (planId: string) => {
  try {
    console.log('Deleting decongestion plan:', planId);
    const response = await api.delete(`/api/decongestion-plans/${planId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting decongestion plan:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get decongestion plan statistics
// Endpoint: GET /api/decongestion-plans/statistics
// Request: { dateFrom?: string, dateTo?: string }
// Response: { success: boolean, data: { totalPlans: number, avgEstimatedCost: number, totalBudgetAllocated: number, totalBudgetSpent: number, avgTrafficFlowImprovement: number, statusDistribution: object }, message: string }
export const getDecongestionPlanStatistics = async (filters?: {
  dateFrom?: string;
  dateTo?: string;
}) => {
  try {
    console.log('Fetching decongestion plan statistics');
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/api/decongestion-plans/statistics?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching decongestion plan statistics:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};