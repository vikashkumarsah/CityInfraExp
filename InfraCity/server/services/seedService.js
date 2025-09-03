const User = require('../models/User');
const Road = require('../models/Road');
const Issue = require('../models/Issue');
const Intersection = require('../models/Intersection');
const RoadSegmentEvent = require('../models/RoadSegmentEvent');
const RoadSegmentImage = require('../models/RoadSegmentImage');
const Neighborhood = require('../models/Neighborhood');
const Property = require('../models/Property');
const PropertyTransaction = require('../models/PropertyTransaction');
const { hashPassword } = require('../utils/password');

class SeedService {

  async seedAdminUser() {
    try {
      console.log('Seeding admin user...');

      // Check if admin user already exists
      const existingAdmin = await User.findOne({ email: 'admin@infracity.com' });
      if (existingAdmin) {
        console.log('Admin user already exists');
        return { success: true, message: 'Admin user already exists' };
      }

      const hashedPassword = await hashPassword('admin123');

      const adminUser = new User({
        name: 'System Administrator',
        email: 'admin@infracity.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('Admin user seeded successfully');

      return { success: true, message: 'Admin user created successfully' };
    } catch (error) {
      console.error('Error seeding admin user:', error);
      throw new Error('Failed to seed admin user');
    }
  }

  async seedRegularUsers() {
    try {
      console.log('Seeding regular users...');

      const users = [
        {
          name: 'John Smith',
          email: 'john.smith@infracity.com',
          password: 'user123',
          role: 'user'
        },
        {
          name: 'Jane Doe',
          email: 'jane.doe@infracity.com',
          password: 'user123',
          role: 'user'
        },
        {
          name: 'Mike Johnson',
          email: 'mike.johnson@infracity.com',
          password: 'user123',
          role: 'user'
        },
        {
          name: 'Sarah Wilson',
          email: 'sarah.wilson@infracity.com',
          password: 'user123',
          role: 'manager'
        }
      ];

      let createdCount = 0;

      for (const userData of users) {
        const existingUser = await User.findOne({ email: userData.email });
        if (!existingUser) {
          const hashedPassword = await hashPassword(userData.password);
          const user = new User({
            ...userData,
            password: hashedPassword,
            isActive: true
          });
          await user.save();
          createdCount++;
        }
      }

      console.log(`${createdCount} regular users seeded successfully`);
      return { success: true, message: `${createdCount} regular users created successfully` };
    } catch (error) {
      console.error('Error seeding regular users:', error);
      throw new Error('Failed to seed regular users');
    }
  }

  async seedInfrastructureData() {
    try {
      console.log('Seeding infrastructure data...');

      // Seed neighborhoods first
      const neighborhoods = [
        {
          name: 'Downtown',
          boundaries: {
            type: 'Polygon',
            coordinates: [[
              [-74.0100, 40.7100],
              [-74.0000, 40.7100],
              [-74.0000, 40.7200],
              [-74.0100, 40.7200],
              [-74.0100, 40.7100]
            ]]
          },
          center: [40.7150, -74.0050],
          averageIncome: 85000,
          population: 15000,
          area: 2.5,
          amenityScore: 85,
          transportScore: 90
        },
        {
          name: 'Midtown',
          boundaries: {
            type: 'Polygon',
            coordinates: [[
              [-73.9900, 40.7500],
              [-73.9800, 40.7500],
              [-73.9800, 40.7600],
              [-73.9900, 40.7600],
              [-73.9900, 40.7500]
            ]]
          },
          center: [40.7550, -73.9850],
          averageIncome: 95000,
          population: 25000,
          area: 3.2,
          amenityScore: 92,
          transportScore: 95
        },
        {
          name: 'Upper East Side',
          boundaries: {
            type: 'Polygon',
            coordinates: [[
              [-73.9800, 40.7700],
              [-73.9700, 40.7700],
              [-73.9700, 40.7800],
              [-73.9800, 40.7800],
              [-73.9800, 40.7700]
            ]]
          },
          center: [40.7750, -73.9750],
          averageIncome: 120000,
          population: 18000,
          area: 2.8,
          amenityScore: 88,
          transportScore: 85
        }
      ];

      let createdNeighborhoods = [];
      for (const neighborhoodData of neighborhoods) {
        const existingNeighborhood = await Neighborhood.findOne({ name: neighborhoodData.name });
        if (!existingNeighborhood) {
          const neighborhood = new Neighborhood(neighborhoodData);
          const savedNeighborhood = await neighborhood.save();
          createdNeighborhoods.push(savedNeighborhood);
        } else {
          createdNeighborhoods.push(existingNeighborhood);
        }
      }

      // Seed roads
      const roads = [
        {
          name: 'Main Street',
          condition: 78,
          issues: 3,
          lastInspection: new Date('2024-01-10'),
          coordinates: [40.7128, -74.0060],
          width: 12.5,
          lanes: 2,
          classification: 'arterial'
        },
        {
          name: 'Park Avenue',
          condition: 65,
          issues: 8,
          lastInspection: new Date('2024-01-08'),
          coordinates: [40.7589, -73.9851],
          width: 10.0,
          lanes: 2,
          classification: 'collector'
        },
        {
          name: 'Broadway',
          condition: 91,
          issues: 1,
          lastInspection: new Date('2024-01-12'),
          coordinates: [40.7505, -73.9934],
          width: 15.0,
          lanes: 4,
          classification: 'arterial'
        },
        {
          name: 'Fifth Avenue',
          condition: 68,
          issues: 12,
          lastInspection: new Date('2024-01-05'),
          coordinates: [40.7614, -73.9776],
          width: 11.5,
          lanes: 2,
          classification: 'local'
        }
      ];

      let createdRoads = [];
      for (const roadData of roads) {
        const existingRoad = await Road.findOne({ name: roadData.name });
        if (!existingRoad) {
          const road = new Road(roadData);
          const savedRoad = await road.save();
          createdRoads.push(savedRoad);
        } else {
          createdRoads.push(existingRoad);
        }
      }

      // Seed properties
      const properties = [
        {
          address: '123 Main Street, Downtown',
          coordinates: [40.7130, -74.0058],
          neighborhoodId: createdNeighborhoods[0]._id,
          type: 'Condo',
          bedrooms: 2,
          bathrooms: 2,
          squareFootage: 1200,
          lotSize: 0,
          yearBuilt: 2010,
          currentValue: 650000,
          amenities: ['AC', 'Balcony', 'Parking'],
          condition: 'Good'
        },
        {
          address: '456 Park Avenue, Midtown',
          coordinates: [40.7590, -73.9850],
          neighborhoodId: createdNeighborhoods[1]._id,
          type: 'Single Family',
          bedrooms: 3,
          bathrooms: 2.5,
          squareFootage: 1800,
          lotSize: 2500,
          yearBuilt: 1995,
          currentValue: 850000,
          amenities: ['Garage', 'Garden', 'Fireplace'],
          condition: 'Excellent'
        },
        {
          address: '789 Broadway, Midtown',
          coordinates: [40.7506, -73.9935],
          neighborhoodId: createdNeighborhoods[1]._id,
          type: 'Townhouse',
          bedrooms: 4,
          bathrooms: 3,
          squareFootage: 2200,
          lotSize: 1200,
          yearBuilt: 2005,
          currentValue: 1200000,
          amenities: ['Pool', 'Garage', 'AC', 'Heating'],
          condition: 'Good'
        },
        {
          address: '321 Fifth Avenue, Upper East Side',
          coordinates: [40.7615, -73.9775],
          neighborhoodId: createdNeighborhoods[2]._id,
          type: 'Condo',
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1500,
          lotSize: 0,
          yearBuilt: 2015,
          currentValue: 950000,
          amenities: ['Balcony', 'AC', 'Parking'],
          condition: 'Excellent'
        },
        {
          address: '654 Upper East Side Ave',
          coordinates: [40.7760, -73.9740],
          neighborhoodId: createdNeighborhoods[2]._id,
          type: 'Single Family',
          bedrooms: 5,
          bathrooms: 4,
          squareFootage: 3000,
          lotSize: 4000,
          yearBuilt: 1985,
          currentValue: 1500000,
          amenities: ['Pool', 'Garage', 'Garden', 'Fireplace', 'AC'],
          condition: 'Good'
        }
      ];

      let createdProperties = [];
      for (const propertyData of properties) {
        const existingProperty = await Property.findOne({ address: propertyData.address });
        if (!existingProperty) {
          const property = new Property(propertyData);
          const savedProperty = await property.save();
          createdProperties.push(savedProperty);
        } else {
          createdProperties.push(existingProperty);
        }
      }

      // Seed property transactions
      const transactions = [];
      const baseDate = new Date('2023-01-01');
      
      createdProperties.forEach((property, index) => {
        // Generate 6-12 months of transaction history
        for (let i = 0; i < 12; i++) {
          const saleDate = new Date(baseDate);
          saleDate.setMonth(baseDate.getMonth() + i);
          
          // Skip some months randomly to create realistic gaps
          if (Math.random() > 0.7) continue;
          
          const basePrice = property.currentValue;
          const priceVariation = (Math.random() - 0.5) * 0.2; // ±10% variation
          const salePrice = Math.round(basePrice * (1 + priceVariation));
          
          transactions.push({
            propertyId: property._id,
            salePrice: salePrice,
            saleDate: saleDate,
            transactionType: 'Sale',
            pricePerSquareFoot: Math.round((salePrice / property.squareFootage) * 100) / 100,
            daysOnMarket: Math.floor(Math.random() * 90) + 10,
            listingPrice: Math.round(salePrice * (1 + Math.random() * 0.1)),
            agentId: `AGENT-${Math.floor(Math.random() * 100) + 1}`
          });
        }
      });

      let createdTransactions = 0;
      for (const transactionData of transactions) {
        const existingTransaction = await PropertyTransaction.findOne({
          propertyId: transactionData.propertyId,
          saleDate: transactionData.saleDate
        });
        if (!existingTransaction) {
          const transaction = new PropertyTransaction(transactionData);
          await transaction.save();
          createdTransactions++;
        }
      }

      // Seed road segment events
      const events = [
        {
          roadId: createdRoads[0]._id,
          type: 'Pothole Repair',
          description: 'Repaired large pothole near intersection',
          severity: 'High',
          date: new Date('2024-01-15')
        },
        {
          roadId: createdRoads[0]._id,
          type: 'Road Marking',
          description: 'Refreshed lane markings',
          severity: 'Medium',
          date: new Date('2024-01-12')
        },
        {
          roadId: createdRoads[0]._id,
          type: 'Inspection',
          description: 'Routine condition assessment',
          severity: 'Low',
          date: new Date('2024-01-10')
        },
        {
          roadId: createdRoads[0]._id,
          type: 'Cleaning',
          description: 'Debris removal and cleaning',
          severity: 'Low',
          date: new Date('2024-01-08')
        },
        {
          roadId: createdRoads[1]._id,
          type: 'Maintenance',
          description: 'General maintenance work',
          severity: 'Medium',
          date: new Date('2024-01-14')
        },
        {
          roadId: createdRoads[2]._id,
          type: 'Construction',
          description: 'Road widening project',
          severity: 'High',
          date: new Date('2024-01-11')
        }
      ];

      let createdEvents = 0;
      for (const eventData of events) {
        const existingEvent = await RoadSegmentEvent.findOne({
          roadId: eventData.roadId,
          type: eventData.type,
          date: eventData.date
        });
        if (!existingEvent) {
          const event = new RoadSegmentEvent(eventData);
          await event.save();
          createdEvents++;
        }
      }

      // Seed road segment images
      const images = [
        {
          roadId: createdRoads[0]._id,
          url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
          type: 'Pothole',
          dateTaken: new Date('2024-01-15T10:30:00Z'),
          vehicleId: 'VEH-001',
          confidence: 0.92,
          coordinates: [40.7128, -74.0060]
        },
        {
          roadId: createdRoads[0]._id,
          url: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400',
          type: 'Road Marking',
          dateTaken: new Date('2024-01-14T14:20:00Z'),
          vehicleId: 'VEH-002',
          confidence: 0.87,
          coordinates: [40.7130, -74.0062]
        },
        {
          roadId: createdRoads[0]._id,
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          type: 'Surface Crack',
          dateTaken: new Date('2024-01-13T09:15:00Z'),
          vehicleId: 'VEH-003',
          confidence: 0.78,
          coordinates: [40.7125, -74.0058]
        },
        {
          roadId: createdRoads[1]._id,
          url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
          type: 'Debris',
          dateTaken: new Date('2024-01-13T11:45:00Z'),
          vehicleId: 'VEH-004',
          confidence: 0.85,
          coordinates: [40.7589, -73.9851]
        }
      ];

      let createdImages = 0;
      for (const imageData of images) {
        const existingImage = await RoadSegmentImage.findOne({
          roadId: imageData.roadId,
          url: imageData.url,
          dateTaken: imageData.dateTaken
        });
        if (!existingImage) {
          const image = new RoadSegmentImage(imageData);
          await image.save();
          createdImages++;
        }
      }

      // Seed intersections
      const intersections = [
        {
          name: 'Main St & 5th Ave',
          coordinates: [40.7128, -74.0060],
          trafficVolume: 1250,
          avgSpeed: 25,
          congestionLevel: 'High',
          peakHours: [
            { hour: 8, volume: 1580 },
            { hour: 17, volume: 1420 }
          ]
        },
        {
          name: 'Park & Broadway',
          coordinates: [40.7589, -73.9851],
          trafficVolume: 890,
          avgSpeed: 35,
          congestionLevel: 'Medium',
          peakHours: [
            { hour: 8, volume: 920 },
            { hour: 17, volume: 980 }
          ]
        },
        {
          name: 'Times Square',
          coordinates: [40.7580, -73.9855],
          trafficVolume: 2100,
          avgSpeed: 15,
          congestionLevel: 'Very High',
          peakHours: [
            { hour: 8, volume: 2500 },
            { hour: 17, volume: 2300 }
          ]
        }
      ];

      let createdIntersections = 0;
      for (const intersectionData of intersections) {
        const existingIntersection = await Intersection.findOne({ name: intersectionData.name });
        if (!existingIntersection) {
          const intersection = new Intersection(intersectionData);
          await intersection.save();
          createdIntersections++;
        }
      }

      // Seed issues
      const issues = [
        {
          type: 'Pothole',
          description: 'Large pothole causing vehicle damage',
          severity: 'High',
          coordinates: [40.7128, -74.0060],
          status: 'Open',
          reportedBy: 'citizen'
        },
        {
          type: 'Garbage',
          description: 'Garbage accumulation on sidewalk',
          severity: 'Medium',
          coordinates: [40.7589, -73.9851],
          status: 'In Progress',
          reportedBy: 'inspector'
        },
        {
          type: 'Road Marker',
          description: 'Faded road markings need refresh',
          severity: 'Low',
          coordinates: [40.7614, -73.9776],
          status: 'Open',
          reportedBy: 'citizen'
        },
        {
          type: 'Traffic Flow',
          description: 'Traffic congestion during peak hours',
          severity: 'High',
          coordinates: [40.7580, -73.9855],
          status: 'Open',
          reportedBy: 'system'
        }
      ];

      let createdIssues = 0;
      for (const issueData of issues) {
        const existingIssue = await Issue.findOne({
          type: issueData.type,
          coordinates: issueData.coordinates
        });
        if (!existingIssue) {
          const issue = new Issue(issueData);
          await issue.save();
          createdIssues++;
        }
      }

      console.log(`Infrastructure data seeded successfully: ${createdNeighborhoods.length} neighborhoods, ${createdProperties.length} properties, ${createdTransactions} transactions, ${createdRoads.length} roads, ${createdEvents} events, ${createdImages} images, ${createdIntersections} intersections, ${createdIssues} issues`);

      return {
        success: true,
        message: `Infrastructure data seeded: ${createdNeighborhoods.length} neighborhoods, ${createdProperties.length} properties, ${createdTransactions} transactions, ${createdRoads.length} roads, ${createdEvents} events, ${createdImages} images, ${createdIntersections} intersections, ${createdIssues} issues`
      };
    } catch (error) {
      console.error('Error seeding infrastructure data:', error);
      throw new Error('Failed to seed infrastructure data');
    }
  }
}

module.exports = new SeedService();