import api from './api';

// Description: Get property price trends for a neighborhood over time
// Endpoint: GET /api/analytics/neighborhood-trends/{neighborhood_id}?timeRange=12m
// Request: { neighborhoodId: string, timeRange?: string }
// Response: { neighborhoodId: string, neighborhoodName: string, timeRange: string, trends: Array<{ date: string, averagePrice: number, medianPrice: number, totalSales: number, minPrice: number, maxPrice: number, avgPricePerSqFt: number }>, summary: { totalTransactions: number, currentAveragePrice: number, growthRate: number, priceRange: { min: number, max: number } } }
export const getNeighborhoodTrends = async (neighborhoodId: string, timeRange: string = '12m') => {
  try {
    const response = await api.get(`/api/analytics/neighborhood-trends/${neighborhoodId}?timeRange=${timeRange}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Compare property metrics between multiple neighborhoods
// Endpoint: POST /api/analytics/neighborhood-comparison
// Request: { neighborhoodIds: string[], metrics?: string[] }
// Response: { neighborhoods: Array<{ neighborhoodId: string, name: string, metrics: object }>, requestedMetrics: string[], comparisonDate: string }
export const compareNeighborhoods = async (data: { neighborhoodIds: string[]; metrics?: string[] }) => {
  try {
    const response = await api.post('/api/analytics/neighborhood-comparison', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Predict property value based on characteristics
// Endpoint: POST /api/analytics/property-prediction
// Request: { neighborhoodId: string, type: string, bedrooms: number, bathrooms: number, squareFootage: number, yearBuilt: number, condition?: string, amenities?: string[] }
// Response: { predictedValue: number, confidence: number, priceRange: { low: number, high: number }, pricePerSquareFoot: number, comparableProperties: Array<object>, recentTransactions: Array<object>, factors: object, neighborhood: object }
export const predictPropertyValue = async (data: {
  neighborhoodId: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  condition?: string;
  amenities?: string[];
}) => {
  try {
    const response = await api.post('/api/analytics/property-prediction', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get list of all neighborhoods for selection
// Endpoint: GET /api/analytics/neighborhoods
// Request: {}
// Response: { neighborhoods: Array<{ id: string, name: string, center: [number, number], population: number, averageIncome: number }> }
export const getNeighborhoods = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        neighborhoods: [
          {
            id: '507f1f77bcf86cd799439011',
            name: 'Downtown',
            center: [40.7150, -74.0050],
            population: 15000,
            averageIncome: 85000
          },
          {
            id: '507f1f77bcf86cd799439012',
            name: 'Midtown',
            center: [40.7550, -73.9850],
            population: 25000,
            averageIncome: 95000
          },
          {
            id: '507f1f77bcf86cd799439013',
            name: 'Upper East Side',
            center: [40.7750, -73.9750],
            population: 18000,
            averageIncome: 120000
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/analytics/neighborhoods');
  //   return response.data.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};