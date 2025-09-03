const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    required: true,
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  coordinates: {
    type: [Number],
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: 'Coordinates must be an array of exactly 2 numbers [lat, lng]'
    }
  },
  issueType: {
    type: String,
    enum: ['Pothole', 'Garbage', 'Road Marker', 'Traffic Flow', 'Beautification'],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 60,
  },
  actualDuration: {
    type: Number, // in minutes
  },
  completedAt: {
    type: Date,
  },
  notes: {
    type: String,
    trim: true,
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

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;