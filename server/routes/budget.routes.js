const express = require('express');
const router = express.Router();
const {
  getBudgets,
  setBudget,
  updateBudget,
  deleteBudget
} = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(protect, getBudgets)
  .post(protect, setBudget);

router.route('/:id')
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

module.exports = router;
