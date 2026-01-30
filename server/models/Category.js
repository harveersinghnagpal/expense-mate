const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#ffffff',
  },
  icon: {
    type: String,
    default: 'circle',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Category', CategorySchema);
