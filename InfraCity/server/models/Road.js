const mongoose = require('mongoose');

const roadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  condition: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  issues: {
    type: Number,
    default: 0,
  },
  lastInspection: {
    type: Date,
    required: true,
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
  width: {
    type: Number,
    required: true,
  },
  lanes: {
    type: Number,
    required: true,
  },
  classification: {
    type: String,
    enum: ['highway', 'arterial', 'collector', 'local'],
    default: 'local',
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

roadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Road = mongoose.model('Road', roadSchema);

module.exports = Road;