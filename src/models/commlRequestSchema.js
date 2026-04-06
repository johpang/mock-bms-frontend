/**
 * Commercial Lines Request Schema
 * Defines the initial state shape for the commercial insurance quote form.
 *
 * Field order follows the mockup layout in:
 *   mockups/CSIO API Gateway - Phase 1 - Small Commercial Lines BMS Mock-up.docx
 *
 * NOTE: business.operations is an array to support multiple IBC codes in the
 * data model and CSIO XML, but the frontend currently only supports a single
 * industry code entry per the mockup design.
 */

export const initialCommlQuoteData = {
  /* ── Quote-level identifiers ── */
  producerCode: '',
  bmsQuoteNumber: '',
  billingMethod: '',

  /* ── Account / Insured (address block in mockup) ── */
  account: {
    commercialName: '',   // not in mockup screen but needed for CSIO XML
    dbaName: '',          // not in mockup screen but needed for CSIO XML
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'CA',
    email: '',
    website: '',
  },

  /* ── Policy Information ── */
  language: 'en',
  policyEffectiveDate: '',
  policyExpiryDate: '',
  paymentMethod: '',

  /* ── Business Information ── */
  business: {
    startDate: '',
    yearsExperience: '',
    annualRevenue: '',
    totalRevenue: '',
    /**
     * Array of business operations with IBC industry codes.
     * Frontend supports only ONE entry per mockup; data model keeps array
     * for CSIO XML compatibility (repeating BusinessInfo blocks).
     */
    operations: [
      { ibcCode: '', revenuePct: '100' },
    ],
  },

  /* ── Additional Questions (after Business Operations per mockup) ── */
  questions: {
    undergroundWork: '',
    sqftOccupied: '',
    insuranceCancelled: '',
    claimsLast5Years: '',
  },

  /* ── Location Details (building-level in mockup) ── */
  location: {
    yearBuilt: '',
    buildingType: '',
    foundationType: '',
    numStories: '',
    numUnits: '',
    areaOccupied: '',
    pctVacant: '',
    numEmployees: '',
  },

  /* ── Protection ── */
  building: {
    protection: {
      burglarAlarm: '',    // 'LocalAlarm' | 'None' — dropdown
      fireAlarm: '',       // 'LocalAlarm' | 'None' — dropdown
      fireProtection: '',
      sprinklered: '',
    },

    /* Building Improvements */
    improvements: {
      heating: '',
      plumbing: '',
      electrical: '',
      roof: '',
    },

    /* Coverages Requested (nested under building per data model) */
    coverages: {
      /* Policy-level coverages — 'Yes'/'No' radio values */
      cgl: '',
      cglLimit: '',
      /* Additional coverages — 'Yes'/'No' radio values */
      contractorEquipment: '',
      toolFloater: '',
      /* Location-level coverages — 'Yes'/'No' radio values */
      buildingCov: '',
      buildingLimit: '',
      equipmentCov: '',
      equipmentLimit: '',
      stockCov: '',
      contentsCov: '',
      sewerBackup: '',
      sewerBackupLimit: '',
      flood: '',
      earthquake: '',
    },
  },

  /* ── Bind-only ── */
  mortgageHolder: '',

  /* ── Insurer selection ── */
  selectedInsurers: [],
};
