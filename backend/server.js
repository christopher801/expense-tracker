const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Import database inisyalizasyon
const initializeDatabase = require('./config/initDB');
const pool = require('./config/db');

// Initialize express
const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Expense Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT 1 + 1 AS solution');
    res.json({ 
      status: 'success',
      database: 'connected', 
      solution: result[0].solution,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      database: 'disconnected', 
      message: error.message 
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Fonksyon pou kòmanse sèvè a
async function startServer() {
  try {
    // Inisyalize database
    console.log('🔄 Ap inisyalize database...');
    await initializeDatabase();
    
    // Kòmanse sèvè a
    app.listen(PORT, () => {
      console.log(`🚀 Server kouri sou pò ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      
      if (process.env.DATABASE_URL) {
        const url = new URL(process.env.DATABASE_URL);
        console.log(`💾 Database: ${url.hostname}:${url.port}/${url.pathname.substring(1)}`);
      }
    });
  } catch (error) {
    console.error('❌ Pa kapab kòmanse sèvè a:', error);
    process.exit(1);
  }
}

// Kòmanse sèvè a
startServer();