const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/transactions', require('./routes/transaction.routes'));
app.use('/categories', require('./routes/category.routes'));
app.use('/budgets', require('./routes/budget.routes'));
app.use('/analytics', require('./routes/analytics.routes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Create Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
