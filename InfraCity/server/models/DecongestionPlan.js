const mongoose = require('mongoose');

const decongestionPlanSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  intersectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Intersection',
    required: true,
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IntersectionAnalysis',
    required: true,
  },
  currentCongestionLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Very High'],
  },
  targetCongestionLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Very High'],
  },
  proposedActions: [{
    actionType: {
      type: String,
      required: true,
      enum: ['Traffic Signal Optimization', 'Lane Reconfiguration', 'Zebra Crossing Addition', 'Road Marking Update', 'Speed Limit Change', 'Turn Restriction', 'Roundabout Installation', 'Traffic Light Installation'],
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    estimatedCost: {
      type: Number,
      min: 0,
    },
    estimatedDuration: {
      type: Number, // in days
      min: 1,
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: function(v) {
          return v.length === 2;
        },
        message: 'Coordinates must be an array of exactly 2 numbers [lat, lng]'
      }
    },
  }],
  expectedImpact: {
    trafficFlowImprovement: {
      type: Number, // percentage
      min: 0,
      max: 100,
    },
    timeSavings: {
      type: Number, // minutes per trip
      min: 0,
    },
    safetyImprovement: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
    },
    environmentalImpact: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
    },
  },
  implementation: {
    status: {
      type: String,
      required: true,
      enum: ['Draft', 'Under Review', 'Approved', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Draft',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    assignedTeam: {
      type: String,
      maxlength: 200,
    },
    budget: {
      allocated: {
        type: Number,
        min: 0,
      },
      spent: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
  },
  publicFeedback: [{
    comment: {
      type: String,
      maxlength: 500,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }],
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

decongestionPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
decongestionPlanSchema.index({ intersectionId: 1 });
decongestionPlanSchema.index({ 'implementation.status': 1 });
decongestionPlanSchema.index({ createdAt: -1 });
decongestionPlanSchema.index({ currentCongestionLevel: 1 });

const DecongestionPlan = mongoose.model('DecongestionPlan', decongestionPlanSchema);

module.exports = DecongestionPlan;