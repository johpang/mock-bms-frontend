/**
 * Application configuration
 * Reads from environment variables
 */

// Producer code that triggers a hardcoded "quote failed" response across all
// lines of business. When the user enters this exact value on the quote form,
// no requests are sent and the comparison page shows a failure banner.
export const INVALID_PRODUCER_CODE = '000-00';
export const INVALID_PRODUCER_CODE_MESSAGE = 'Account: The broker code supplied (000-00) for this user is incorrect. Please contact your Office Administrator or Broker Help for assistance.';

// Producer code that allows the user to quote and select an insurer normally,
// but blocks the bind step. Clicking "Proceed to Bind" on the Premium
// Breakdown page surfaces a red banner instead of advancing to the Bind page.
export const ADDITIONAL_INFO_PRODUCER_CODE = '111-11';
export const ADDITIONAL_INFO_BIND_MESSAGE = 'Bind Unsuccessful. Additional Information is required.';

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
