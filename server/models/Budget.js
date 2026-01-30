const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  limitAmount: {
    type: Number,
    required: true,
  },
});

BudgetSchema.index({ userId: 1, month: 1, year: 1 });

module.exports = mongoose.model('Budget', BudgetSchema);
