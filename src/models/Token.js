// models/Token.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 30 * 86400 // 30 days
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
tokenSchema.index({ user: 1, token: 1 });
tokenSchema.index({ refreshToken: 1 });

module.exports = mongoose.model('Token', tokenSchema);