const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  boundaries: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true,
    },
    coordinates: {
      type: [[[Number]]], // GeoJSON Polygon format
      required: true,
    },
  },
  center: {
    type: [Number], // [lat, lng]
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: 'Center must be an array of exactly 2 numbers [lat, lng]'
    }
  },
  averageIncome: {
    type: Number,
    default: 0,
  },
  population: {
    type: Number,
    default: 0,
  },
  area: {
    type: Number, // in square kilometers
    default: 0,
  },
  amenityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  transportScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
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

// Add geospatial index for location queries
neighborhoodSchema.index({ boundaries: '2dsphere' });
neighborhoodSchema.index({ center: '2dsphere' });

neighborhoodSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

module.exports = Neighborhood;