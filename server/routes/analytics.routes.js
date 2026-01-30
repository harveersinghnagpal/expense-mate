const express = require('express');
const router = express.Router();
const {
    getOverview,
    getCategoryBreakdown,
    getInsights
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/overview', protect, getOverview);
router.get('/category-breakdown', protect, getCategoryBreakdown);
router.get('/insights', protect, getInsights);

module.exports = router;
