const express = require('express');
const cors = require('cors');
const path = require('path');
const serverConfig = require('./serverConfig');

const app = express();
const PORT = serverConfig.port;
const MODE = serverConfig.mode; // "mock" or "proxy"

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.text({ type: 'application/xml' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
if (MODE === 'proxy') {
  // PROXY MODE — forward requests to the real AWS API
  const proxyRoutes = require('./routes/proxyRoutes');
  app.use('/api', proxyRoutes);
  console.log('[Config] Route mode: PROXY  →  forwarding to', serverConfig.aws.baseUrl);
} else {
  // MOCK MODE — return mock data locally
  const autoQuoteRoutes = require('./routes/autoQuoteRoutes');
  const habQuoteRoutes = require('./routes/habQuoteRoutes');
  const commlQuoteRoutes = require('./routes/commlQuoteRoutes');
  app.use('/api', autoQuoteRoutes);
  app.use('/api/hab', habQuoteRoutes);
  app.use('/api/comml', commlQuoteRoutes);
  console.log('[Config] Route mode: MOCK  →  returning local mock data');
}

// OAuth token route (mock always available for local dev)
const oauthRoutes = require('./routes/oauthRoutes');
app.use('/oauth', oauthRoutes);

// ── Static React build (production) ─────────────────────────
// Serve the React build if it exists (Azure Web App deployment).
// In local dev, CRA's dev server handles this via the proxy setting.
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: MODE,
    message: `BMS API Server running in ${MODE} mode`,
  });
});

// SPA fallback — any route not matched above serves index.html
// so that client-side routing works after a page refresh.
app.get('*', (req, res, next) => {
  const indexPath = path.join(buildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next(); // fall through to 404 if build doesn't exist
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `No route found for ${req.method} ${req.path}`
  });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log(`  BMS API Server  |  port ${PORT}  |  mode: ${MODE}`);
  console.log('='.repeat(60));
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST /api/quote           - Auto quote request (JSON -> CSIO XML)');
  console.log('  POST /api/bind            - Auto bind request (JSON -> CSIO XML)');
  console.log('  POST /api/hab/quote       - Hab quote request (JSON -> CSIO XML)');
  console.log('  POST /api/hab/bind        - Hab bind request (JSON -> CSIO XML)');
  console.log('  POST /api/comml/quote     - Commercial quote request (JSON -> CSIO XML)');
  console.log('  POST /api/comml/bind      - Commercial bind request (JSON -> CSIO XML)');
  if (MODE === 'mock') {
    console.log('  POST /oauth/token         - Mock OAuth token');
  }
  console.log('  GET  /health              - Health check');
  console.log('');
  if (MODE === 'proxy') {
    console.log('Upstream API:', serverConfig.aws.baseUrl);
    console.log('OAuth token URL:', serverConfig.oauth.tokenUrl);
    console.log('');
  }
  console.log('CORS enabled for http://localhost:3000');
  console.log('Static build served from:', buildPath);
  console.log('');
});
