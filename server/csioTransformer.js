/**
 * CSIO XML Transformer
 *
 * Transforms the simplified BMS app data model into CSIO-compliant XML
 * based on ACORD-ca v1.50.0 / CSIO XML standard.
 *
 * Quote template: Use Case 01 (PersAutoPolicyQuoteInqRq)
 * Bind template:  Use Case 02 (PersAutoPolicyAddRq)
 *
 * The frontend continues to send its simplified JSON model.
 * This module maps those fields into the full CSIO XML structure,
 * generating UUIDs, timestamps, and other envelope values server-side.
 */

const { uuid, isoNow, dateOnly, addOneYear, esc, randomNumericId } = require('./csioHelpers');
const { INSURER_CONFIG, BILLING_METHOD_MAP, MARITAL_STATUS_MAP, PROVINCE_FULL_NAME } = require('./csioTypecodes');

// -- Coverage XML builders -----------------------------------------------

function coverageWithLimit(code, amount) {
  return `
      <Coverage>
        <CoverageCd>csio:${esc(code)}</CoverageCd>
        <Limit>
          <FormatCurrencyAmt>
            <Amt>${esc(amount)}</Amt>
            <CurCd>CAD</CurCd>
          </FormatCurrencyAmt>
        </Limit>
      </Coverage>`;
}

function coverageWithDeductible(code, amount) {
  return `
      <Coverage>
        <CoverageCd>csio:${esc(code)}</CoverageCd>
        <Deductible>
          <FormatCurrencyAmt>
            <Amt>${esc(amount)}</Amt>
            <CurCd>CAD</CurCd>
          </FormatCurrencyAmt>
        </Deductible>
      </Coverage>`;
}

function coverageNoAmount(code) {
  return `
      <Coverage>
        <CoverageCd>csio:${esc(code)}</CoverageCd>
      </Coverage>`;
}

// -- Main transformer ----------------------------------------------------

/**
 * Builds a CSIO-compliant XML string from the simplified BMS data model.
 *
 * @param {Object} data          - The simplified form data (from frontend JSON)
 * @param {string} insurerId     - App insurer key (e.g. 'aviva', 'intact')
 * @param {Object} options
 * @param {string} options.type  - 'quote' or 'bind'
 * @returns {string}             - Complete CSIO XML string
 */
function buildCsioXml(data, insurerId, options = {}) {
  const type = options.type || 'quote';
  const isQuote = type === 'quote';

  const insurer = INSURER_CONFIG[insurerId] || INSURER_CONFIG.aviva;
  const rqUID = uuid();
  const now = isoNow();
  const sessKey = String(Math.floor(Math.random() * 99999999));

  // -- Extract fields from simplified model --
  const customer = data.customer || {};
  const vehicles = data.vehicles || [];
  const drivers = data.drivers || [];
  const licensing = data.licensing || {};
  const cancellations = data.cancellations || {};

  const effectiveDt = dateOnly(data.policyEffectiveDate || data.policy?.effectiveDate || '');
  const expirationDt = addOneYear(effectiveDt);
  const policyNumber = data.bmsQuoteNumber || data.producer?.bmsQuoteNumber || '10015514A01';
  const producerCode = data.producerCode || data.producer?.code || '0001-01';
  const billingMethod = BILLING_METHOD_MAP[data.billingMethod || data.producer?.billingMethod] || 'P';
  const province = customer.province || 'ON';
  const provinceFull = PROVINCE_FULL_NAME[province] || province;

  const rqElementName = isQuote ? 'PersAutoPolicyQuoteInqRq' : 'PersAutoPolicyAddRq';

  // InsuredOrPrincipalRoleCd differs between quote and bind
  const roleCds = isQuote
    ? '          <InsuredOrPrincipalRoleCd>csio:5</InsuredOrPrincipalRoleCd>'
    : `          <InsuredOrPrincipalRoleCd>csio:999</InsuredOrPrincipalRoleCd>
          <InsuredOrPrincipalRoleCd>csio:5</InsuredOrPrincipalRoleCd>
          <InsuredOrPrincipalRoleCd>csio:999</InsuredOrPrincipalRoleCd>`;

  // Build QuestionAnswer entries from cancellations
  const yesNo = (val) => (val === 'Yes' || val === 'yes' || val === true) ? 'YES' : 'NO';
  const questionAnswers = `
        <QuestionAnswer>
          <QuestionCd>csio:59</QuestionCd>
          <YesNoCd>${yesNo(cancellations.cancelled)}</YesNoCd>
        </QuestionAnswer>
        <QuestionAnswer>
          <QuestionCd>csio:35</QuestionCd>
          <YesNoCd>${yesNo(cancellations.suspended)}</YesNoCd>
        </QuestionAnswer>
        <QuestionAnswer>
          <QuestionCd>csio:23</QuestionCd>
          <YesNoCd>${yesNo(cancellations.withoutCoverage)}</YesNoCd>
        </QuestionAnswer>`;

  // -- Driver and vehicle references --
  const driverRef = 'Driver_' + Math.floor(100000 + Math.random() * 900000);
  const vehRef = 'Veh_' + Math.floor(10000 + Math.random() * 90000);

  const primaryDriver = drivers[0] || {};
  const driverFirstName = primaryDriver.firstName || customer.firstName || '';
  const driverLastName = primaryDriver.lastName || customer.lastName || '';
  const driverGender = (primaryDriver.gender || customer.gender || 'M').charAt(0).toUpperCase();
  const driverDob = dateOnly(customer.dob || customer.dateOfBirth || '1983-08-02');
  const maritalStatus = MARITAL_STATUS_MAP[primaryDriver.maritalStatus] || 'S';
  const licensedDt = dateOnly(licensing.gDate || licensing.g2Date || '2001-01-01');
  const licenseProvince = licensing.province || province;

  // -- Vehicle --
  const veh = vehicles[0] || {};
  const vehMake = veh.make || 'Toyota';
  const vehModel = veh.model || 'Corolla';
  const vehYear = veh.year || '2022';
  const annualKm = veh.distanceDriven?.annually || veh.annualDistance || '12000';
  const oneWayKm = veh.distanceDriven?.inTrip || veh.commuteDistance || '20';

  // -- Coverages --
  const collEnabled = veh.collisionCoverage || veh.coverage?.collisionCoverage;
  const collDeductible = veh.collisionDeductible || veh.coverage?.collisionDeductible || '1000';
  const compEnabled = veh.comprehensiveCoverage || veh.coverage?.comprehensiveCoverage;
  const compDeductible = veh.comprehensiveDeductible || veh.coverage?.comprehensiveDeductible || '1000';

  let coveragesXml = '';
  // Mandatory ON coverages
  coveragesXml += coverageWithLimit('TPPD', '1000000');
  coveragesXml += coverageNoAmount('AB');
  coveragesXml += coverageWithDeductible('TPDC', '0');
  coveragesXml += coverageNoAmount('UA');
  coveragesXml += coverageWithLimit('TPBI', '1000000');

  // Optional coverages
  if (collEnabled) {
    coveragesXml += coverageWithDeductible('COL', collDeductible);
  }
  if (compEnabled) {
    coveragesXml += coverageWithDeductible('CMP', compDeductible);
  }

  // Standard endorsements
  coveragesXml += coverageWithLimit('44', '1000000');
  coveragesXml += coverageWithLimit('20', '25000');
  coveragesXml += coverageWithLimit('27', '75000');

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
      <TransactionEffectiveDt>${esc(effectiveDt)}T00:01:00-05:00</TransactionEffectiveDt>
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
          </Addr>
        </GeneralPartyInfo>
        <InsuredOrPrincipalInfo>
${roleCds}
        </InsuredOrPrincipalInfo>
      </InsuredOrPrincipal>
      <PersPolicy>
        <PolicyNumber>${esc(policyNumber)}</PolicyNumber>
        <LOBCd>csio:AUTO</LOBCd>
        <ControllingStateProvCd>${esc(province)}</ControllingStateProvCd>
        <ContractTerm>
          <EffectiveDt>${esc(effectiveDt)}</EffectiveDt>
          <ExpirationDt>${esc(expirationDt)}</ExpirationDt>
        </ContractTerm>
        <BillingAccountNumber>${esc(policyNumber)}</BillingAccountNumber>
        <BillingMethodCd>csio:${esc(billingMethod)}</BillingMethodCd>
        <LanguageCd>E</LanguageCd>
        <OriginalInceptionDt>${esc(effectiveDt)}</OriginalInceptionDt>
${questionAnswers}
        <PolicyStatusCd>csio:NBS</PolicyStatusCd>
        <csio:CompanyCd>${esc(insurer.companyCd)}</csio:CompanyCd>
        <TransactionSeqNumber>1</TransactionSeqNumber>
        <PersApplicationInfo>
          <NumVehsInHousehold>${vehicles.length || 1}</NumVehsInHousehold>
        </PersApplicationInfo>
        <DriverVeh DriverRef="${esc(driverRef)}" VehRef="${esc(vehRef)}">
          <DriverTypeCd>csio:P</DriverTypeCd>
        </DriverVeh>
      </PersPolicy>
      <PersAutoLineBusiness>
        <LOBCd>csio:AUTO</LOBCd>
        <PersDriver id="${esc(driverRef)}">
          <ItemIdInfo>
            <InsurerId>${randomNumericId(35)}</InsurerId>
            <csio:FixedId>5000</csio:FixedId>
          </ItemIdInfo>
          <GeneralPartyInfo>
            <NameInfo>
              <PersonName>
                <Surname>${esc(driverLastName)}</Surname>
                <GivenName>${esc(driverFirstName)}</GivenName>
              </PersonName>
            </NameInfo>
            <Addr>
              <AddrTypeCd>csio:1</AddrTypeCd>
              <Addr1>${esc(customer.address)}</Addr1>
              <City>${esc(customer.city)}</City>
              <StateProvCd>${esc(province)}</StateProvCd>
              <StateProv>${esc(provinceFull)}</StateProv>
              <PostalCode>${esc(customer.postalCode)}</PostalCode>
            </Addr>
          </GeneralPartyInfo>
          <DriverInfo>
            <PersonInfo>
              <GenderCd>${esc(driverGender)}</GenderCd>
              <BirthDt>${esc(driverDob)}</BirthDt>
              <MaritalStatusCd>csio:${esc(maritalStatus)}</MaritalStatusCd>
              <OccupationClassCd>csio:A08</OccupationClassCd>
            </PersonInfo>
            <License>
              <LicenseStatusCd>csio:1</LicenseStatusCd>
              <LicensedDt>${esc(licensedDt)}</LicensedDt>
              <LicensePermitNumber>S0940-00000-00000</LicensePermitNumber>
              <StateProvCd>${esc(licenseProvince)}</StateProvCd>
            </License>
            <csio:DriverTrainingCd>N</csio:DriverTrainingCd>
          </DriverInfo>
        </PersDriver>
        <PersVeh id="${esc(vehRef)}">
          <csio:PCVEH>
            <Manufacturer>${esc(vehMake)}</Manufacturer>
            <Model>${esc(vehModel)}</Model>
            <ModelYear>${esc(vehYear)}</ModelYear>
            <EstimatedAnnualDistance>
              <NumUnits>${esc(annualKm)}</NumUnits>
              <UnitMeasurementCd>Km</UnitMeasurementCd>
            </EstimatedAnnualDistance>
            <LeasedVehInd>0</LeasedVehInd>
            <NumCylinders>4</NumCylinders>
            <PurchaseDt>${esc(vehYear)}-01-01</PurchaseDt>
            <TerritoryCd>10</TerritoryCd>
            <VehIdentificationNumber>JNRAS08W64X222014</VehIdentificationNumber>
            <PurchasePriceAmt>
              <Amt>35000.00</Amt>
              <CurCd>CAD</CurCd>
            </PurchasePriceAmt>
            <csio:NewUsedCd>2</csio:NewUsedCd>
            <csio:StatisticalLocationCd>401</csio:StatisticalLocationCd>
            <DistanceOneWay>
              <NumUnits>${esc(oneWayKm)}</NumUnits>
              <UnitMeasurementCd>Km</UnitMeasurementCd>
            </DistanceOneWay>
            <EngineTypeCd>csio:3</EngineTypeCd>
            <RateClassCd>11</RateClassCd>
            <csio:WinterTiresInd>1</csio:WinterTiresInd>
          </csio:PCVEH>${coveragesXml}
        </PersVeh>
      </PersAutoLineBusiness>
    </${rqElementName}>
  </InsuranceSvcRq>
</ACORD>`;

  return xml;
}

/**
 * Returns the insurer config for a given app insurer ID.
 * @param {string} insurerId
 * @returns {Object|null}
 */
function getInsurerConfig(insurerId) {
  return INSURER_CONFIG[insurerId] || null;
}

module.exports = {
  buildCsioXml,
  getInsurerConfig,
  INSURER_CONFIG,
};
