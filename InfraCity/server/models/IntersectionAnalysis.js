const mongoose = require('mongoose');

const intersectionAnalysisSchema = new mongoose.Schema({
  intersectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Intersection',
    required: true,
  },
  analysisDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  trafficVolume: {
    hourlyData: [{
      hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23,
      },
      volume: {
        type: Number,
        required: true,
        min: 0,
      },
      direction: {
        type: String,
        required: true,
        enum: ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'],
      },
    }],
    totalDailyVolume: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  peakHours: [{
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    peakVolume: {
      type: Number,
      required: true,
      min: 0,
    },
    congestionLevel: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Very High'],
    },
  }],
  averageSpeed: {
    byDirection: [{
      direction: {
        type: String,
        required: true,
        enum: ['North', 'South', 'East', 'West'],
      },
      speed: {
        type: Number,
        required: true,
        min: 0,
      },
    }],
    overall: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  congestionLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Very High'],
  },
  pedestrianData: {
    totalCrossings: {
      type: Number,
      default: 0,
      min: 0,
    },
    peakCrossingHours: [{
      hour: {
        type: Number,
        min: 0,
        max: 23,
      },
      crossings: {
        type: Number,
        min: 0,
      },
    }],
  },
  weatherConditions: {
    type: String,
    enum: ['Clear', 'Rainy', 'Snowy', 'Foggy', 'Cloudy'],
    default: 'Clear',
  },
  analysisNotes: {
    type: String,
    maxlength: 1000,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

intersectionAnalysisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
intersectionAnalysisSchema.index({ intersectionId: 1, analysisDate: -1 });
intersectionAnalysisSchema.index({ congestionLevel: 1 });
intersectionAnalysisSchema.index({ createdAt: -1 });

const IntersectionAnalysis = mongoose.model('IntersectionAnalysis', intersectionAnalysisSchema);

module.exports = IntersectionAnalysis;