const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const { httpLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Logging
app.use(httpLogger);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

module.exports = app;
