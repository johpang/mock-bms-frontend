/**
 * Quote Request Schema
 * Defines the default/initial state for the quote form
 */

/**
 * Initial quote data structure for form state
 * @type {Object}
 */
export const initialQuoteData = {
  // Producer information
  producerCode: '',
  bmsQuoteNumber: '',
  billingMethod: '',

  // Customer information
  customer: {
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    phone: '',
  },

  // Policy information
  policyEffectiveDate: '',
  policyStartDate: '',

  // Vehicles (array — each entry includes distance driven & coverage)
  vehicles: [
    {
      year: '',
      make: '',
      model: '',
      ownership: '',
      antiTheft: false,
      primaryUse: '',
      distanceDriven: {
        inTrip: '',
        annually: '',
        businessKm: '',
      },
      comprehensiveCoverage: false,
      comprehensiveDeductible: '',
      collisionCoverage: false,
      collisionDeductible: '',
    },
  ],

  // Garaging location
  garagingLocation: {
    postalCode: '',
    city: '',
  },

  // Drivers (array — each entry includes licensing and cancellation history)
  drivers: [
    {
      firstName: '',
      lastName: '',
      relationship: '',
      gender: '',
      maritalStatus: '',
      licensing: {
        type: '',
        g2Date: '',
        gDate: '',
        province: '',
      },
      cancellations: {
        cancelled: '',
        withoutCoverage: '',
        suspended: '',
        accidents: '',
        tickets: '',
      },
    },
  ],

  // Selected insurers for quote
  selectedInsurers: [],
};
