const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
let mongoConnected = false;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/securechain-auditor', {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    mongoConnected = true;
    console.log('✓ MongoDB connected');
  })
  .catch(err => {
    mongoConnected = false;
    console.warn('⚠️  MongoDB connection failed. Using in-memory storage for demo.');
    console.warn('To use MongoDB, install it or use MongoDB Atlas.');
  });

// In-memory storage for demo (when MongoDB is not available)
const inMemoryUsers = new Map();
const inMemoryAudits = new Map();

// Export for use in routes
app.locals.mongoConnected = mongoConnected;
app.locals.inMemoryUsers = inMemoryUsers;
app.locals.inMemoryAudits = inMemoryAudits;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/audits', require('./routes/audits'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/user', require('./routes/user'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'SecureChain Auditor is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
