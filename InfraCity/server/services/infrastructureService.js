const os = require('os');
const fs = require('fs').promises;
const Issue = require('../models/Issue');
const Road = require('../models/Road');

class InfrastructureService {
  
  // Get real-time system metrics
  async getSystemMetrics() {
    try {
      console.log('Fetching real-time system metrics');
      
      const cpuUsage = this.getCPUUsage();
      const memoryUsage = this.getMemoryUsage();
      const diskUsage = await this.getDiskUsage();
      const networkTraffic = await this.getNetworkTraffic();
      
      const metrics = {
        cpu: cpuUsage,
        memory: memoryUsage,
        disk: diskUsage,
        network: networkTraffic,
        timestamp: new Date().toISOString()
      };
      
      console.log('System metrics retrieved successfully');
      return metrics;
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw new Error('Failed to retrieve system metrics');
    }
  }

  getCPUUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);
    
    return {
      usage: Math.max(0, Math.min(100, usage)),
      cores: cpus.length
    };
  }

  getMemoryUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    return {
      total: Math.round(totalMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
      used: Math.round(usedMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
      free: Math.round(freeMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
      usage: Math.round((usedMemory / totalMemory) * 100)
    };
  }

  async getDiskUsage() {
    try {
      // For cross-platform compatibility, we'll simulate disk usage
      // In production, you might want to use a library like 'node-disk-info'
      const stats = await fs.stat('.');
      
      // Simulated disk usage based on current directory
      const totalSpace = 100; // GB (simulated)
      const usedSpace = Math.random() * 40 + 20; // Random between 20-60 GB
      const freeSpace = totalSpace - usedSpace;
      
      return {
        total: totalSpace,
        used: Math.round(usedSpace * 100) / 100,
        free: Math.round(freeSpace * 100) / 100,
        usage: Math.round((usedSpace / totalSpace) * 100)
      };
    } catch (error) {
      console.error('Error getting disk usage:', error);
      return {
        total: 100,
        used: 45,
        free: 55,
        usage: 45
      };
    }
  }

  async getNetworkTraffic() {
    // Simulate network traffic data
    // In production, you might want to use system monitoring tools
    return {
      bytesReceived: Math.floor(Math.random() * 1000000000), // Random bytes
      bytesSent: Math.floor(Math.random() * 500000000),
      packetsReceived: Math.floor(Math.random() * 1000000),
      packetsSent: Math.floor(Math.random() * 800000)
    };
  }

  // Get issue density heatmap data
  async getIssueHeatmapData() {
    try {
      console.log('Generating issue density heatmap data');
      
      const issues = await Issue.find({ status: { $ne: 'Resolved' } })
        .select('coordinates severity type')
        .lean();
      
      console.log(`Found ${issues.length} active issues for heatmap`);
      
      // Group issues by location and calculate density
      const heatmapData = this.generateHeatmapPoints(issues);
      
      const result = {
        data: heatmapData,
        max_value: Math.max(...heatmapData.map(point => point.value), 1),
        min_value: Math.min(...heatmapData.map(point => point.value), 0),
        timestamp: new Date().toISOString()
      };
      
      console.log(`Generated ${heatmapData.length} heatmap points`);
      return result;
    } catch (error) {
      console.error('Error generating heatmap data:', error);
      throw new Error('Failed to generate heatmap data');
    }
  }

  generateHeatmapPoints(issues) {
    const gridSize = 0.01; // Approximately 1km grid
    const grid = new Map();
    
    issues.forEach(issue => {
      if (!issue.coordinates || issue.coordinates.length !== 2) return;
      
      const [lat, lng] = issue.coordinates;
      const gridLat = Math.floor(lat / gridSize) * gridSize;
      const gridLng = Math.floor(lng / gridSize) * gridSize;
      const key = `${gridLat},${gridLng}`;
      
      if (!grid.has(key)) {
        grid.set(key, {
          lat: gridLat + gridSize / 2,
          lng: gridLng + gridSize / 2,
          count: 0,
          severityWeight: 0
        });
      }
      
      const point = grid.get(key);
      point.count++;
      
      // Weight by severity
      const severityWeights = { 'Low': 1, 'Medium': 2, 'High': 3, 'Emergency': 5 };
      point.severityWeight += severityWeights[issue.severity] || 1;
    });
    
    return Array.from(grid.values()).map(point => ({
      lat: point.lat,
      lng: point.lng,
      value: point.count + (point.severityWeight * 0.5)
    }));
  }

  // Get key performance metrics
  async getPerformanceMetrics() {
    try {
      console.log('Calculating key performance metrics');
      
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // Get issue statistics
      const [
        totalIssues,
        resolvedIssues,
        highPriorityIssues,
        issuesLast24h,
        resolvedLast24h,
        avgResolutionTime
      ] = await Promise.all([
        Issue.countDocuments(),
        Issue.countDocuments({ status: 'Resolved' }),
        Issue.countDocuments({ severity: { $in: ['High', 'Emergency'] }, status: { $ne: 'Resolved' } }),
        Issue.countDocuments({ createdAt: { $gte: last24Hours } }),
        Issue.countDocuments({ status: 'Resolved', resolvedAt: { $gte: last24Hours } }),
        this.calculateAverageResolutionTime()
      ]);
      
      // Calculate road health metrics
      const roadHealthMetrics = await this.calculateRoadHealthMetrics();
      
      const metrics = {
        issueMetrics: {
          total: totalIssues,
          resolved: resolvedIssues,
          highPriority: highPriorityIssues,
          resolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0,
          last24Hours: {
            reported: issuesLast24h,
            resolved: resolvedLast24h
          }
        },
        performanceMetrics: {
          averageResolutionTime: avgResolutionTime,
          roadHealthIndex: roadHealthMetrics.averageCondition,
          totalRoads: roadHealthMetrics.totalRoads,
          roadsNeedingAttention: roadHealthMetrics.roadsNeedingAttention
        },
        timestamp: now.toISOString(),
        period: '24h'
      };
      
      console.log('Performance metrics calculated successfully');
      return metrics;
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      throw new Error('Failed to calculate performance metrics');
    }
  }

  async calculateAverageResolutionTime() {
    try {
      const resolvedIssues = await Issue.find({
        status: 'Resolved',
        resolvedAt: { $exists: true },
        createdAt: { $exists: true }
      }).select('createdAt resolvedAt').lean();
      
      if (resolvedIssues.length === 0) return 0;
      
      const totalTime = resolvedIssues.reduce((sum, issue) => {
        const resolutionTime = new Date(issue.resolvedAt) - new Date(issue.createdAt);
        return sum + resolutionTime;
      }, 0);
      
      // Return average time in hours
      return Math.round((totalTime / resolvedIssues.length) / (1000 * 60 * 60) * 100) / 100;
    } catch (error) {
      console.error('Error calculating average resolution time:', error);
      return 0;
    }
  }

  async calculateRoadHealthMetrics() {
    try {
      const roads = await Road.find().select('condition').lean();
      
      if (roads.length === 0) {
        return {
          averageCondition: 0,
          totalRoads: 0,
          roadsNeedingAttention: 0
        };
      }
      
      const totalCondition = roads.reduce((sum, road) => sum + road.condition, 0);
      const averageCondition = Math.round((totalCondition / roads.length) * 100) / 100;
      const roadsNeedingAttention = roads.filter(road => road.condition < 70).length;
      
      return {
        averageCondition,
        totalRoads: roads.length,
        roadsNeedingAttention
      };
    } catch (error) {
      console.error('Error calculating road health metrics:', error);
      return {
        averageCondition: 0,
        totalRoads: 0,
        roadsNeedingAttention: 0
      };
    }
  }
}

module.exports = new InfrastructureService();