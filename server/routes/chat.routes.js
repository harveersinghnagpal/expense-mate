const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, getChatResponse);

module.exports = router;
