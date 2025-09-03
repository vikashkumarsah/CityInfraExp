const mongoose = require('mongoose');

const roadSegmentImageSchema = new mongoose.Schema({
  roadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Road',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Pothole', 'Road Marking', 'Surface Crack', 'Debris', 'General Condition'],
  },
  dateTaken: {
    type: Date,
    required: true,
  },
  vehicleId: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5,
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

roadSegmentImageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const RoadSegmentImage = mongoose.model('RoadSegmentImage', roadSegmentImageSchema);

module.exports = RoadSegmentImage;