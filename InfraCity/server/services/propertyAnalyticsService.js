const Property = require('../models/Property');
const PropertyTransaction = require('../models/PropertyTransaction');
const Neighborhood = require('../models/Neighborhood');

class PropertyAnalyticsService {

  // Get property price trends for a neighborhood over time
  async getNeighborhoodTrends(neighborhoodId, timeRange = '12m') {
    try {
      console.log(`Fetching property trends for neighborhood: ${neighborhoodId}, timeRange: ${timeRange}`);

      // Verify neighborhood exists
      const neighborhood = await Neighborhood.findById(neighborhoodId);
      if (!neighborhood) {
        throw new Error('Neighborhood not found');
      }

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '6m':
          startDate.setMonth(endDate.getMonth() - 6);
          break;
        case '12m':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        case '24m':
          startDate.setFullYear(endDate.getFullYear() - 2);
          break;
        case '5y':
          startDate.setFullYear(endDate.getFullYear() - 5);
          break;
        default:
          startDate.setFullYear(endDate.getFullYear() - 1);
      }

      // Get properties in the neighborhood
      const properties = await Property.find({ neighborhoodId }).select('_id');
      const propertyIds = properties.map(p => p._id);

      // Aggregate transaction data by month
      const trends = await PropertyTransaction.aggregate([
        {
          $match: {
            propertyId: { $in: propertyIds },
            saleDate: { $gte: startDate, $lte: endDate },
            transactionType: 'Sale'
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$saleDate' },
              month: { $month: '$saleDate' }
            },
            averagePrice: { $avg: '$salePrice' },
            medianPrice: { $median: '$salePrice' },
            totalSales: { $sum: 1 },
            minPrice: { $min: '$salePrice' },
            maxPrice: { $max: '$salePrice' },
            avgPricePerSqFt: { $avg: '$pricePerSquareFoot' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      // Format the results
      const formattedTrends = trends.map(trend => ({
        date: `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}-01`,
        averagePrice: Math.round(trend.averagePrice || 0),
        medianPrice: Math.round(trend.medianPrice || 0),
        totalSales: trend.totalSales,
        minPrice: Math.round(trend.minPrice || 0),
        maxPrice: Math.round(trend.maxPrice || 0),
        avgPricePerSqFt: Math.round((trend.avgPricePerSqFt || 0) * 100) / 100
      }));

      // Calculate growth metrics
      const currentPeriod = formattedTrends[formattedTrends.length - 1];
      const previousPeriod = formattedTrends[formattedTrends.length - 2];
      
      let growthRate = 0;
      if (currentPeriod && previousPeriod && previousPeriod.averagePrice > 0) {
        growthRate = ((currentPeriod.averagePrice - previousPeriod.averagePrice) / previousPeriod.averagePrice) * 100;
      }

      const result = {
        neighborhoodId,
        neighborhoodName: neighborhood.name,
        timeRange,
        trends: formattedTrends,
        summary: {
          totalTransactions: formattedTrends.reduce((sum, trend) => sum + trend.totalSales, 0),
          currentAveragePrice: currentPeriod ? currentPeriod.averagePrice : 0,
          growthRate: Math.round(growthRate * 100) / 100,
          priceRange: {
            min: Math.min(...formattedTrends.map(t => t.minPrice).filter(p => p > 0)),
            max: Math.max(...formattedTrends.map(t => t.maxPrice))
          }
        }
      };

      console.log(`Property trends retrieved for neighborhood: ${neighborhoodId}, found ${formattedTrends.length} data points`);
      return result;
    } catch (error) {
      console.error(`Error fetching neighborhood trends for ${neighborhoodId}:`, error);
      throw error;
    }
  }

  // Compare property metrics between multiple neighborhoods
  async compareNeighborhoods(neighborhoodIds, metrics = ['averagePrice', 'medianPrice', 'pricePerSqFt', 'salesVolume']) {
    try {
      console.log(`Comparing neighborhoods: ${neighborhoodIds.join(', ')}, metrics: ${metrics.join(', ')}`);

      // Verify all neighborhoods exist
      const neighborhoods = await Neighborhood.find({ _id: { $in: neighborhoodIds } });
      if (neighborhoods.length !== neighborhoodIds.length) {
        throw new Error('One or more neighborhoods not found');
      }

      const comparisons = [];

      for (const neighborhoodId of neighborhoodIds) {
        const neighborhood = neighborhoods.find(n => n._id.toString() === neighborhoodId);
        
        // Get properties in this neighborhood
        const properties = await Property.find({ neighborhoodId }).select('_id squareFootage');
        const propertyIds = properties.map(p => p._id);

        // Get recent transactions (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

        const transactions = await PropertyTransaction.find({
          propertyId: { $in: propertyIds },
          saleDate: { $gte: twelveMonthsAgo },
          transactionType: 'Sale'
        }).populate('propertyId', 'squareFootage');

        // Calculate metrics
        const prices = transactions.map(t => t.salePrice);
        const pricesPerSqFt = transactions
          .filter(t => t.pricePerSquareFoot && t.pricePerSquareFoot > 0)
          .map(t => t.pricePerSquareFoot);

        const neighborhoodMetrics = {
          neighborhoodId,
          name: neighborhood.name,
          metrics: {}
        };

        if (metrics.includes('averagePrice')) {
          neighborhoodMetrics.metrics.averagePrice = prices.length > 0 
            ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
            : 0;
        }

        if (metrics.includes('medianPrice')) {
          const sortedPrices = prices.sort((a, b) => a - b);
          const mid = Math.floor(sortedPrices.length / 2);
          neighborhoodMetrics.metrics.medianPrice = sortedPrices.length > 0
            ? sortedPrices.length % 2 === 0
              ? Math.round((sortedPrices[mid - 1] + sortedPrices[mid]) / 2)
              : sortedPrices[mid]
            : 0;
        }

        if (metrics.includes('pricePerSqFt')) {
          neighborhoodMetrics.metrics.pricePerSqFt = pricesPerSqFt.length > 0
            ? Math.round((pricesPerSqFt.reduce((sum, price) => sum + price, 0) / pricesPerSqFt.length) * 100) / 100
            : 0;
        }

        if (metrics.includes('salesVolume')) {
          neighborhoodMetrics.metrics.salesVolume = transactions.length;
        }

        if (metrics.includes('averageSize')) {
          const sizes = properties.map(p => p.squareFootage).filter(s => s > 0);
          neighborhoodMetrics.metrics.averageSize = sizes.length > 0
            ? Math.round(sizes.reduce((sum, size) => sum + size, 0) / sizes.length)
            : 0;
        }

        if (metrics.includes('amenityScore')) {
          neighborhoodMetrics.metrics.amenityScore = neighborhood.amenityScore || 0;
        }

        if (metrics.includes('transportScore')) {
          neighborhoodMetrics.metrics.transportScore = neighborhood.transportScore || 0;
        }

        comparisons.push(neighborhoodMetrics);
      }

      console.log(`Neighborhood comparison completed for ${neighborhoodIds.length} neighborhoods`);
      return {
        neighborhoods: comparisons,
        requestedMetrics: metrics,
        comparisonDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error comparing neighborhoods:', error);
      throw error;
    }
  }

  // Predict property value based on characteristics
  async predictPropertyValue(propertyData) {
    try {
      console.log('Predicting property value for:', JSON.stringify(propertyData, null, 2));

      const { 
        neighborhoodId, 
        type, 
        bedrooms, 
        bathrooms, 
        squareFootage, 
        yearBuilt, 
        condition = 'Good',
        amenities = []
      } = propertyData;

      // Verify neighborhood exists
      const neighborhood = await Neighborhood.findById(neighborhoodId);
      if (!neighborhood) {
        throw new Error('Neighborhood not found');
      }

      // Find comparable properties
      const comparableProperties = await Property.find({
        neighborhoodId,
        type,
        bedrooms: { $gte: bedrooms - 1, $lte: bedrooms + 1 },
        bathrooms: { $gte: bathrooms - 0.5, $lte: bathrooms + 0.5 },
        squareFootage: { $gte: squareFootage * 0.8, $lte: squareFootage * 1.2 }
      }).limit(10);

      // Get recent transactions for comparable properties
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const comparableTransactions = await PropertyTransaction.find({
        propertyId: { $in: comparableProperties.map(p => p._id) },
        saleDate: { $gte: sixMonthsAgo },
        transactionType: 'Sale'
      }).populate('propertyId');

      if (comparableTransactions.length === 0) {
        throw new Error('Insufficient comparable properties for prediction');
      }

      // Calculate base price from comparables
      const prices = comparableTransactions.map(t => t.salePrice);
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const pricePerSqFt = averagePrice / squareFootage;

      // Apply adjustments based on property characteristics
      let adjustedPrice = averagePrice;

      // Year built adjustment
      const currentYear = new Date().getFullYear();
      const age = currentYear - yearBuilt;
      if (age < 5) {
        adjustedPrice *= 1.1; // 10% premium for new construction
      } else if (age > 30) {
        adjustedPrice *= 0.95; // 5% discount for older properties
      }

      // Condition adjustment
      const conditionMultipliers = {
        'Excellent': 1.15,
        'Good': 1.0,
        'Fair': 0.9,
        'Poor': 0.8
      };
      adjustedPrice *= conditionMultipliers[condition] || 1.0;

      // Amenities adjustment
      const amenityValues = {
        'Pool': 0.05,
        'Garage': 0.03,
        'Garden': 0.02,
        'Balcony': 0.01,
        'Fireplace': 0.02,
        'AC': 0.02,
        'Heating': 0.01,
        'Parking': 0.03
      };

      let amenityBonus = 0;
      amenities.forEach(amenity => {
        amenityBonus += amenityValues[amenity] || 0;
      });
      adjustedPrice *= (1 + amenityBonus);

      // Calculate confidence score based on number of comparables and data quality
      let confidence = Math.min(0.95, 0.5 + (comparableTransactions.length * 0.05));
      
      // Reduce confidence if comparables are too different
      const sizeDifferences = comparableProperties.map(p => 
        Math.abs(p.squareFootage - squareFootage) / squareFootage
      );
      const avgSizeDifference = sizeDifferences.reduce((sum, diff) => sum + diff, 0) / sizeDifferences.length;
      if (avgSizeDifference > 0.2) {
        confidence *= 0.8;
      }

      const prediction = {
        predictedValue: Math.round(adjustedPrice),
        confidence: Math.round(confidence * 100) / 100,
        priceRange: {
          low: Math.round(adjustedPrice * 0.9),
          high: Math.round(adjustedPrice * 1.1)
        },
        pricePerSquareFoot: Math.round(pricePerSqFt * 100) / 100,
        comparableProperties: comparableProperties.map(p => ({
          id: p._id,
          address: p.address,
          type: p.type,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          squareFootage: p.squareFootage,
          currentValue: p.currentValue
        })),
        recentTransactions: comparableTransactions.map(t => ({
          salePrice: t.salePrice,
          saleDate: t.saleDate,
          daysOnMarket: t.daysOnMarket,
          property: {
            address: t.propertyId.address,
            squareFootage: t.propertyId.squareFootage
          }
        })),
        factors: {
          basePrice: Math.round(averagePrice),
          ageAdjustment: age < 5 ? '+10%' : age > 30 ? '-5%' : '0%',
          conditionAdjustment: `${Math.round((conditionMultipliers[condition] - 1) * 100)}%`,
          amenityAdjustment: `+${Math.round(amenityBonus * 100)}%`
        },
        neighborhood: {
          name: neighborhood.name,
          amenityScore: neighborhood.amenityScore,
          transportScore: neighborhood.transportScore
        }
      };

      console.log(`Property value prediction completed: $${prediction.predictedValue} with ${prediction.confidence} confidence`);
      return prediction;
    } catch (error) {
      console.error('Error predicting property value:', error);
      throw error;
    }
  }
}

module.exports = new PropertyAnalyticsService();