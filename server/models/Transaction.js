const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
  paymentMode: {
    type: String,
    default: 'cash',
  },
  note: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, { timestamps: true });

// Compound index for frequent queries
TransactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
