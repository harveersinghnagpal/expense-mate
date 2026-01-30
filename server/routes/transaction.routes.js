const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
