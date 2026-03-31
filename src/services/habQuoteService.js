/**
 * Habitational Quote API Service
 * Handles hab quote submission using XML
 */

import { getAuthHeaders } from './authService.js';
import config from '../config/index.js';
import { objectToXml, xmlToObject } from '../utils/xmlHelpers.js';

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
    producer: {
      code: habData.producerCode,
      bmsQuoteNumber: habData.bmsQuoteNumber,
      billingMethod: habData.billingMethod,
    },
    customer: habData.customer || {},
    policy: {
      effectiveDate: habData.policyEffectiveDate || '',
      effectiveTime: habData.policyEffectiveTime || '',
      effectiveAmPm: habData.policyEffectiveAmPm || '',
      expiryDate: habData.policyExpiryDate || '',
    },
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
  const xmlBody = objectToXml(payload, 'habQuoteRequest');

  const response = await fetch(config.api.habQuoteEndpoint, {
    method: 'POST',
    headers,
    body: xmlBody,
  });

  if (!response.ok) {
    throw new Error(`Hab quote submission failed: ${response.statusText}`);
  }

  const xmlText = await response.text();
  const parsed = xmlToObject(xmlText);

  let results = parsed.results || parsed;
  if (results && !Array.isArray(results)) {
    results = results.result || results;
    if (!Array.isArray(results)) results = [results];
  }

  return { ...parsed, results: results.map(normalizeResult) };
}
