/**
 * Bind API Service
 * Handles policy bind submission using JSON
 *
 * The frontend sends simplified JSON. The server transforms
 * to CSIO-compliant PersAutoPolicyAddRq XML.
 */

import { getAuthHeaders } from './authService.js';
import config from '../config/index.js';

/**
 * Submits a bind request for a quoted policy.
 * @param {Object} bindData - Bind request payload
 * @param {string} bindData.quoteNumber - The insurer reference / quote number to bind
 * @param {string} [bindData.insurerId] - The insurer to bind with
 * @param {Object} [bindData.quoteData] - Full quote data for CSIO transformation
 * @returns {Promise<Object>} The parsed bind response
 * @throws {Error} If the request fails or returns 4xx/5xx
 */
export async function submitBindRequest(bindData) {
  const headers = await getAuthHeaders();

  // Log the outgoing request
  console.log('[BindService] Sending bind request to server:');
  console.log('[BindService] Endpoint:', config.api.bindEndpoint);
  console.log('[BindService] Payload:', JSON.stringify(bindData, null, 2));

  const response = await fetch(config.api.bindEndpoint, {
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
      throw new Error('Bind request rejected: invalid or missing quote number.');
    }
    if (status >= 500) {
      throw new Error('Server error during bind. Please try again.');
    }
    throw new Error(`Bind failed: ${response.statusText}`);
  }

  const data = await response.json();

  console.log('[BindService] Received response from server:');
  console.log('[BindService] Success:', data.success);
  console.log('[BindService] Policy Number:', data.policyNumber);

  return data;
}
