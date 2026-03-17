require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./config/passport');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/auth', limiter);
app.use('/chat', limiter);

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/transactions', require('./routes/transaction.routes'));
app.use('/categories', require('./routes/category.routes'));
app.use('/budgets', require('./routes/budget.routes'));
app.use('/analytics', require('./routes/analytics.routes'));
app.use('/chat', require('./routes/chat.routes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Create Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
