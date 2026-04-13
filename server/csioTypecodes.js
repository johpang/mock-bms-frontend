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

// ── Habitational-specific typecodes ─────────────────────────

// riskType -> LOBSubCd
const HAB_RISK_TYPE_MAP = {
  Homeowners: 'HOME',
  Condo:      'COND',
  Tenant:     'TENT',
};

// replacementCost.structureType -> ConstructionCd
const HAB_CONSTRUCTION_MAP = {
  'Detached':       'B',   // Brick/Masonry
  'Semi-Detached':  'B',
  'Row House':      'C',   // Masonry Veneer
  'Condo':          'C',
};

// replacementCost.foundationType -> FoundationCd
const HAB_FOUNDATION_MAP = {
  'Full Basement':  '6',   // Basement
  'Crawl Space':    '7',   // Crawlspace
  'Slab':           '8',   // Slab/Concrete Slab
  'Concrete':       '1',   // Concrete/Masonry
};

// upgrades.roofCoveringType -> RoofMaterialCd
const HAB_ROOF_MATERIAL_MAP = {
  'Asphalt Shingles': 'A',
  'Metal':            'B',   // Aluminium/Metal
  'Flat Membrane':    'L',   // Corrugated/Flat
  'Cedar Shakes':     'F',   // Mineral Fiber Shakes (closest)
  'Tile':             'C',   // Clay Tile
};

// upgrades.electricalPanelType -> ElectricalPanelCd
const HAB_ELECTRICAL_PANEL_MAP = {
  'Circuit Breakers': '1',
  'Fuses':            '2',
};

// upgrades.electricalWiringType -> WiringTypeCd
const HAB_WIRING_TYPE_MAP = {
  'Copper':        '2',
  'Aluminum':      '1',
  'Knob and Tube': '3',
};

// upgrades.primaryHeatingType -> FuelTypeCd
const HAB_FUEL_TYPE_MAP = {
  'Forced Air Gas':      'N',   // Natural Gas
  'Forced Air Electric': 'E',   // Electric
  'Hot Water':           'N',   // Typically gas
  'Electric Baseboard':  'E',
  'Radiant':             'E',
};

// upgrades.primaryHeatingType -> HeatingUnitCd
const HAB_HEATING_UNIT_MAP = {
  'Forced Air Gas':      '7',   // Forced Air
  'Forced Air Electric': '7',
  'Hot Water':           '6',   // Hot Water/Steam
  'Electric Baseboard':  '4',   // Radiant Ceiling (closest)
  'Radiant':             '4',
};

// replacementCost.garageType -> GarageTypeCd
const HAB_GARAGE_TYPE_MAP = {
  'Attached':             '4',   // Attached Frame
  'Detached':             '6',   // Detached Frame
  'Built-In':             '1',
  'Carport':              '3',
  'None':                 '0',
  'Underground Parking':  '2',   // Basement (closest)
};

// replacementCost.structureType -> ResidenceTypeCd
const HAB_RESIDENCE_TYPE_MAP = {
  'Detached':       'DT',
  'Semi-Detached':  'SD',
  'Row House':      'TH',   // Townhouse
  'Condo':          'AC',   // Apartment/Co-op
};

// replacementCost.occupancyType -> DwellUseCd
const HAB_DWELL_USE_MAP = {
  'Owner Occupied':  '1',   // Primary Residence
  'Tenant Occupied': '4',   // Rental
  'Vacant':          '8',
};

// replacementCost.occupancyType -> OccupancyTypeCd
const HAB_OCCUPANCY_TYPE_MAP = {
  'Owner Occupied':  '1',
  'Tenant Occupied': '4',
  'Vacant':          '8',
};

// Frontend coverage key -> CSIO CoverageCd
const HAB_COVERAGE_CODE_MAP = {
  dwellingBuilding:          'DWELL',
  detachedPrivateStructures: 'OS',
  personalProperty:          'PP',
  additionalLivingExpenses:  'BLDG',
  legalLiability:            'PERUS',
  voluntaryMedicalPayments:  'MEDPM',
  voluntaryPropertyDamage:   'VPDA',
  sewerBackup:               'RVCS',
};

// ── Commercial-specific typecodes ──────────────────────────

// Alarm type: frontend value -> CSIO AlarmDescCd
// csio:4 = Local Alarm
const COMML_ALARM_MAP = {
  LocalAlarm: '4',
  None:       null,   // no AlarmAndSecurity element emitted
};

// Building construction type: frontend value -> csio:BldgConstructionCd
const COMML_CONSTRUCTION_MAP = {
  'Frame':              '1',   // Frame
  'NonCombustible':     '2',   // Non-Combustible (Joisted Masonry)
  'Non-Combustible':    '2',
  'Masonry':            '3',   // Masonry Non-Combustible
  'FireResistive':      '4',   // Fire Resistive
  'Fire Resistive':     '4',
  'ModifiedFireResist': '5',   // Modified Fire Resistive
  'MasonryVeneer':      '6',   // Masonry Veneer
};

// Payment method: frontend value -> CSIO MethodPaymentCd
// (already stored with csio: prefix on frontend, e.g. 'csio:EF')
const COMML_PAYMENT_METHOD_MAP = {
  'csio:EF': 'EF',  // Electronic Funds Transfer
  'csio:CD': 'CD',  // Credit Card
  'csio:P':  'P',   // Direct Bill / Company Policy Billed
};

// Interest code: frontend -> CSIO InterestCd
const COMML_INTEREST_MAP = {
  Owner:  'OW',
  Tenant: 'TN',
};

// Occupancy code: frontend -> CSIO OccupancyCd
const COMML_OCCUPANCY_MAP = {
  'Office':     '11',
  'Retail':     '12',
  'Warehouse':  '13',
  'Industrial': '14',
  'Restaurant': '15',
};

module.exports = {
  INSURER_CONFIG,
  BILLING_METHOD_MAP,
  MARITAL_STATUS_MAP,
  PROVINCE_FULL_NAME,
  HAB_RISK_TYPE_MAP,
  HAB_CONSTRUCTION_MAP,
  HAB_FOUNDATION_MAP,
  HAB_ROOF_MATERIAL_MAP,
  HAB_ELECTRICAL_PANEL_MAP,
  HAB_WIRING_TYPE_MAP,
  HAB_FUEL_TYPE_MAP,
  HAB_HEATING_UNIT_MAP,
  HAB_GARAGE_TYPE_MAP,
  HAB_RESIDENCE_TYPE_MAP,
  HAB_DWELL_USE_MAP,
  HAB_OCCUPANCY_TYPE_MAP,
  HAB_COVERAGE_CODE_MAP,
  COMML_ALARM_MAP,
  COMML_CONSTRUCTION_MAP,
  COMML_PAYMENT_METHOD_MAP,
  COMML_INTEREST_MAP,
  COMML_OCCUPANCY_MAP,
};
