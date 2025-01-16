const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Please provide an invoice number'],
    unique: true,
    trim: true
  },
  clientName: {
    type: String,
    required: [true, 'Please provide a client name'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    required: true,
    enum: ['paid', 'unpaid', 'pending'],
    default: 'pending'
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add index for better query performance
invoiceSchema.index({ user: 1, invoiceNumber: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);