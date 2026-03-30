/**
 * OAuth2 Authentication Service
 * Handles client credentials flow and token management
 */

import config from '../config/index.js';

/**
 * Token cache object
 * @type {Object}
 */
let tokenCache = {
  accessToken: null,
  expiresAt: null,
};

/**
 * Fetches a new access token using OAuth2 client credentials flow
 * @returns {Promise<string>} The access token
 */
async function fetchNewToken() {
  const params = new URLSearchParams();
  params.append('client_id', config.oauth.clientId);
  params.append('client_secret', config.oauth.clientSecret);
  params.append('grant_type', 'client_credentials');
  params.append('scope', config.oauth.scope);

  const response = await fetch(config.oauth.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Gets a valid access token, using cache if available and not expired
 * Includes 60-second buffer before token expiration
 * @returns {Promise<string>} The access token
 */
export async function getAccessToken() {
  const now = Date.now();
  const bufferMs = 60 * 1000; // 60 seconds

  // Check if cached token is still valid
  if (tokenCache.accessToken && tokenCache.expiresAt && now + bufferMs < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  // Fetch new token
  const accessToken = await fetchNewToken();

  // Cache the token (assume 1 hour expiry if not provided)
  tokenCache.accessToken = accessToken;
  tokenCache.expiresAt = now + (3600 * 1000);

  return accessToken;
}

/**
 * Gets authorization headers with Bearer token
 * @returns {Promise<Object>} Headers object with Authorization and Content-Type
 */
export async function getAuthHeaders() {
  const token = await getAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}
