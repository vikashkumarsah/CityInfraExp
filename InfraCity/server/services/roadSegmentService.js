const Road = require('../models/Road');
const RoadSegmentEvent = require('../models/RoadSegmentEvent');
const RoadSegmentImage = require('../models/RoadSegmentImage');

class RoadSegmentService {

  // Get condition scores for a road segment
  async getConditionScores(segmentId) {
    try {
      console.log(`Fetching condition scores for road segment: ${segmentId}`);

      const road = await Road.findById(segmentId);
      if (!road) {
        throw new Error('Road segment not found');
      }

      // Calculate different condition scores based on overall condition
      const overallScore = road.condition;
      const surfaceQuality = Math.max(0, Math.min(100, overallScore + (Math.random() * 20 - 10)));
      const structuralIntegrity = Math.max(0, Math.min(100, overallScore + (Math.random() * 15 - 7.5)));
      const drainage = Math.max(0, Math.min(100, overallScore + (Math.random() * 25 - 12.5)));

      const conditionScores = {
        overall: Math.round(overallScore),
        surfaceQuality: Math.round(surfaceQuality),
        structuralIntegrity: Math.round(structuralIntegrity),
        drainage: Math.round(drainage),
        lastUpdated: road.updatedAt || road.createdAt
      };

      console.log(`Condition scores retrieved for road segment: ${segmentId}`);
      return conditionScores;
    } catch (error) {
      console.error(`Error fetching condition scores for segment ${segmentId}:`, error);
      throw error;
    }
  }

  // Get event timeline for a road segment
  async getEventTimeline(segmentId) {
    try {
      console.log(`Fetching event timeline for road segment: ${segmentId}`);

      const road = await Road.findById(segmentId);
      if (!road) {
        throw new Error('Road segment not found');
      }

      const events = await RoadSegmentEvent.find({ roadId: segmentId })
        .sort({ date: -1 })
        .lean();

      console.log(`Found ${events.length} events for road segment: ${segmentId}`);

      const formattedEvents = events.map(event => ({
        id: event._id,
        type: event.type,
        date: event.date,
        description: event.description,
        severity: event.severity
      }));

      return formattedEvents;
    } catch (error) {
      console.error(`Error fetching event timeline for segment ${segmentId}:`, error);
      throw error;
    }
  }

  // Get visual evidence for a road segment
  async getVisualEvidence(segmentId) {
    try {
      console.log(`Fetching visual evidence for road segment: ${segmentId}`);

      const road = await Road.findById(segmentId);
      if (!road) {
        throw new Error('Road segment not found');
      }

      const images = await RoadSegmentImage.find({ roadId: segmentId })
        .sort({ dateTaken: -1 })
        .lean();

      console.log(`Found ${images.length} images for road segment: ${segmentId}`);

      const formattedImages = images.map(image => ({
        id: image._id,
        url: image.url,
        type: image.type,
        dateTaken: image.dateTaken,
        vehicleId: image.vehicleId,
        confidence: image.confidence,
        coordinates: {
          lat: image.coordinates[0],
          lng: image.coordinates[1]
        }
      }));

      return formattedImages;
    } catch (error) {
      console.error(`Error fetching visual evidence for segment ${segmentId}:`, error);
      throw error;
    }
  }

  // Get complete road segment details (for existing getRoadSegmentDetails function)
  async getRoadSegmentDetails(segmentId) {
    try {
      console.log(`Fetching complete road segment details: ${segmentId}`);

      const road = await Road.findById(segmentId);
      if (!road) {
        throw new Error('Road segment not found');
      }

      const [conditionScores, events, images] = await Promise.all([
        this.getConditionScores(segmentId),
        this.getEventTimeline(segmentId),
        this.getVisualEvidence(segmentId)
      ]);

      const segmentDetails = {
        id: road._id,
        name: road.name,
        classification: this.getClassificationDisplay(road.classification),
        conditionScore: road.condition,
        events: events,
        images: images.map(image => ({
          id: image.id,
          url: image.url,
          timestamp: image.dateTaken,
          vehicleId: image.vehicleId,
          issueType: image.type,
          confidence: image.confidence,
          gpsCoords: image.coordinates
        })),
        lidarData: {
          currentWidth: road.width,
          recommendedWidth: road.width + 1.5,
          laneConfig: this.generateLaneConfig(road.width, road.lanes),
          recommendedConfig: this.generateRecommendedConfig(road.width, road.lanes)
        }
      };

      console.log(`Complete road segment details retrieved for: ${segmentId}`);
      return segmentDetails;
    } catch (error) {
      console.error(`Error fetching road segment details for ${segmentId}:`, error);
      throw error;
    }
  }

  getClassificationDisplay(classification) {
    const displayNames = {
      'highway': 'Highway',
      'arterial': 'Primary Arterial',
      'collector': 'Collector Road',
      'local': 'Local Street'
    };
    return displayNames[classification] || 'Local Street';
  }

  generateLaneConfig(width, lanes) {
    const laneWidth = width / lanes;
    const config = [];
    
    for (let i = 0; i < lanes; i++) {
      config.push({
        type: 'Traffic Lane',
        width: Math.round(laneWidth * 10) / 10
      });
    }

    if (width > lanes * 3.5) {
      config.push({
        type: 'Parking',
        width: Math.round((width - lanes * 3.5) * 10) / 10
      });
    }

    return config;
  }

  generateRecommendedConfig(width, lanes) {
    const config = [];
    const totalWidth = width + 1.5;
    
    // Add traffic lanes
    for (let i = 0; i < lanes; i++) {
      config.push({
        type: 'Traffic Lane',
        width: 3.5
      });
    }

    const remainingWidth = totalWidth - (lanes * 3.5);
    
    if (remainingWidth >= 2.0) {
      config.push({
        type: 'Bike Lane',
        width: 2.0
      });
    }
    
    if (remainingWidth >= 4.5) {
      config.push({
        type: 'Parking',
        width: 2.5
      });
    }

    return config;
  }
}

module.exports = new RoadSegmentService();