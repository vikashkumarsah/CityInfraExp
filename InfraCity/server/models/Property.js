const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    type: [Number], // [lat, lng]
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: 'Coordinates must be an array of exactly 2 numbers [lat, lng]'
    }
  },
  neighborhoodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Neighborhood',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial'],
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 0,
  },
  bathrooms: {
    type: Number,
    min: 0,
    default: 0,
  },
  squareFootage: {
    type: Number,
    min: 0,
    required: true,
  },
  lotSize: {
    type: Number,
    min: 0,
    default: 0,
  },
  yearBuilt: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear() + 5,
  },
  currentValue: {
    type: Number,
    min: 0,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  amenities: [{
    type: String,
    enum: ['Pool', 'Garage', 'Garden', 'Balcony', 'Fireplace', 'AC', 'Heating', 'Parking'],
  }],
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good',
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
propertySchema.index({ coordinates: '2dsphere' });
propertySchema.index({ neighborhoodId: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ currentValue: 1 });

propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;