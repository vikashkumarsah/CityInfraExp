import api from './api';

// Description: Get infrastructure overview data
// Endpoint: GET /api/infrastructure/overview
// Request: {}
// Response: { totalIssues: number, roadHealthIndex: number, beautificationProgress: number, trafficCongestion: string, recentIssues: Array<{ id: string, type: string, location: string, severity: string, timestamp: string }> }
export const getInfrastructureOverview = () => {
  console.log('Fetching infrastructure overview data');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalIssues: 247,
        roadHealthIndex: 78,
        beautificationProgress: 65,
        trafficCongestion: 'Moderate',
        recentIssues: [
          { id: '1', type: 'Pothole', location: 'Main St & 5th Ave', severity: 'High', timestamp: '2024-01-15T10:30:00Z' },
          { id: '2', type: 'Garbage', location: 'Park Avenue', severity: 'Medium', timestamp: '2024-01-15T09:15:00Z' },
          { id: '3', type: 'Road Marker', location: 'Highway 101', severity: 'Low', timestamp: '2024-01-15T08:45:00Z' },
          { id: '4', type: 'Traffic Flow', location: 'Downtown Intersection', severity: 'High', timestamp: '2024-01-15T08:00:00Z' },
        ]
      });
    }, 800);
  });
};

// Description: Get road segments data
// Endpoint: GET /api/infrastructure/roads
// Request: { filters?: { type?: string, severity?: string, timeRange?: string } }
// Response: { roads: Array<{ id: string, name: string, condition: number, issues: number, lastInspection: string, coordinates: Array<number> }> }
export const getRoadSegments = (filters = {}) => {
  console.log('Fetching road segments with filters:', filters);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        roads: [
          { id: '1', name: 'Main Street', condition: 85, issues: 3, lastInspection: '2024-01-10', coordinates: [40.7128, -74.0060] },
          { id: '2', name: 'Park Avenue', condition: 72, issues: 8, lastInspection: '2024-01-08', coordinates: [40.7589, -73.9851] },
          { id: '3', name: 'Broadway', condition: 91, issues: 1, lastInspection: '2024-01-12', coordinates: [40.7505, -73.9934] },
          { id: '4', name: 'Fifth Avenue', condition: 68, issues: 12, lastInspection: '2024-01-05', coordinates: [40.7614, -73.9776] },
        ]
      });
    }, 600);
  });
};

// Description: Get traffic data for intersections
// Endpoint: GET /api/infrastructure/traffic
// Request: {}
// Response: { intersections: Array<{ id: string, name: string, volume: number, avgSpeed: number, congestionLevel: string, coordinates: Array<number> }> }
export const getTrafficData = () => {
  console.log('Fetching traffic data');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        intersections: [
          { id: '1', name: 'Main & 5th', volume: 1250, avgSpeed: 25, congestionLevel: 'High', coordinates: [40.7128, -74.0060] },
          { id: '2', name: 'Park & Broadway', volume: 890, avgSpeed: 35, congestionLevel: 'Medium', coordinates: [40.7589, -73.9851] },
          { id: '3', name: 'Times Square', volume: 2100, avgSpeed: 15, congestionLevel: 'Very High', coordinates: [40.7580, -73.9855] },
        ]
      });
    }, 700);
  });
};

// Description: Get analytics data
// Endpoint: GET /api/infrastructure/analytics
// Request: { timeRange: string }
// Response: { issuesTrend: Array<{ date: string, count: number }>, severityDistribution: Array<{ severity: string, count: number }>, typeDistribution: Array<{ type: string, count: number }> }
export const getAnalyticsData = (timeRange: string) => {
  console.log('Fetching analytics data for time range:', timeRange);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        issuesTrend: [
          { date: '2024-01-01', count: 45 },
          { date: '2024-01-02', count: 52 },
          { date: '2024-01-03', count: 38 },
          { date: '2024-01-04', count: 61 },
          { date: '2024-01-05', count: 49 },
          { date: '2024-01-06', count: 55 },
          { date: '2024-01-07', count: 43 },
        ],
        severityDistribution: [
          { severity: 'Low', count: 120 },
          { severity: 'Medium', count: 85 },
          { severity: 'High', count: 42 },
        ],
        typeDistribution: [
          { type: 'Potholes', count: 98 },
          { type: 'Garbage', count: 67 },
          { type: 'Road Markers', count: 45 },
          { type: 'Traffic Flow', count: 37 },
        ]
      });
    }, 900);
  });
};

// Description: Get real-time infrastructure metrics
// Endpoint: GET /api/infrastructure/metrics
// Request: {}
// Response: { cpu: { usage: number, cores: number }, memory: { total: number, used: number, free: number, usage: number }, disk: { total: number, used: number, free: number, usage: number }, network: { bytesReceived: number, bytesSent: number, packetsReceived: number, packetsSent: number }, timestamp: string }
export const getInfrastructureMetrics = async () => {
  try {
    console.log('Fetching real-time infrastructure metrics');
    const response = await api.get('/api/infrastructure/metrics');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching infrastructure metrics:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get issue density heatmap data
// Endpoint: GET /api/issues/heatmap
// Request: {}
// Response: { data: Array<{ lat: number, lng: number, value: number }>, max_value: number, min_value: number, timestamp: string }
export const getIssueHeatmapData = async () => {
  try {
    console.log('Fetching issue heatmap data');
    const response = await api.get('/api/issues/heatmap');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get key performance metrics
// Endpoint: GET /api/metrics/performance
// Request: {}
// Response: { issueMetrics: { total: number, resolved: number, highPriority: number, resolutionRate: number, last24Hours: { reported: number, resolved: number } }, performanceMetrics: { averageResolutionTime: number, roadHealthIndex: number, totalRoads: number, roadsNeedingAttention: number }, timestamp: string, period: string }
export const getPerformanceMetrics = async () => {
  try {
    console.log('Fetching performance metrics');
    const response = await api.get('/api/metrics/performance');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};