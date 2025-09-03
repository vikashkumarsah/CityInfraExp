const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['comprehensive', 'performance', 'budget', 'public'],
    default: 'comprehensive'
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'draft', 'published'],
    default: 'generating'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parameters: {
    period: {
      startDate: Date,
      endDate: Date,
      preset: String // 'today', 'week', 'month', 'quarter', 'year', 'custom'
    },
    metrics: [{
      type: String,
      enum: ['issues', 'performance', 'budget', 'traffic', 'maintenance', 'citizen']
    }],
    filters: {
      neighborhoods: [String],
      issueTypes: [String],
      priorities: [String]
    },
    format: {
      type: String,
      enum: ['pdf', 'excel', 'json'],
      default: 'pdf'
    }
  },
  data: {
    summary: mongoose.Schema.Types.Mixed,
    charts: mongoose.Schema.Types.Mixed,
    tables: mongoose.Schema.Types.Mixed,
    insights: [String]
  },
  metadata: {
    generationTime: Number, // in milliseconds
    dataPoints: Number,
    fileSize: Number, // in bytes
    downloadCount: {
      type: Number,
      default: 0
    },
    lastAccessed: Date
  },
  sharing: {
    isPublic: {
      type: Boolean,
      default: false
    },
    shareToken: String,
    sharedWith: [{
      email: String,
      permission: {
        type: String,
        enum: ['view', 'download'],
        default: 'view'
      }
    }]
  }
}, {
  timestamps: true
});

// Index for efficient queries
reportSchema.index({ createdBy: 1, createdAt: -1 });
reportSchema.index({ type: 1, status: 1 });
reportSchema.index({ 'sharing.shareToken': 1 });

// Virtual for report age
reportSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Method to increment download count
reportSchema.methods.incrementDownload = function() {
  this.metadata.downloadCount += 1;
  this.metadata.lastAccessed = new Date();
  return this.save();
};

// Method to generate share token
reportSchema.methods.generateShareToken = function() {
  const crypto = require('crypto');
  this.sharing.shareToken = crypto.randomBytes(32).toString('hex');
  return this.save();
};

// Static method to get reports by type
reportSchema.statics.getByType = function(type, userId = null) {
  const query = { type, status: { $in: ['completed', 'published'] } };
  if (userId) {
    query.createdBy = userId;
  }
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get dashboard summary
reportSchema.statics.getDashboardSummary = function(userId = null) {
  const matchStage = userId ? { createdBy: mongoose.Types.ObjectId(userId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalReports: { $sum: 1 },
        completedReports: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        publishedReports: {
          $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
        },
        totalDownloads: { $sum: '$metadata.downloadCount' },
        typeBreakdown: {
          $push: {
            type: '$type',
            count: 1
          }
        },
        recentReports: {
          $push: {
            $cond: [
              { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
              {
                _id: '$_id',
                title: '$title',
                type: '$type',
                status: '$status',
                createdAt: '$createdAt'
              },
              null
            ]
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Report', reportSchema);