/**
 * CSIO Typecodes and Value Mappings
 *
 * Lookup tables derived from ACORD-ca v1.50.0 / CSIO XML XSD.
 * Used by csioTransformer.js and available for reuse elsewhere.
 */

// Insurer CompanyCd lookup (verified from XSD)
const INSURER_CONFIG = {
  aviva:      { companyCd: 'CGUI', insurerId: 'CGUI00001', csioNetId: 'csioxml-aviva@broker.edi.csio.com',      name: 'Aviva' },
  intact:     { companyCd: 'HAL',  insurerId: 'HAL00001',  csioNetId: 'csioxml-intact@broker.edi.csio.com',     name: 'Intact' },
  definity:   { companyCd: 'ECON', insurerId: 'ECON00001', csioNetId: 'csioxml-definity@broker.edi.csio.com',   name: 'Definity' },
  wawanesa:   { companyCd: 'WAWA', insurerId: 'WAWA00001', csioNetId: 'csioxml-wawanesa@broker.edi.csio.com',   name: 'Wawanesa' },
  caa:        { companyCd: 'CAA',  insurerId: 'CAA00001',  csioNetId: 'csioxml-caa@broker.edi.csio.com',        name: 'CAA' },
  goreMutual: { companyCd: 'GORE', insurerId: 'GORE00001', csioNetId: 'csioxml-goremutual@broker.edi.csio.com', name: 'Gore Mutual' },
};

// BillingMethodCd: app value -> CSIO code
const BILLING_METHOD_MAP = {
  directBilling: 'P',   // Company Policy Billed
  brokerBilled:  'A',   // Agency/Brokerage Billed
  insuredBilled: 'C',   // Company Account Billed
};

// MaritalStatusCd: app value -> CSIO code
const MARITAL_STATUS_MAP = {
  Married:     'M',
  Single:      'S',
  Divorced:    'D',
  Widowed:     'W',
  'Common Law': 'C',
  Separated:   'P',
};

// Province code to full name
const PROVINCE_FULL_NAME = {
  ON: 'Ontario', QC: 'Quebec', BC: 'British Columbia', AB: 'Alberta',
  MB: 'Manitoba', SK: 'Saskatchewan', NS: 'Nova Scotia', NB: 'New Brunswick',
  PE: 'Prince Edward Island', NL: 'Newfoundland and Labrador',
  NT: 'Northwest Territories', YT: 'Yukon', NU: 'Nunavut',
};

module.exports = {
  INSURER_CONFIG,
  BILLING_METHOD_MAP,
  MARITAL_STATUS_MAP,
  PROVINCE_FULL_NAME,
};
