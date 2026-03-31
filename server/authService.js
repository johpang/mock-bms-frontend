/**
 * Server-Side OAuth2 Authentication Service
 *
 * Handles the client credentials flow against the real OAuth provider.
 * Caches the token in memory and refreshes it before expiry.
 *
 * Environment variables consumed (via serverConfig):
 *   OAUTH_TOKEN_URL   – token endpoint (e.g. https://xxx.auth.region.amazoncognito.com/oauth2/token)
 *   OAUTH_CLIENT_ID   – client ID issued by the OAuth provider
 *   OAUTH_CLIENT_SECRET – client secret
 *   OAUTH_SCOPE        – space-separated scopes (optional)
 */

const serverConfig = require('./serverConfig');

/** In-memory token cache */
let tokenCache = {
  accessToken: null,
  expiresAt: null,
};

/**
 * Fetches a new access token from the OAuth provider.
 * @returns {Promise<{access_token: string, expires_in: number}>}
 */
async function fetchNewToken() {
  const { tokenUrl, clientId, clientSecret, scope } = serverConfig.oauth;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  if (scope) params.append('scope', scope);

  console.log('[Auth] Requesting new token from', tokenUrl);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  console.log('[Auth] Token acquired, expires in', data.expires_in, 'seconds');
  return data;
}

/**
 * Returns a valid access token, using the cache when possible.
 * Refreshes 60 seconds before the token expires.
 * @returns {Promise<string>} Bearer access token
 */
async function getAccessToken() {
  const now = Date.now();
  const bufferMs = 60 * 1000;

  if (tokenCache.accessToken && tokenCache.expiresAt && now + bufferMs < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  const data = await fetchNewToken();
  tokenCache.accessToken = data.access_token;
  tokenCache.expiresAt = now + (data.expires_in || 3600) * 1000;

  return tokenCache.accessToken;
}

/**
 * Builds authorization headers for outbound API calls.
 * @returns {Promise<Object>} Headers with Authorization and Content-Type
 */
async function getAuthHeaders() {
  const token = await getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/xml',
    Accept: 'application/xml',
  };
}

module.exports = { getAccessToken, getAuthHeaders };
