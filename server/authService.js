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
 * Uses HTTP Basic auth (base64-encoded client_id:client_secret)
 * per the CSIO gateway specification.
 * @returns {Promise<{access_token: string, expires_in: number}>}
 */
async function fetchNewToken() {
  const { tokenUrl, clientId, clientSecret, scope } = serverConfig.oauth;

  // CSIO gateway expects Basic auth: base64(client_id:client_secret)
  const basicCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  if (scope) params.append('scope', scope);

  console.log('');
  console.log('[Auth] >>> TOKEN REQUEST');
  console.log(`[Auth]     URL:       ${tokenUrl}`);
  console.log(`[Auth]     Client ID: ${clientId}`);
  console.log(`[Auth]     Scope:     ${scope || '(none)'}`);
  console.log(`[Auth]     Body:      ${params.toString()}`);

  const startTime = Date.now();

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicCredentials}`,
    },
    body: params.toString(),
  });

  const elapsed = Date.now() - startTime;
  const rawBody = await response.text();

  console.log(`[Auth] <<< TOKEN RESPONSE`);
  console.log(`[Auth]     Status:  ${response.status} ${response.statusText}`);
  console.log(`[Auth]     Elapsed: ${elapsed}ms`);
  console.log(`[Auth]     Headers:`);
  response.headers.forEach((value, key) => {
    console.log(`[Auth]       ${key}: ${value}`);
  });

  if (!response.ok) {
    console.log(`[Auth]     Body: ${rawBody}`);
    throw new Error(`Token request failed (${response.status}): ${rawBody}`);
  }

  const data = JSON.parse(rawBody);
  const tokenPreview = data.access_token
    ? `${data.access_token.substring(0, 20)}...${data.access_token.substring(data.access_token.length - 10)}`
    : '(missing)';
  console.log(`[Auth]     Token:      ${tokenPreview}`);
  console.log(`[Auth]     Type:       ${data.token_type || '(none)'}`);
  console.log(`[Auth]     Expires in: ${data.expires_in || '(unknown)'}s`);
  console.log('');
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
    const remainingSec = Math.round((tokenCache.expiresAt - now) / 1000);
    console.log(`[Auth] Using cached token (expires in ${remainingSec}s)`);
    return tokenCache.accessToken;
  }
  console.log('[Auth] Token cache miss or expired — fetching new token');

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
