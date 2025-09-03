import api from './api';

// Description: Get detailed road segment information
// Endpoint: GET /api/road-segments/:id
// Request: { id: string }
// Response: { segment: { id: string, name: string, classification: string, conditionScore: number, events: Array<{ id: string, type: string, date: string, description: string }>, images: Array<{ id: string, url: string, timestamp: string, vehicleId: string, issueType: string, confidence: number, gpsCoords: { lat: number, lng: number } }>, lidarData: { currentWidth: number, recommendedWidth: number, laneConfig: Array<{ type: string, width: number }>, recommendedConfig: Array<{ type: string, width: number }> } } }
export const getRoadSegmentDetails = (segmentId: string) => {
  console.log('Fetching road segment details for:', segmentId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        segment: {
          id: segmentId,
          name: 'Main Street Segment A',
          classification: 'Primary Arterial',
          conditionScore: 78,
          events: [
            { id: '1', type: 'Pothole Repair', date: '2024-01-15', description: 'Repaired large pothole near intersection' },
            { id: '2', type: 'Road Marking', date: '2024-01-12', description: 'Refreshed lane markings' },
            { id: '3', type: 'Inspection', date: '2024-01-10', description: 'Routine condition assessment' },
            { id: '4', type: 'Cleaning', date: '2024-01-08', description: 'Debris removal and cleaning' }
          ],
          images: [
            {
              id: '1',
              url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
              timestamp: '2024-01-15T10:30:00Z',
              vehicleId: 'VEH-001',
              issueType: 'Pothole',
              confidence: 0.92,
              gpsCoords: { lat: 40.7128, lng: -74.0060 }
            },
            {
              id: '2',
              url: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400',
              timestamp: '2024-01-14T14:20:00Z',
              vehicleId: 'VEH-002',
              issueType: 'Road Marking',
              confidence: 0.87,
              gpsCoords: { lat: 40.7130, lng: -74.0062 }
            },
            {
              id: '3',
              url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
              timestamp: '2024-01-13T09:15:00Z',
              vehicleId: 'VEH-003',
              issueType: 'Surface Crack',
              confidence: 0.78,
              gpsCoords: { lat: 40.7125, lng: -74.0058 }
            }
          ],
          lidarData: {
            currentWidth: 12.5,
            recommendedWidth: 14.0,
            laneConfig: [
              { type: 'Traffic Lane', width: 3.5 },
              { type: 'Traffic Lane', width: 3.5 },
              { type: 'Parking', width: 2.5 },
              { type: 'Sidewalk', width: 3.0 }
            ],
            recommendedConfig: [
              { type: 'Traffic Lane', width: 3.5 },
              { type: 'Traffic Lane', width: 3.5 },
              { type: 'Bike Lane', width: 2.0 },
              { type: 'Parking', width: 2.5 },
              { type: 'Sidewalk', width: 2.5 }
            ]
          }
        }
      });
    }, 800);
  });
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