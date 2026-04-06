/**
 * Commercial Lines Bind API Service
 * Handles commercial policy bind submission using JSON
 *
 * The frontend sends simplified JSON. The server transforms
 * to CSIO-compliant CommlPkgPolicyAddRq XML.
 */

import { getAuthHeaders } from './authService.js';
import config from '../config/index.js';

/**
 * Submits a commercial bind request for a quoted policy.
 * @param {Object} bindData - Bind request payload
 * @returns {Promise<Object>} The parsed bind response
 */
export async function submitCommlBindRequest(bindData) {
  const headers = await getAuthHeaders();

  console.log('[CommlBindService] Sending bind request to server:');
  console.log('[CommlBindService] Endpoint:', config.api.commlBindEndpoint);
  console.log('[CommlBindService] Payload:', JSON.stringify(bindData, null, 2));

  const response = await fetch(config.api.commlBindEndpoint, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bindData),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 400) {
      throw new Error('Commercial bind request rejected: invalid or missing quote number.');
    }
    if (status >= 500) {
      throw new Error('Server error during commercial bind. Please try again.');
    }
    throw new Error(`Commercial bind failed: ${response.statusText}`);
  }

  const data = await response.json();

  console.log('[CommlBindService] Received response from server:');
  console.log('[CommlBindService] Success:', data.success);
  console.log('[CommlBindService] Policy Number:', data.policyNumber);

  return data;
}
