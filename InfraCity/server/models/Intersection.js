const mongoose = require('mongoose');

const intersectionSchema = new mongoose.Schema({
  name: {
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
  volume: {
    type: Number,
    required: true,
    min: 0,
  },
  avgSpeed: {
    type: Number,
    required: true,
    min: 0,
  },
  congestionLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Very High'],
  },
  trafficSignals: {
    type: Boolean,
    default: false,
  },
  pedestrianCrossings: {
    type: Number,
    default: 0,
  },
  peakHours: [{
    startTime: String,
    endTime: String,
    volume: Number,
  }],
  connectedRoads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Road',
  }],
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

intersectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Intersection = mongoose.model('Intersection', intersectionSchema);

module.exports = Intersection;