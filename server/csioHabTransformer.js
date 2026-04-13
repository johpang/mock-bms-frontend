/**
 * CSIO Habitational XML Transformer
 *
 * Transforms the simplified BMS hab data model into CSIO-compliant XML
 * based on ACORD-ca v1.50.0 / CSIO XML standard.
 *
 * Quote template: HomePolicyQuoteInqRq
 * Bind template:  HomePolicyAddRq
 *
 * The frontend sends its simplified JSON model.
 * This module maps those fields into the full CSIO XML structure,
 * generating UUIDs, timestamps, and other envelope values server-side.
 */

const { uuid, isoNow, dateOnly, addOneYear, esc, randomNumericId } = require('./csioHelpers');
const {
  INSURER_CONFIG,
  BILLING_METHOD_MAP,
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
} = require('./csioTypecodes');

// -- Coverage XML builders (hab-specific, nested inside Dwell) ----

function habCoverageWithLimit(code, amount, desc) {
  return `
          <Coverage>
            <CoverageCd>csio:${esc(code)}</CoverageCd>
            <CoverageDesc>${esc(desc)}</CoverageDesc>
            <Limit>
              <FormatCurrencyAmt>
                <Amt>${esc(amount)}</Amt>
                <CurCd>CAD</CurCd>
              </FormatCurrencyAmt>
            </Limit>
          </Coverage>`;
}

function habCoverageWithDeductible(code, amount, desc) {
  return `
          <Coverage>
            <CoverageCd>csio:${esc(code)}</CoverageCd>
            <CoverageDesc>${esc(desc)}</CoverageDesc>
            <Deductible>
              <FormatCurrencyAmt>
                <Amt>${esc(amount)}</Amt>
                <CurCd>CAD</CurCd>
              </FormatCurrencyAmt>
            </Deductible>
          </Coverage>`;
}

// -- QuestionAnswer builder ----------------------------------------

function questionAnswer(code, yesNoValue) {
  const yn = (yesNoValue === 'Yes' || yesNoValue === 'yes' || yesNoValue === true) ? 'YES' : 'NO';
  return `
          <QuestionAnswer>
            <QuestionCd>csio:${esc(code)}</QuestionCd>
            <YesNoCd>${yn}</YesNoCd>
          </QuestionAnswer>`;
}

// -- Main transformer -----------------------------------------------

/**
 * Builds a CSIO-compliant XML string for habitational from the simplified BMS data model.
 *
 * @param {Object} data          - The simplified form data (from frontend JSON)
 * @param {string} insurerId     - App insurer key (e.g. 'aviva', 'intact')
 * @param {Object} options
 * @param {string} options.type  - 'quote' or 'bind'
 * @returns {string}             - Complete CSIO XML string
 */
function buildHabCsioXml(data, insurerId, options = {}) {
  const type = options.type || 'quote';
  const isQuote = type === 'quote';
  const companysQuoteNumber = options.companysQuoteNumber || '';

  const insurer = INSURER_CONFIG[insurerId] || INSURER_CONFIG.aviva;
  const rqUID = uuid();
  const now = isoNow();
  const sessKey = String(Math.floor(Math.random() * 99999999));

  // -- Extract fields from simplified model --
  const customer     = data.customer || {};
  const policy       = data.policy || {};
  const applicant    = data.applicant || {};
  const lossHistory  = data.lossHistory || {};
  const riskAddress  = data.riskAddress || {};
  const building     = data.building || {};
  const replaceCost  = data.replacementCost || {};
  const upgrades     = data.upgrades || {};
  const protection   = data.protection || {};
  const pool         = data.swimmingPool || {};
  const liability    = data.liabilityExposures || {};
  const coverages    = data.coverages || {};

  const effectiveDt  = dateOnly(data.policyEffectiveDate || policy.effectiveDate || '');
  const expirationDt = dateOnly(data.policyExpiryDate || policy.expiryDate || '') || addOneYear(effectiveDt);
  const policyNumber = data.bmsQuoteNumber || data.producer?.bmsQuoteNumber || 'HAB-10001';
  const producerCode = data.producerCode || data.producer?.code || '0001-01';
  const billingMethod = BILLING_METHOD_MAP[data.billingMethod || data.producer?.billingMethod] || 'P';
  const province     = customer.province || 'ON';
  const provinceFull = PROVINCE_FULL_NAME[province] || province;

  // Risk type mapping
  const riskType     = data.riskType || 'Homeowners';
  const lobSubCd     = HAB_RISK_TYPE_MAP[riskType] || 'HOME';

  // Time conversion (12h -> 24h)
  const effTime = data.policyEffectiveTime || policy.effectiveTime || '12:01';
  const effAmPm = data.policyEffectiveAmPm || policy.effectiveAmPm || 'AM';
  let startTime = '00:01:00';
  if (effTime) {
    const [h, m] = effTime.split(':').map(Number);
    let hour24 = h;
    if (effAmPm === 'PM' && h !== 12) hour24 = h + 12;
    if (effAmPm === 'AM' && h === 12) hour24 = 0;
    startTime = `${String(hour24).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00`;
  }

  const rqElementName = isQuote ? 'HomePolicyQuoteInqRq' : 'HomePolicyAddRq';

  // InsuredOrPrincipalRoleCd differs between quote and bind
  const roleCds = isQuote
    ? '          <InsuredOrPrincipalRoleCd>csio:5</InsuredOrPrincipalRoleCd>'
    : `          <InsuredOrPrincipalRoleCd>csio:999</InsuredOrPrincipalRoleCd>
          <InsuredOrPrincipalRoleCd>csio:5</InsuredOrPrincipalRoleCd>
          <InsuredOrPrincipalRoleCd>csio:999</InsuredOrPrincipalRoleCd>`;

  const dob = dateOnly(applicant.dateOfBirth || customer.dateOfBirth || '');

  // -- Construction codes --
  const constructionCd    = HAB_CONSTRUCTION_MAP[replaceCost.structureType] || 'B';
  const foundationCd      = HAB_FOUNDATION_MAP[replaceCost.foundationType] || '6';
  const roofMaterialCd    = HAB_ROOF_MATERIAL_MAP[upgrades.roofCoveringType] || 'A';
  const electricalPanelCd = HAB_ELECTRICAL_PANEL_MAP[upgrades.electricalPanelType] || '1';
  const wiringTypeCd      = HAB_WIRING_TYPE_MAP[upgrades.electricalWiringType] || '2';
  const fuelTypeCd        = HAB_FUEL_TYPE_MAP[upgrades.primaryHeatingType] || 'N';
  const heatingUnitCd     = HAB_HEATING_UNIT_MAP[upgrades.primaryHeatingType] || '7';
  const garageTypeCd      = HAB_GARAGE_TYPE_MAP[replaceCost.garageType] || '0';
  const residenceTypeCd   = HAB_RESIDENCE_TYPE_MAP[replaceCost.structureType] || 'DT';
  const dwellUseCd        = HAB_DWELL_USE_MAP[replaceCost.occupancyType] || '1';
  const occupancyTypeCd   = HAB_OCCUPANCY_TYPE_MAP[replaceCost.occupancyType] || '1';

  // -- Building improvements --
  let bldgImprovementsXml = '';
  const roofYear      = upgrades.roofYear || '';
  const electricalYear = upgrades.electricalYear || '';
  const heatingYear   = upgrades.heatingYear || '';
  const plumbingYear  = upgrades.plumbingYear || '';
  if (heatingYear || plumbingYear || roofYear || electricalYear) {
    bldgImprovementsXml = `
          <BldgImprovements>`;
    if (heatingYear)    bldgImprovementsXml += `\n            <HeatingImprovementYear>${esc(heatingYear)}</HeatingImprovementYear>`;
    if (plumbingYear)   bldgImprovementsXml += `\n            <PlumbingImprovementYear>${esc(plumbingYear)}</PlumbingImprovementYear>`;
    if (roofYear)       bldgImprovementsXml += `\n            <RoofingImprovementYear>${esc(roofYear)}</RoofingImprovementYear>`;
    if (electricalYear) bldgImprovementsXml += `\n            <WiringImprovementYear>${esc(electricalYear)}</WiringImprovementYear>`;
    bldgImprovementsXml += `
          </BldgImprovements>`;
  }

  // -- Electrical strength (service amperage) --
  const serviceAmperage = upgrades.serviceAmperage || '';
  let electricalStrengthXml = '';
  if (serviceAmperage) {
    electricalStrengthXml = `
              <ElectricalStrength>
                <NumUnits>${esc(serviceAmperage)}</NumUnits>
                <UnitMeasurementCd>AMP</UnitMeasurementCd>
              </ElectricalStrength>`;
  }

  // -- Swimming pool --
  let swimmingPoolXml = '';
  const poolType = pool.poolType || '';
  if (poolType) {
    const aboveGround = poolType.toLowerCase().includes('above') ? '1' : '0';
    const fenced = (pool.poolFenced === 'Yes' || pool.poolFenced === true) ? '1' : '0';
    swimmingPoolXml = `
          <SwimmingPool>
            <AboveGroundInd>${aboveGround}</AboveGroundInd>
            <ApprovedFenceInd>${fenced}</ApprovedFenceInd>
            <DivingBoardInd>0</DivingBoardInd>
          </SwimmingPool>`;
  }

  // -- Heating units --
  let heatingXml = `
          <HeatingUnitInfo>
            <FuelTypeCd>csio:${esc(fuelTypeCd)}</FuelTypeCd>
            <HeatingUnitCd>csio:${esc(heatingUnitCd)}</HeatingUnitCd>
            <UseCd>csio:PRI</UseCd>
          </HeatingUnitInfo>`;

  if (upgrades.auxiliaryHeating === 'Yes') {
    // TODO: Map auxiliary heating type if more detail is available
    heatingXml += `
          <HeatingUnitInfo>
            <FuelTypeCd>csio:W</FuelTypeCd>
            <HeatingUnitCd>csio:D</HeatingUnitCd>
            <UseCd>csio:AUX</UseCd>
          </HeatingUnitInfo>`;
  }

  // -- Alarm and security --
  let alarmXml = '';
  if (protection.securitySystem === 'Yes') {
    alarmXml = `
          <AlarmAndSecurity>
            <AlarmDescCd>csio:4</AlarmDescCd>
          </AlarmAndSecurity>`;
  }

  // -- Fire protection --
  let fireProtectionCd = 'Unprotected';
  const fp = (protection.fireProtection || '').toLowerCase();
  if (fp.includes('full') || fp.includes('protected') && !fp.includes('semi') && !fp.includes('un')) {
    fireProtectionCd = 'Protected';
  } else if (fp.includes('partial') || fp.includes('semi')) {
    fireProtectionCd = 'SemiProtected';
  }

  // -- Coverages (dwelling-level) --
  let coveragesXml = '';

  // Section I deductible (ARLA) - use dwelling deductible
  const sectionIDeductible = coverages.dwellingBuilding?.deductible || '2000';
  coveragesXml += habCoverageWithDeductible('ARLA', sectionIDeductible, 'Section I Deductibles');

  // Map each enabled frontend coverage
  const coverageMap = [
    { key: 'dwellingBuilding',          code: 'DWELL', desc: 'House',                       type: 'limit' },
    { key: 'detachedPrivateStructures',  code: 'OS',    desc: 'Detached Structures',          type: 'limit' },
    { key: 'personalProperty',           code: 'PP',    desc: 'Personal Belongings',           type: 'limit' },
    { key: 'additionalLivingExpenses',   code: 'BLDG',  desc: 'Homeowners Loss Of Use',        type: 'limit' },
    { key: 'legalLiability',             code: 'PERUS', desc: 'Homeowners Personal Liability',  type: 'limit' },
    { key: 'voluntaryMedicalPayments',   code: 'MEDPM', desc: 'Homeowners Medical Payments',    type: 'limit' },
    { key: 'voluntaryPropertyDamage',    code: 'VPDA',  desc: 'Voluntary Property Damage',      type: 'limit' },
    { key: 'sewerBackup',               code: 'RVCS',  desc: 'Sewer Backup',                   type: 'limit' },
  ];

  for (const cov of coverageMap) {
    const covData = coverages[cov.key];
    if (covData && covData.enabled && covData.amount) {
      coveragesXml += habCoverageWithLimit(cov.code, covData.amount, cov.desc);
    }
  }

  // -- QuestionAnswers (line level) --
  let questionAnswersXml = '';
  questionAnswersXml += questionAnswer('23', lossHistory.hasBeenDeclined);
  questionAnswersXml += questionAnswer('56', lossHistory.hasLossesOrClaims);
  if (building.smokers)                    questionAnswersXml += questionAnswer('58', building.smokers);
  if (liability.ownMultipleLocations)      questionAnswersXml += questionAnswer('1',  liability.ownMultipleLocations);
  if (liability.ownTrampoline)             questionAnswersXml += questionAnswer('2',  liability.ownTrampoline);
  if (liability.ownWatercraft)             questionAnswersXml += questionAnswer('35', liability.ownWatercraft);
  if (liability.renewableEnergyInstall)    questionAnswersXml += questionAnswer('59', liability.renewableEnergyInstall);

  // -- Risk address province --
  const riskProvince = riskAddress.province || province;

  // -- Assemble full XML --
  const xml = `<?xml version="1.0"?>
<ACORD xmlns:csio="http://www.CSIO.org/standards/PC_Surety/CSIO1/xml/"
  xmlns="http://www.ACORD.org/standards/PC_Surety/ACORD1/xml/">
  <SignonRq>
    <SessKey>${esc(sessKey)}</SessKey>
    <ClientDt>${esc(now)}</ClientDt>
    <CustLangPref>en</CustLangPref>
    <ClientApp>
      <Org>CSIO</Org>
      <Name>CSIO</Name>
      <Version>2026</Version>
    </ClientApp>
  </SignonRq>
  <InsuranceSvcRq>
    <RqUID>${esc(rqUID)}</RqUID>
    <${rqElementName}>
      <RqUID>${esc(rqUID)}</RqUID>
      <BusinessPurposeTypeCd>csio:NBS</BusinessPurposeTypeCd>
      <ItemIdInfo>
        <InsurerId>${esc(insurer.insurerId)}</InsurerId>
        <OtherIdentifier>
          <OtherIdTypeCd>csio:MachineAddress</OtherIdTypeCd>
          <OtherId>${esc(insurer.insurerId)}</OtherId>
        </OtherIdentifier>
        <OtherIdentifier>
          <OtherIdTypeCd>csio:CsioNetId</OtherIdTypeCd>
          <OtherId>${esc(insurer.csioNetId)}</OtherId>
        </OtherIdentifier>
      </ItemIdInfo>
      <TransactionRequestDt>${esc(now)}</TransactionRequestDt>
      <TransactionEffectiveDt>${esc(effectiveDt)}T${startTime}-05:00</TransactionEffectiveDt>
      <CurCd>CAD</CurCd>
      <Producer>
        <ProducerInfo>
          <ContractNumber>${esc(producerCode)}</ContractNumber>
        </ProducerInfo>
      </Producer>
      <InsuredOrPrincipal>
        <GeneralPartyInfo>
          <NameInfo>
            <PersonName>
              <Surname>${esc(customer.lastName)}</Surname>
              <GivenName>${esc(customer.firstName)}</GivenName>
            </PersonName>
          </NameInfo>
          <Addr>
            <AddrTypeCd>csio:1</AddrTypeCd>
            <Addr1>${esc(customer.address)}</Addr1>
            <City>${esc(customer.city)}</City>
            <StateProvCd>${esc(province)}</StateProvCd>
            <StateProv>${esc(provinceFull)}</StateProv>
            <PostalCode>${esc(customer.postalCode)}</PostalCode>
            <CountryCd>CA</CountryCd>
          </Addr>
          <Communications>
            <PhoneInfo>
              <PhoneTypeCd>Phone</PhoneTypeCd>
              <CommunicationUseCd>Business</CommunicationUseCd>
              <PhoneNumber>${esc(customer.phone)}</PhoneNumber>
            </PhoneInfo>
          </Communications>
        </GeneralPartyInfo>
        <InsuredOrPrincipalInfo>
${roleCds}
          <PersonInfo>
            <BirthDt>${esc(dob)}</BirthDt>
            <LanguageCd>en</LanguageCd>
          </PersonInfo>
        </InsuredOrPrincipalInfo>
      </InsuredOrPrincipal>
      <PersPolicy>
        <PolicyNumber>${esc(policyNumber)}</PolicyNumber>${!isQuote && companysQuoteNumber ? `
        <QuoteInfo>
          <CompanysQuoteNumber>${esc(companysQuoteNumber)}</CompanysQuoteNumber>
        </QuoteInfo>` : ''}
        <LOBCd>csio:HABL</LOBCd>
        <LOBSubCd>csio:${esc(lobSubCd)}</LOBSubCd>
        <ContractTerm>
          <EffectiveDt>${esc(effectiveDt)}</EffectiveDt>
          <ExpirationDt>${esc(expirationDt)}</ExpirationDt>
          <StartTime>${startTime}</StartTime>
        </ContractTerm>
        <BillingMethodCd>csio:${esc(billingMethod)}</BillingMethodCd>
        <LanguageCd>E</LanguageCd>
        <PolicyTermCd>annual</PolicyTermCd>
        <csio:CompanyCd>${esc(insurer.companyCd)}</csio:CompanyCd>
        <PersApplicationInfo>
          <ApplicationWrittenDt>${esc(effectiveDt)}</ApplicationWrittenDt>
        </PersApplicationInfo>
      </PersPolicy>
      <Location id="loc1">
        <Addr>
          <AddrTypeCd>csio:10</AddrTypeCd>
          <Addr1>${esc(riskAddress.address || customer.address)}</Addr1>
          <City>${esc(riskAddress.city || customer.city)}</City>
          <StateProvCd>${esc(riskProvince)}</StateProvCd>
          <PostalCode>${esc(riskAddress.postalCode || customer.postalCode)}</PostalCode>
          <CountryCd>CA</CountryCd>
        </Addr>
      </Location>
      <HomeLineBusiness>
        <LOBCd>csio:HABL</LOBCd>
        <LOBSubCd>csio:${esc(lobSubCd)}</LOBSubCd>
        <Dwell id="dwell1" LocationRef="loc1">
          <PolicyTypeCd>csio:2</PolicyTypeCd>
          <Construction>
            <ConstructionCd>csio:${esc(constructionCd)}</ConstructionCd>
            <YearBuilt>${esc(building.yearBuilt)}</YearBuilt>
            <FoundationCd>csio:${esc(foundationCd)}</FoundationCd>
            <BldgArea>
              <NumUnits>${esc(building.totalLivingArea)}</NumUnits>
              <UnitMeasurementCd>sqft</UnitMeasurementCd>
            </BldgArea>
            <NumStories>${esc(building.numStoreys)}</NumStories>
            <NumUnits>${esc(building.numUnits || '1')}</NumUnits>
            <RoofingMaterial>
              <RoofMaterialCd>csio:${esc(roofMaterialCd)}</RoofMaterialCd>
            </RoofingMaterial>
            <ElectricalPanelCd>csio:${esc(electricalPanelCd)}</ElectricalPanelCd>${electricalStrengthXml}
            <csio:PlumbingInfo>
              <PlumbingLeaksInd>0</PlumbingLeaksInd>
            </csio:PlumbingInfo>
            <csio:ElectricalInfo>
              <WiringTypeCd>csio:${esc(wiringTypeCd)}</WiringTypeCd>
            </csio:ElectricalInfo>
          </Construction>
          <DwellOccupancy>
            <DwellUseCd>csio:${esc(dwellUseCd)}</DwellUseCd>
            <OccupancyTypeCd>csio:${esc(occupancyTypeCd)}</OccupancyTypeCd>
            <ResidenceTypeCd>csio:${esc(residenceTypeCd)}</ResidenceTypeCd>
          </DwellOccupancy>
          <DwellRating>
            <WindClassCd>SWR</WindClassCd>
          </DwellRating>
          <BldgProtection>
            <DistanceToHydrant>
              <NumUnits>${esc(protection.distanceToHydrant || '20')}</NumUnits>
              <UnitMeasurementCd>MTR</UnitMeasurementCd>
            </DistanceToHydrant>
            <ProtectionDeviceSmokeCd>csio:4</ProtectionDeviceSmokeCd>
            <NumSmokeAlarms>${esc(protection.numSmokeDetectors || '1')}</NumSmokeAlarms>
            <csio:FireProtectionCd>${esc(fireProtectionCd)}</csio:FireProtectionCd>
          </BldgProtection>${bldgImprovementsXml}
          <DwellInspectionValuation>
            <EstimatedReplCostAmt>
              <Amt>${esc(coverages.dwellingBuilding?.amount || '0')}</Amt>
              <CurCd>CAD</CurCd>
            </EstimatedReplCostAmt>
            <NumFamilies>${esc(building.numFamilies || '1')}</NumFamilies>
            <GarageInfo>
              <GarageTypeCd>csio:${esc(garageTypeCd)}</GarageTypeCd>
            </GarageInfo>
          </DwellInspectionValuation>${swimmingPoolXml}${heatingXml}${alarmXml}${coveragesXml}
        </Dwell>${questionAnswersXml}
      </HomeLineBusiness>
    </${rqElementName}>
  </InsuranceSvcRq>
</ACORD>`;

  return xml;
}

module.exports = {
  buildHabCsioXml,
};
