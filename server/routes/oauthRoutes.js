const express = require('express');
const router = express.Router();

// POST /oauth/token endpoint
router.post('/token', (req, res) => {
  try {
    const { client_id, client_secret, grant_type } = req.body;

    console.log('[OAuth Token Request]');
    console.log('  Timestamp:', new Date().toISOString());
    console.log('  Grant Type:', grant_type);
    console.log('  Client ID:', client_id);

    // For the mock: always return success
    const accessToken = 'mock-jwt-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    const response = {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'quote:read quote:write'
    };

    console.log('[OAuth Token Response]');
    console.log('  Status: Success');
    console.log('  Token Type:', response.token_type);
    console.log('  Expires In:', response.expires_in, 'seconds');
    console.log('  Scope:', response.scope);
    console.log('');

    res.json(response);
  } catch (error) {
    console.error('[OAuth Token Error]', error);
    res.status(500).json({
      error: 'server_error',
      error_description: error.message
    });
  }
});

module.exports = router;
