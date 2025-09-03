const mongoose = require('mongoose');

const propertyTransactionSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  saleDate: {
    type: Date,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['Sale', 'Rent', 'Lease'],
    default: 'Sale',
  },
  pricePerSquareFoot: {
    type: Number,
    min: 0,
  },
  daysOnMarket: {
    type: Number,
    min: 0,
    default: 0,
  },
  listingPrice: {
    type: Number,
    min: 0,
  },
  agentId: {
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

propertyTransactionSchema.index({ propertyId: 1 });
propertyTransactionSchema.index({ saleDate: -1 });
propertyTransactionSchema.index({ salePrice: 1 });
propertyTransactionSchema.index({ transactionType: 1 });

propertyTransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate price per square foot if not provided
  if (!this.pricePerSquareFoot && this.salePrice) {
    // We'll need to populate property data to calculate this
    // For now, we'll handle this in the service layer
  }
  
  next();
});

const PropertyTransaction = mongoose.model('PropertyTransaction', propertyTransactionSchema);

module.exports = PropertyTransaction;