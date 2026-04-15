/**
 * Habitational Quote Request Schema
 * Defines the default/initial state for the habitational quote form
 */

export const initialHabQuoteData = {
  // Producer information
  producerCode: '',
  bmsQuoteNumber: '',
  billingMethod: '',

  // Customer information
  customer: {
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    phone: '',
  },

  // Policy period
  policyEffectiveDate: '',
  policyEffectiveTime: '',
  policyEffectiveAmPm: 'AM',
  policyExpiryDate: '',

  // Applicant data
  applicant: {
    name: '',
    dateOfBirth: '',
  },

  // Loss history
  lossHistory: {
    hasLossesOrClaims: '',       // Yes / No
    hasBeenDeclined: '',         // Yes / No
  },

  // Risk type
  riskType: '',  // Homeowners / Condo / Tenant

  // Risk address
  riskAddress: {
    address: '',
    city: '',
    province: '',
    postalCode: '',
  },

  // Building details
  building: {
    yearBuilt: '',
    numStoreys: '',
    numFamilies: '',
    numUnits: '',
    totalLivingArea: '',
    smokers: '',            // Yes / No
    numMortgages: '',
    yearsHomeInsurance: '',
  },

  // Replacement cost
  replacementCost: {
    occupancyType: '',
    structureType: '',
    foundationType: '',
    finishedBasement: '',
    exteriorWallFinish: '',
    garageType: '',
  },

  // Upgrades
  upgrades: {
    roofYear: '',
    roofCoveringType: '',
    electricalYear: '',
    electricalWiringType: '',
    electricalPanelType: '',
    serviceAmperage: '',
    heatingYear: '',
    primaryHeatingType: '',
    plumbingYear: '',
    auxiliaryHeating: '',       // Yes / No
    oilTank: '',               // Yes / No
  },

  // Protection
  protection: {
    mainWaterValveShutOff: '',
    fireProtection: '',
    securitySystem: '',        // Yes / No
    distanceToHydrant: '',
    numSmokeDetectors: '',
  },

  // Rooms
  numBathrooms: '',
  numKitchens: '',

  // Detached outbuildings
  detachedOutbuildings: '',

  // Swimming pool
  swimmingPool: {
    year: '',
    poolType: '',
    poolFenced: '',            // Yes / No
  },

  // Liability exposures
  liabilityExposures: {
    ownMultipleLocations: '',   // Yes / No
    weeksRentedToOthers: '',
    roomsRentedToOthers: '',
    daycareNumChildren: '',
    ownTrampoline: '',          // Yes / No
    haveGardenTractor: '',      // Yes / No
    haveGolfCart: '',            // Yes / No
    numSaddleDraftAnimals: '',
    ownUnlicensedRecVehicles: '',  // Yes / No
    renewableEnergyInstall: '',    // Yes / No
    ownWatercraft: '',             // Yes / No
  },

  // Coverages
  coverages: {
    dwellingBuilding:          { enabled: false, amount: '', deductible: '' },
    detachedPrivateStructures: { enabled: false, amount: '', deductible: '' },
    personalProperty:          { enabled: false, amount: '', deductible: '' },
    additionalLivingExpenses:  { enabled: false, amount: '', deductible: '' },
    legalLiability:            { enabled: false, amount: '', deductible: '' },
    voluntaryMedicalPayments:  { enabled: false, amount: '', deductible: '' },
    voluntaryPropertyDamage:   { enabled: false, amount: '', deductible: '' },
    sewerBackup:               { enabled: false, amount: '', deductible: '' },
    legalServices:             { enabled: true,  amount: '25000', deductible: '' },
    identityTheftProtection:   { enabled: true,  amount: '25000', deductible: '' },
  },

  // Selected insurers for quote
  selectedInsurers: [],
};
