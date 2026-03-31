/**
 * Server Configuration
 *
 * Centralises all environment-driven settings for the Express server.
 * Values can be set via OS environment variables or a .env file loaded
 * before the process starts.
 *
 * ───────────────────────────────────────────────────────────
 *  Variable              Default                 Notes
 * ───────────────────────────────────────────────────────────
 *  SERVER_MODE           mock                    "mock" | "proxy"
 *  PORT                  4000                    Listening port
 *
 *  -- AWS / upstream API (proxy mode only) --
 *  AWS_API_BASE_URL      (none)                  e.g. https://api.example.com
 *  AWS_QUOTE_PATH        /quote                  Appended to base URL
 *  AWS_BIND_PATH         /bind                   Appended to base URL
 *
 *  -- OAuth (proxy mode only) --
 *  OAUTH_TOKEN_URL       (none)                  Token endpoint URL
 *  OAUTH_CLIENT_ID       (none)
 *  OAUTH_CLIENT_SECRET   (none)
 *  OAUTH_SCOPE           (empty)
 * ───────────────────────────────────────────────────────────
 */

const config = {
  /** "mock" = return mock data (no outbound calls).  "proxy" = forward to AWS. */
  mode: process.env.SERVER_MODE || 'mock',

  /** Port the Express server listens on */
  port: parseInt(process.env.PORT, 10) || 4000,

  /** Upstream AWS API settings (used only in proxy mode) */
  aws: {
    baseUrl: process.env.AWS_API_BASE_URL || '',
    quotePath: process.env.AWS_QUOTE_PATH || '/quote',
    bindPath: process.env.AWS_BIND_PATH || '/bind',
  },

  /** OAuth2 client-credentials settings (used only in proxy mode) */
  oauth: {
    tokenUrl: process.env.OAUTH_TOKEN_URL || '',
    clientId: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
    scope: process.env.OAUTH_SCOPE || '',
  },
};

module.exports = config;
