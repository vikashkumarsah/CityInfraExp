const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Pothole', 'Garbage', 'Road Marker', 'Traffic Flow', 'Beautification'],
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: 'Coordinates must be an array of exactly 2 numbers [lat, lng]'
    }
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Emergency'],
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  description: {
    type: String,
    trim: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  roadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Road',
  },
  images: [{
    url: String,
    timestamp: Date,
    vehicleId: String,
    confidenceScore: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
}, {
  versionKey: false,
});

issueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'Resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
  next();
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;