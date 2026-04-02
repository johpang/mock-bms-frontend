/**
 * Habitational Bind API Service
 * Handles hab policy bind submission using JSON
 *
 * The frontend sends simplified JSON. The server transforms
 * to CSIO-compliant HomePolicyAddRq XML.
 */

import { getAuthHeaders } from './authService.js';
import config from '../config/index.js';

/**
 * Submits a hab bind request for a quoted habitational policy.
 * @param {Object} bindData - Bind request payload
 * @returns {Promise<Object>} The parsed bind response
 */
export async function submitHabBindRequest(bindData) {
  const headers = await getAuthHeaders();

  console.log('[HabBindService] Sending bind request to server:');
  console.log('[HabBindService] Endpoint:', config.api.habBindEndpoint);
  console.log('[HabBindService] Payload:', JSON.stringify(bindData, null, 2));

  const response = await fetch(config.api.habBindEndpoint, {
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
      throw new Error('Hab bind request rejected: invalid or missing quote number.');
    }
    if (status >= 500) {
      throw new Error('Server error during hab bind. Please try again.');
    }
    throw new Error(`Hab bind failed: ${response.statusText}`);
  }

  const data = await response.json();

  console.log('[HabBindService] Received response from server:');
  console.log('[HabBindService] Success:', data.success);
  console.log('[HabBindService] Policy Number:', data.policyNumber);

  return data;
}
