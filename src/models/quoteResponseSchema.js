/**
 * Quote Response Schema
 * Documents the shape of quote API responses
 */

/**
 * Sample quote response structure
 * Shows the expected format returned by the quote API
 * @type {Array<Object>}
 */
export const sampleQuoteResponse = [
  {
    insurerName: 'ABC Insurance',
    referenceNumber: 'ABC-2024-001234',
    type: 'New Business',
    premiums: {
      annual: 1450.00,
      monthly: 125.00,
    },
    effectiveDate: '2024-04-01',
    territory: 'Ontario',
    coverageCodes: ['AB', 'CD', 'EF'],
    underwritingMessages: [
      'Standard underwriting completed',
      'No additional information required',
    ],
    vehicleSummary: {
      year: 2022,
      make: 'Toyota',
      model: 'Camry',
      vin: '4T1BF1AK5CU123456',
    },
    coverages: [
      {
        name: 'Comprehensive Coverage',
        coverageAmount: 100000,
        deductible: 500,
        premium: 250.00,
      },
      {
        name: 'Collision Coverage',
        coverageAmount: 100000,
        deductible: 500,
        premium: 300.00,
      },
      {
        name: 'Liability Coverage',
        coverageAmount: 2000000,
        deductible: 0,
        premium: 450.00,
      },
      {
        name: 'Uninsured Motorist Protection',
        coverageAmount: 250000,
        deductible: 500,
        premium: 150.00,
      },
    ],
  },
  {
    insurerName: 'XYZ Coverage Inc',
    referenceNumber: 'XYZ-2024-005678',
    type: 'New Business',
    premiums: {
      annual: 1320.00,
      monthly: 110.00,
    },
    effectiveDate: '2024-04-01',
    territory: 'Ontario',
    coverageCodes: ['GH', 'IJ', 'KL'],
    underwritingMessages: [
      'Quote approved pending document review',
    ],
    vehicleSummary: {
      year: 2022,
      make: 'Toyota',
      model: 'Camry',
      vin: '4T1BF1AK5CU123456',
    },
    coverages: [
      {
        name: 'Comprehensive Coverage',
        coverageAmount: 100000,
        deductible: 750,
        premium: 200.00,
      },
      {
        name: 'Collision Coverage',
        coverageAmount: 100000,
        deductible: 750,
        premium: 275.00,
      },
      {
        name: 'Liability Coverage',
        coverageAmount: 2000000,
        deductible: 0,
        premium: 425.00,
      },
      {
        name: 'Uninsured Motorist Protection',
        coverageAmount: 250000,
        deductible: 750,
        premium: 120.00,
      },
    ],
  },
];
