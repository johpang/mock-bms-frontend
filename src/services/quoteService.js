/**
 * Quote API Service
 * Handles quote submission and API communication
 */

import { getAuthHeaders } from './authService.js';
import config from '../config/index.js';

/**
 * Composes the API request payload from form data
 * Maps form fields to API structure with organized sections
 * @param {Object} quoteData - The complete quote form state
 * @returns {Object} The structured API payload
 */
export function composeRequestPayload(quoteData) {
  return {
    producer: {
      code: quoteData.producerCode,
      bmsQuoteNumber: quoteData.bmsQuoteNumber,
      billingMethod: quoteData.billingMethod,
    },
    customer: {
      firstName: quoteData.customer?.firstName || '',
      lastName: quoteData.customer?.lastName || '',
      dateOfBirth: quoteData.customer?.dob || '',
      address: quoteData.customer?.address || '',
      postalCode: quoteData.customer?.postalCode || '',
      city: quoteData.customer?.city || '',
      province: quoteData.customer?.province || '',
      phone: quoteData.customer?.phone || '',
    },
    policy: {
      effectiveDate: quoteData.policyEffectiveDate || '',
      startDate: quoteData.policyStartDate || '',
    },
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
      coverage: {
        comprehensiveCoverage: v.comprehensiveCoverage || false,
        comprehensiveDeductible: v.comprehensiveDeductible || '',
        collisionCoverage: v.collisionCoverage || false,
        collisionDeductible: v.collisionDeductible || '',
      },
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
 * Submits a quote request to the API
 * @param {Object} quoteData - The complete quote form state
 * @returns {Promise<Object>} The parsed JSON response from the API
 * @throws {Error} If the request fails
 */
export async function submitQuoteRequest(quoteData) {
  const headers = await getAuthHeaders();
  const payload = composeRequestPayload(quoteData);

  const response = await fetch(config.api.quoteEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Quote submission failed: ${response.statusText}`);
  }

  return await response.json();
}
