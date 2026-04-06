/**
 * Application configuration
 * Reads from environment variables
 */

const config = Object.freeze({
  /** When true, the app skips all API calls and uses hardcoded mock responses */
  mockMode: process.env.REACT_APP_MOCK_MODE === 'true',
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || '/api',
    quoteEndpoint: (process.env.REACT_APP_API_BASE_URL || '/api') + '/quote',
    bindEndpoint: (process.env.REACT_APP_API_BASE_URL || '/api') + '/bind',
    habQuoteEndpoint: (process.env.REACT_APP_API_BASE_URL || '/api') + '/hab/quote',
    habBindEndpoint: (process.env.REACT_APP_API_BASE_URL || '/api') + '/hab/bind',
    commlQuoteEndpoint: (process.env.REACT_APP_API_BASE_URL || '/api') + '/comml/quote',
    commlBindEndpoint: (process.env.REACT_APP_API_BASE_URL || '/api') + '/comml/bind',
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
