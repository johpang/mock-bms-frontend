/**
 * Commercial Lines Quote API Service
 * Handles commercial quote submission using JSON
 *
 * The frontend sends simplified JSON. The server transforms
 * to CSIO-compliant CommlPkgPolicyQuoteInqRq XML.
 */

import { getAuthHeaders } from './authService.js';
import config from '../config/index.js';

function ensureArray(val, childKey) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (childKey && val[childKey]) {
    const inner = val[childKey];
    return Array.isArray(inner) ? inner : [inner];
  }
  return [val];
}

function normalizeResult(r) {
  return {
    ...r,
    premiums: r.premiums || { annual: 0, monthly: 0 },
    coverages: ensureArray(r.coverages, 'coverage'),
    underwritingMessages: ensureArray(r.underwritingMessages, 'message'),
  };
}

export function composeCommlRequestPayload(commlData) {
  return {
    id: commlData.id || '',
    producerCode: commlData.producerCode || '',
    bmsQuoteNumber: commlData.bmsQuoteNumber || '',
    billingMethod: commlData.billingMethod || '',
    language: commlData.language || 'en',
    policyEffectiveDate: commlData.policyEffectiveDate || '',
    policyExpiryDate: commlData.policyExpiryDate || '',
    paymentMethod: commlData.paymentMethod || '',
    account: commlData.account || {},
    business: commlData.business || {},
    questions: commlData.questions || {},
    location: commlData.location || {},
    building: commlData.building || {},
    mortgageHolder: commlData.mortgageHolder || '',
    selectedInsurers: commlData.selectedInsurers || [],
  };
}

export async function submitCommlQuoteRequest(commlData) {
  const headers = await getAuthHeaders();
  const payload = composeCommlRequestPayload(commlData);

  console.log('[CommlQuoteService] Sending JSON to server:');
  console.log('[CommlQuoteService] Endpoint:', config.api.commlQuoteEndpoint);
  console.log('[CommlQuoteService] Payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(config.api.commlQuoteEndpoint, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Commercial quote submission failed: ${response.statusText}`);
  }

  const data = await response.json();

  console.log('[CommlQuoteService] Received JSON response:');
  console.log('[CommlQuoteService] Success:', data.success);
  console.log('[CommlQuoteService] Quote ID:', data.quoteId);
  console.log('[CommlQuoteService] Results count:', data.results?.length);

  let results = data.results || [];
  if (!Array.isArray(results)) results = [results];

  return { ...data, results: results.map(normalizeResult) };
}
