/**
 * Application configuration
 * Reads from environment variables
 */

const config = Object.freeze({
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || '/api',
    quoteEndpoint: (process.env.REACT_APP_API_BASE_URL || '/api') + '/quote',
  },
  oauth: {
    tokenUrl: process.env.REACT_APP_OAUTH_TOKEN_URL || '/oauth/token',
    clientId: process.env.REACT_APP_OAUTH_CLIENT_ID || 'bms-demo-client',
    clientSecret: process.env.REACT_APP_OAUTH_CLIENT_SECRET || 'bms-demo-secret',
    grantType: process.env.REACT_APP_OAUTH_GRANT_TYPE || 'client_credentials',
    scope: process.env.REACT_APP_OAUTH_SCOPE || 'quote:read quote:write',
  },
});

export default config;
