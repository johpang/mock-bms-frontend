/**
 * Quote API Service
 * Handles quote submission and API communication using JSON
 *
 * The frontend sends the simplified data model as JSON.
 * The server handles CSIO XML transformation.
 */

import { getAuthHeaders } from './authService.js';
import config from '../config/index.js';

/**
 * Composes the API request payload from form data.
 * Sends the simplified model directly — the server maps to CSIO XML.
 * @param {Object} quoteData - The complete quote form state
 * @returns {Object} The structured API payload
 */
export function composeRequestPayload(quoteData) {
  return {
    producerCode: quoteData.producerCode || '',
    bmsQuoteNumber: quoteData.bmsQuoteNumber || '',
    billingMethod: quoteData.billingMethod || '',
    customer: {
      firstName: quoteData.customer?.firstName || '',
      lastName: quoteData.customer?.lastName || '',
      dob: quoteData.customer?.dob || '',
      gender: quoteData.customer?.gender || '',
      address: quoteData.customer?.address || '',
      postalCode: quoteData.customer?.postalCode || '',
      city: quoteData.customer?.city || '',
      province: quoteData.customer?.province || '',
      phone: quoteData.customer?.phone || '',
    },
    policyEffectiveDate: quoteData.policyEffectiveDate || '',
    policyStartDate: quoteData.policyStartDate || '',
    vehicles: (quoteData.vehicles || []).map((v) => ({
      year: v.year || '',
      make: v.make || '',
      model: v.model || '',
      antiTheft: v.antiTheft || false,
      primaryUse: v.primaryUse || '',
      distanceDriven: {
        inTrip: v.distanceDriven?.inTrip || '',
        annually: v.distanceDriven?.annually || '',
        businessKm: v.distanceDriven?.businessKm || '',
      },
      comprehensiveCoverage: v.comprehensiveCoverage || false,
      comprehensiveDeductible: v.comprehensiveDeductible || '',
      collisionCoverage: v.collisionCoverage || false,
      collisionDeductible: v.collisionDeductible || '',
    })),
    drivers: (quoteData.drivers || []).map((d) => ({
      firstName: d.firstName || '',
      lastName: d.lastName || '',
      relationship: d.relationship || '',
      gender: d.gender || '',
      maritalStatus: d.maritalStatus || '',
    })),
    licensing: {
      type: quoteData.licensing?.type || '',
      g2Date: quoteData.licensing?.g2Date || '',
      gDate: quoteData.licensing?.gDate || '',
      province: quoteData.licensing?.province || '',
    },
    garagingLocation: {
      postalCode: quoteData.garagingLocation?.postalCode || '',
      city: quoteData.garagingLocation?.city || '',
    },
    cancellations: {
      cancelled: quoteData.cancellations?.cancelled || '',
      withoutCoverage: quoteData.cancellations?.withoutCoverage || '',
      suspended: quoteData.cancellations?.suspended || '',
      accidents: quoteData.cancellations?.accidents || '',
      tickets: quoteData.cancellations?.tickets || '',
    },
    selectedInsurers: quoteData.selectedInsurers || [],
  };
}

/**
 * Submits a quote request to the API as JSON.
 * The server transforms to CSIO XML per insurer.
 * @param {Object} quoteData - The complete quote form state
 * @returns {Promise<Object>} The parsed response object
 * @throws {Error} If the request fails
 */
export async function submitQuoteRequest(quoteData) {
  const headers = await getAuthHeaders();
  const payload = composeRequestPayload(quoteData);

  // Log the outgoing request
  console.log('[QuoteService] Sending quote request to server:');
  console.log('[QuoteService] Endpoint:', config.api.quoteEndpoint);
  console.log('[QuoteService] Payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(config.api.quoteEndpoint, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Quote submission failed: ${response.statusText}`);
  }

  const data = await response.json();

  console.log('[QuoteService] Received response from server:');
  console.log('[QuoteService] Success:', data.success);
  console.log('[QuoteService] Quote ID:', data.quoteId);
  console.log('[QuoteService] Results count:', data.results?.length || 0);

  return data;
}
