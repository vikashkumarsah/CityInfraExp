import api from './api';

// Description: Create a new report with specified parameters
// Endpoint: POST /api/reports
// Request: { title?: string, type: string, description?: string, period?: object, metrics?: string[], filters?: object, format?: string }
// Response: { success: boolean, message: string, data: { reportId: string, title: string, type: string, status: string, createdAt: string } }
export const createReport = async (reportData: {
  title?: string;
  type: string;
  description?: string;
  period?: {
    preset?: string;
    startDate?: Date;
    endDate?: Date;
  };
  metrics?: string[];
  filters?: object;
  format?: string;
}) => {
  try {
    return await api.post('/api/reports', reportData);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all reports for the authenticated user
// Endpoint: GET /api/reports
// Request: { type?: string, status?: string, limit?: number }
// Response: { success: boolean, data: { reports: Array<Report>, total: number } }
export const getReports = async (filters?: {
  type?: string;
  status?: string;
  limit?: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/api/reports?${queryString}` : '/api/reports';
    
    return await api.get(url);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a specific report by ID
// Endpoint: GET /api/reports/{reportId}
// Request: {}
// Response: { success: boolean, data: Report }
export const getReportById = async (reportId: string) => {
  try {
    return await api.get(`/api/reports/${reportId}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update report status
// Endpoint: PATCH /api/reports/{reportId}/status
// Request: { status: string }
// Response: { success: boolean, message: string, data: Report }
export const updateReportStatus = async (reportId: string, status: string) => {
  try {
    return await api.patch(`/api/reports/${reportId}/status`, { status });
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a report
// Endpoint: DELETE /api/reports/{reportId}
// Request: {}
// Response: { success: boolean, message: string }
export const deleteReport = async (reportId: string) => {
  try {
    return await api.delete(`/api/reports/${reportId}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get dashboard summary with report statistics
// Endpoint: GET /api/reports/dashboard/summary
// Request: {}
// Response: { success: boolean, data: { totalReports: number, completedReports: number, publishedReports: number, totalDownloads: number, recentReports: Array<Report>, typeBreakdown: object } }
export const getDashboardSummary = async () => {
  try {
    return await api.get('/api/reports/dashboard/summary');
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Download a report file
// Endpoint: GET /api/reports/{reportId}/download
// Request: {}
// Response: File download
export const downloadReport = async (reportId: string) => {
  try {
    const response = await api.get(`/api/reports/${reportId}/download`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Download started' };
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Generate share link for a report
// Endpoint: POST /api/reports/{reportId}/share
// Request: { isPublic?: boolean, emails?: string[] }
// Response: { success: boolean, data: { shareLink: string } }
export const shareReport = async (reportId: string, shareData?: {
  isPublic?: boolean;
  emails?: string[];
}) => {
  try {
    return await api.post(`/api/reports/${reportId}/share`, shareData || {});
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};