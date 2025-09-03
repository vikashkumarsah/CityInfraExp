import api from './api';

// Description: Get detailed road segment information
// Endpoint: GET /api/road-segments/:id
// Request: { id: string }
// Response: { segment: { id: string, name: string, classification: string, conditionScore: number, events: Array<{ id: string, type: string, date: string, description: string }>, images: Array<{ id: string, url: string, timestamp: string, vehicleId: string, issueType: string, confidence: number, gpsCoords: { lat: number, lng: number } }>, lidarData: { currentWidth: number, recommendedWidth: number, laneConfig: Array<{ type: string, width: number }>, recommendedConfig: Array<{ type: string, width: number }> } } }
export const getRoadSegmentDetails = async (segmentId: string) => {
  try {
    console.log('Fetching road segment details for:', segmentId);
    const response = await api.get(`/api/road-segments/${segmentId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching road segment details:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get road segment condition scores
// Endpoint: GET /api/road-segments/:id/condition-scores
// Request: { id: string }
// Response: { overall: number, surfaceQuality: number, structuralIntegrity: number, drainage: number, lastUpdated: string }
export const getRoadSegmentConditionScores = async (segmentId: string) => {
  try {
    console.log('Fetching road segment condition scores for:', segmentId);
    const response = await api.get(`/api/road-segments/${segmentId}/condition-scores`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching road segment condition scores:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get road segment event timeline
// Endpoint: GET /api/road-segments/:id/events
// Request: { id: string }
// Response: Array<{ id: string, type: string, date: string, description: string, severity: string }>
export const getRoadSegmentEvents = async (segmentId: string) => {
  try {
    console.log('Fetching road segment events for:', segmentId);
    const response = await api.get(`/api/road-segments/${segmentId}/events`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching road segment events:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get road segment visual evidence
// Endpoint: GET /api/road-segments/:id/visual-evidence
// Request: { id: string }
// Response: Array<{ id: string, url: string, type: string, dateTaken: string, vehicleId: string, confidence: number, coordinates: { lat: number, lng: number } }>
export const getRoadSegmentVisualEvidence = async (segmentId: string) => {
  try {
    console.log('Fetching road segment visual evidence for:', segmentId);
    const response = await api.get(`/api/road-segments/${segmentId}/visual-evidence`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching road segment visual evidence:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get traffic intersection data
// Endpoint: GET /api/intersections/:id
// Request: { id: string }
// Response: { intersection: { id: string, name: string, location: { lat: number, lng: number }, trafficVolume: Array<{ time: string, volume: number, direction: string }>, avgSpeed: Array<{ direction: string, speed: number }>, peakHours: Array<{ hour: number, volume: number }>, pedestrianData: Array<{ time: string, crossings: number }> } }
export const getIntersectionDetails = (intersectionId: string) => {
  console.log('Fetching intersection details for:', intersectionId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        intersection: {
          id: intersectionId,
          name: 'Main St & 5th Ave Intersection',
          location: { lat: 40.7128, lng: -74.0060 },
          trafficVolume: [
            { time: '06:00', volume: 450, direction: 'North' },
            { time: '07:00', volume: 680, direction: 'North' },
            { time: '08:00', volume: 920, direction: 'North' },
            { time: '09:00', volume: 750, direction: 'North' },
            { time: '10:00', volume: 580, direction: 'North' },
            { time: '11:00', volume: 620, direction: 'North' }
          ],
          avgSpeed: [
            { direction: 'North', speed: 25 },
            { direction: 'South', speed: 28 },
            { direction: 'East', speed: 22 },
            { direction: 'West', speed: 24 }
          ],
          peakHours: [
            { hour: 7, volume: 1250 },
            { hour: 8, volume: 1580 },
            { hour: 9, volume: 1320 },
            { hour: 17, volume: 1420 },
            { hour: 18, volume: 1680 },
            { hour: 19, volume: 1180 }
          ],
          pedestrianData: [
            { time: '06:00', crossings: 45 },
            { time: '07:00', crossings: 120 },
            { time: '08:00', crossings: 180 },
            { time: '09:00', crossings: 95 },
            { time: '10:00', crossings: 75 },
            { time: '11:00', crossings: 85 }
          ]
        }
      });
    }, 700);
  });
};