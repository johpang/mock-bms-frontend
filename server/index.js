const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const quoteRoutes = require('./routes/quoteRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

app.use('/api', quoteRoutes);
app.use('/oauth', oauthRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'BMS Mock API Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `No route found for ${req.method} ${req.path}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('BMS Mock API Server running on port', PORT);
  console.log('='.repeat(60));
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST /api/quote           - Request insurance quotes');
  console.log('  POST /oauth/token         - Get OAuth token');
  console.log('  GET  /health              - Health check');
  console.log('');
  console.log('CORS enabled for http://localhost:3000');
  console.log('');
});
