const mongoose = require('mongoose');

const planningSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  planningMode: {
    type: Boolean,
    default: false
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowComments: {
      type: Boolean,
      default: true
    },
    gridSize: {
      type: Number,
      default: 20
    }
  },
  metadata: {
    totalAnnotations: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    version: {
      type: Number,
      default: 1
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
planningSessionSchema.index({ createdBy: 1 });
planningSessionSchema.index({ status: 1 });
planningSessionSchema.index({ 'collaborators.userId': 1 });
planningSessionSchema.index({ createdAt: -1 });

// Update lastActivity on save
planningSessionSchema.pre('save', function(next) {
  this.metadata.lastActivity = new Date();
  next();
});

// Virtual for checking if user has access
planningSessionSchema.methods.hasAccess = function(userId) {
  if (this.createdBy.toString() === userId.toString()) {
    return true;
  }
  return this.collaborators.some(collab => collab.userId.toString() === userId.toString());
};

// Virtual for getting user role
planningSessionSchema.methods.getUserRole = function(userId) {
  if (this.createdBy.toString() === userId.toString()) {
    return 'admin';
  }
  const collaborator = this.collaborators.find(collab => collab.userId.toString() === userId.toString());
  return collaborator ? collaborator.role : null;
};

module.exports = mongoose.model('PlanningSession', planningSessionSchema);