/**
 * Habitational Quote API Service
 * Handles hab quote submission using JSON
 *
 * The frontend sends simplified JSON. The server transforms
 * to CSIO-compliant HomePolicyQuoteInqRq XML.
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

export function composeHabRequestPayload(habData) {
  return {
    producerCode: habData.producerCode || '',
    bmsQuoteNumber: habData.bmsQuoteNumber || '',
    billingMethod: habData.billingMethod || '',
    customer: habData.customer || {},
    policyEffectiveDate: habData.policyEffectiveDate || '',
    policyEffectiveTime: habData.policyEffectiveTime || '',
    policyEffectiveAmPm: habData.policyEffectiveAmPm || '',
    policyExpiryDate: habData.policyExpiryDate || '',
    applicant: habData.applicant || {},
    lossHistory: habData.lossHistory || {},
    riskType: habData.riskType || '',
    riskAddress: habData.riskAddress || {},
    building: habData.building || {},
    replacementCost: habData.replacementCost || {},
    upgrades: habData.upgrades || {},
    protection: habData.protection || {},
    numBathrooms: habData.numBathrooms || '',
    numKitchens: habData.numKitchens || '',
    detachedOutbuildings: habData.detachedOutbuildings || '',
    swimmingPool: habData.swimmingPool || {},
    liabilityExposures: habData.liabilityExposures || {},
    coverages: habData.coverages || {},
    selectedInsurers: habData.selectedInsurers || [],
  };
}

export async function submitHabQuoteRequest(habData) {
  const headers = await getAuthHeaders();
  const payload = composeHabRequestPayload(habData);

  console.log('[HabQuoteService] Sending JSON to server:');
  console.log('[HabQuoteService] Endpoint:', config.api.habQuoteEndpoint);
  console.log('[HabQuoteService] Payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(config.api.habQuoteEndpoint, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Hab quote submission failed: ${response.statusText}`);
  }

  const data = await response.json();

  console.log('[HabQuoteService] Received JSON response:');
  console.log('[HabQuoteService] Success:', data.success);
  console.log('[HabQuoteService] Quote ID:', data.quoteId);
  console.log('[HabQuoteService] Results count:', data.results?.length);

  let results = data.results || [];
  if (!Array.isArray(results)) results = [results];

  return { ...data, results: results.map(normalizeResult) };
}
