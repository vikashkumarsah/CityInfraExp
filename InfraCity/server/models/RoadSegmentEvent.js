const mongoose = require('mongoose');

const roadSegmentEventSchema = new mongoose.Schema({
  roadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Road',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Pothole Repair', 'Road Marking', 'Inspection', 'Cleaning', 'Maintenance', 'Construction'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium',
  },
  date: {
    type: Date,
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

roadSegmentEventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const RoadSegmentEvent = mongoose.model('RoadSegmentEvent', roadSegmentEventSchema);

module.exports = RoadSegmentEvent;