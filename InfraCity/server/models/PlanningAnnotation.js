const mongoose = require('mongoose');

const planningAnnotationSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlanningSession',
    required: true
  },
  type: {
    type: String,
    enum: ['note', 'zebra', 'separator', 'beautification', 'garbage', 'signal', 'marker'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  position: {
    x: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    y: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  style: {
    color: {
      type: String,
      default: '#3B82F6'
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    icon: {
      type: String,
      default: '📍'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    version: {
      type: Number,
      default: 1
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
planningAnnotationSchema.index({ sessionId: 1 });
planningAnnotationSchema.index({ createdBy: 1 });
planningAnnotationSchema.index({ type: 1 });
planningAnnotationSchema.index({ createdAt: -1 });

// Compound index for session and position queries
planningAnnotationSchema.index({ sessionId: 1, 'position.x': 1, 'position.y': 1 });

module.exports = mongoose.model('PlanningAnnotation', planningAnnotationSchema);