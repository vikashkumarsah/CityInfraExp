import api from './api';

// Description: Create a new intersection analysis record
// Endpoint: POST /api/intersections/analysis
// Request: { intersectionId: string, analysisDate?: Date, trafficVolume: { hourlyData: Array<{ hour: number, volume: number, direction: string }>, totalDailyVolume: number }, peakHours: Array<{ startTime: string, endTime: string, peakVolume: number, congestionLevel: string }>, averageSpeed: { byDirection: Array<{ direction: string, speed: number }>, overall: number }, congestionLevel: string, pedestrianData?: { totalCrossings: number, peakCrossingHours: Array<{ hour: number, crossings: number }> }, weatherConditions?: string, analysisNotes?: string }
// Response: { success: boolean, data: IntersectionAnalysis, message: string }
export const createIntersectionAnalysis = async (analysisData: {
  intersectionId: string;
  analysisDate?: Date;
  trafficVolume: {
    hourlyData: Array<{
      hour: number;
      volume: number;
      direction: string;
    }>;
    totalDailyVolume: number;
  };
  peakHours: Array<{
    startTime: string;
    endTime: string;
    peakVolume: number;
    congestionLevel: string;
  }>;
  averageSpeed: {
    byDirection: Array<{
      direction: string;
      speed: number;
    }>;
    overall: number;
  };
  congestionLevel: string;
  pedestrianData?: {
    totalCrossings: number;
    peakCrossingHours: Array<{
      hour: number;
      crossings: number;
    }>;
  };
  weatherConditions?: string;
  analysisNotes?: string;
}) => {
  try {
    console.log('Creating intersection analysis for intersection:', analysisData.intersectionId);
    const response = await api.post('/api/intersections/analysis', analysisData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating intersection analysis:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get intersection analysis records with filtering options
// Endpoint: GET /api/intersections/analysis
// Request: { intersectionId?: string, congestionLevel?: string, dateFrom?: string, dateTo?: string, createdBy?: string, page?: number, limit?: number }
// Response: { success: boolean, data: { analyses: Array<IntersectionAnalysis>, pagination: { currentPage: number, totalPages: number, totalRecords: number, hasNext: boolean, hasPrev: boolean } }, message: string }
export const getIntersectionAnalyses = async (filters?: {
  intersectionId?: string;
  congestionLevel?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    console.log('Fetching intersection analyses with filters:', filters);
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/api/intersections/analysis?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching intersection analyses:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get specific intersection analysis by ID
// Endpoint: GET /api/intersections/analysis/:analysisId
// Request: { analysisId: string }
// Response: { success: boolean, data: IntersectionAnalysis, message: string }
export const getIntersectionAnalysisById = async (analysisId: string) => {
  try {
    console.log('Fetching intersection analysis by ID:', analysisId);
    const response = await api.get(`/api/intersections/analysis/${analysisId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching intersection analysis by ID:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update intersection analysis
// Endpoint: PUT /api/intersections/analysis/:analysisId
// Request: { analysisId: string, updateData: Partial<IntersectionAnalysis> }
// Response: { success: boolean, data: IntersectionAnalysis, message: string }
export const updateIntersectionAnalysis = async (analysisId: string, updateData: any) => {
  try {
    console.log('Updating intersection analysis:', analysisId);
    const response = await api.put(`/api/intersections/analysis/${analysisId}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating intersection analysis:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete intersection analysis
// Endpoint: DELETE /api/intersections/analysis/:analysisId
// Request: { analysisId: string }
// Response: { success: boolean, data: { message: string }, message: string }
export const deleteIntersectionAnalysis = async (analysisId: string) => {
  try {
    console.log('Deleting intersection analysis:', analysisId);
    const response = await api.delete(`/api/intersections/analysis/${analysisId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting intersection analysis:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get intersection analysis statistics
// Endpoint: GET /api/intersections/analysis/statistics
// Request: { dateFrom?: string, dateTo?: string }
// Response: { success: boolean, data: { totalAnalyses: number, avgTrafficVolume: number, avgOverallSpeed: number, congestionDistribution: object }, message: string }
export const getIntersectionAnalysisStatistics = async (filters?: {
  dateFrom?: string;
  dateTo?: string;
}) => {
  try {
    console.log('Fetching intersection analysis statistics');
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/api/intersections/analysis/statistics?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching intersection analysis statistics:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};