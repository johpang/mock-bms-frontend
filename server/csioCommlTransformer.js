/**
 * CSIO Commercial Lines XML Transformer
 *
 * Transforms the simplified BMS commercial data model into CSIO-compliant XML
 * based on ACORD-ca v1.50.0 / CSIO XML standard.
 *
 * Quote template: CommlPkgPolicyQuoteInqRq
 * Bind template:  CommlPkgPolicyAddRq
 *
 * The frontend sends its simplified JSON model (see commlRequestSchema.js).
 * This module maps those fields into the full CSIO XML structure,
 * generating UUIDs, timestamps, and other envelope values server-side.
 *
 * Field mapping follows: CSIO-Comml-Field-Mapping.xlsx
 */

const { uuid, isoNow, dateOnly, addOneYear, esc } = require('./csioHelpers');
const {
  INSURER_CONFIG,
  BILLING_METHOD_MAP,
  COMML_ALARM_MAP,
  COMML_CONSTRUCTION_MAP,
  COMML_PAYMENT_METHOD_MAP,
} = require('./csioTypecodes');

// ── Helper: Yes/No normaliser ──────────────────────────────
function yesNo(val) {
  if (val === true || val === 'Yes' || val === 'yes' || val === 'YES') return 'YES';
  return 'NO';
}

// ── Helper: build a single QuestionAnswer XML block ────────
/**
 * Builds a QuestionAnswer XML block.
 * @param {string} code   - CSIO question code (e.g. '59', '422')
 * @param {*}      value  - Yes/No/true/false
 * @param {number} indent - Number of leading spaces (default 16 = 4 levels)
 */
function questionAnswer(code, value, indent = 16) {
  const pad = ' '.repeat(indent);
  return `\n${pad}<QuestionAnswer>\n${pad}    <QuestionCd>csio:${esc(code)}</QuestionCd>\n${pad}    <YesNoCd>${yesNo(value)}</YesNoCd>\n${pad}</QuestionAnswer>`;
}

// ── Helper: build a CommlCoverage XML block ────────────────
function commlCoverage(id, code, desc, limit) {
  let xml = `
                        <CommlCoverage id="${esc(id)}">
                            <CoverageCd>csio:${esc(code)}</CoverageCd>
                            <CoverageDesc>${esc(desc)}</CoverageDesc>`;
  if (limit) {
    xml += `
                            <Limit>
                                <FormatInteger>${esc(limit)}</FormatInteger>
                            </Limit>`;
  }
  xml += `
                        </CommlCoverage>`;
  return xml;
}

// ── Main transformer ───────────────────────────────────────

/**
 * Builds a CSIO-compliant XML string for commercial lines
 * from the simplified BMS data model.
 *
 * @param {Object} data          - The simplified form data (from frontend JSON)
 * @param {string} insurerId     - App insurer key (e.g. 'aviva', 'intact')
 * @param {Object} options
 * @param {string} options.type  - 'quote' or 'bind'
 * @returns {string}             - Complete CSIO XML string
 */
function buildCommlCsioXml(data, insurerId, options = {}) {
  const type = options.type || 'quote';
  const isQuote = type === 'quote';
  const companysQuoteNumber = options.companysQuoteNumber || '';

  const insurer = INSURER_CONFIG[insurerId] || INSURER_CONFIG.aviva;
  const rqUID = uuid();
  const innerRqUID = uuid();
  const now = isoNow();
  const sessKey = String(Math.floor(Math.random() * 99999999));

  // ── Extract fields from simplified model ──────────────────

  const account    = data.account || {};
  const business   = data.business || {};
  const questions  = data.questions || {};
  const location   = data.location || {};
  const building   = data.building || {};
  const protection = building.protection || {};
  const improvements = building.improvements || {};
  const coverages  = building.coverages || {};
  const operations = business.operations || [];

  const producerCode   = data.producerCode || '11111';
  const policyNumber   = data.bmsQuoteNumber || 'COMML-10001';
  const billingMethod  = BILLING_METHOD_MAP[data.billingMethod] || 'P';
  const language       = data.language || 'en';
  const effectiveDt    = dateOnly(data.policyEffectiveDate || '');
  const expirationDt   = dateOnly(data.policyExpiryDate || '') || addOneYear(effectiveDt);

  // Payment method (frontend stores as 'csio:EF', 'csio:CD', etc.)
  const paymentMethodRaw = data.paymentMethod || '';
  const paymentMethodCd  = COMML_PAYMENT_METHOD_MAP[paymentMethodRaw] || paymentMethodRaw.replace('csio:', '') || 'EF';

  // Request element name differs between quote and bind
  const rqElementName = isQuote ? 'CommlPkgPolicyQuoteInqRq' : 'CommlPkgPolicyAddRq';

  // ── BusinessInfo blocks (one per IBC operation) ───────────

  let businessInfoXml = '';
  if (operations.length > 0) {
    operations.forEach((op, idx) => {
      if (op.ibcCode) {
        businessInfoXml += `
                    <BusinessInfo id="business-info-${idx + 1}">
                        <BusinessStartDt>${esc(dateOnly(business.startDate))}</BusinessStartDt>
                        <csio:IBCIndustryCd>${esc(op.ibcCode)}</csio:IBCIndustryCd>
                        <NumYrsExperience>${esc(business.yearsExperience)}</NumYrsExperience>
                    </BusinessInfo>`;
      }
    });
  } else {
    // Fallback: single empty BusinessInfo
    businessInfoXml = `
                    <BusinessInfo id="business-info-1">
                        <BusinessStartDt>${esc(dateOnly(business.startDate))}</BusinessStartDt>
                        <NumYrsExperience>${esc(business.yearsExperience)}</NumYrsExperience>
                    </BusinessInfo>`;
  }

  // ── CommlPolicySupplement (revenue data) ──────────────────

  const annualRevenue = business.annualRevenue || '0';
  const totalRevenue  = business.totalRevenue || annualRevenue;

  // Reference the first business-info for the subsidiary link
  const commlPolicySupplement = `
                <CommlPolicySupplement>
                    <CommlParentOrSubsidiaryInfo id="comml-parent-subsidiary-1"
                        IdRef="business-info-1">
                        <AnnualGrossReceiptsAmt>
                            <Amt>${esc(annualRevenue)}</Amt>
                        </AnnualGrossReceiptsAmt>
                        <ForeignGrossSalesAmt>
                            <Amt>0</Amt>
                        </ForeignGrossSalesAmt>
                    </CommlParentOrSubsidiaryInfo>
                    <AnnualSalesAmt>
                        <Amt>${esc(totalRevenue)}</Amt>
                    </AnnualSalesAmt>
                </CommlPolicySupplement>`;

  // ── Policy-level QuestionAnswers ──────────────────────────
  //  csio:59 = Insurance cancelled/non-renewed in last 5 years
  //  csio:23 = Claims in the last 5 years

  const policyQuestionAnswers =
    questionAnswer('23', questions.claimsLast5Years, 16) +
    questionAnswer('59', questions.insuranceCancelled, 16);

  // ── Location Address ──────────────────────────────────────
  // Use account address as location address (same building in mockup)

  const locAddr1    = account.address || '';
  const locCity     = account.city || '';
  const locProvince = account.province || 'ON';
  const locPostal   = account.postalCode || '';

  // ── CommlSubLocation: Construction ────────────────────────

  const yearBuilt       = location.yearBuilt || '';
  const numStories      = location.numStories || '1';
  const constructionCd  = COMML_CONSTRUCTION_MAP[location.buildingType] || '2';
  const areaOccupied    = questions.sqftOccupied || location.areaOccupied || '';
  const numEmployees    = location.numEmployees || '';

  // ── Building Improvements ─────────────────────────────────

  let bldgImprovementsXml = '';
  if (improvements.heating || improvements.plumbing || improvements.roof || improvements.electrical) {
    bldgImprovementsXml = `
                <BldgImprovements>`;
    if (improvements.heating)    bldgImprovementsXml += `\n                    <HeatingImprovementYear>${esc(improvements.heating)}</HeatingImprovementYear>`;
    if (improvements.plumbing)   bldgImprovementsXml += `\n                    <PlumbingImprovementYear>${esc(improvements.plumbing)}</PlumbingImprovementYear>`;
    if (improvements.roof)       bldgImprovementsXml += `\n                    <RoofingImprovementYear>${esc(improvements.roof)}</RoofingImprovementYear>`;
    if (improvements.electrical) bldgImprovementsXml += `\n                    <WiringImprovementYear>${esc(improvements.electrical)}</WiringImprovementYear>`;
    bldgImprovementsXml += `
                </BldgImprovements>`;
  }

  // ── Building Protection ───────────────────────────────────

  const sprinklered   = protection.sprinklered === '1' || protection.sprinklered === true ? '1' : '0';
  const fireProtCd    = protection.fireProtection || 'Unprotected';

  const bldgProtectionXml = `
                <BldgProtection>
                    <csio:SprinkleredInd>${sprinklered}</csio:SprinkleredInd>
                    <csio:FireProtectionCd>${esc(fireProtCd)}</csio:FireProtectionCd>
                </BldgProtection>`;

  // ── Building Occupancy ────────────────────────────────────

  const bldgOccupancyXml = `
                <BldgOccupancy id="building-occ-1">
                    <AreaOccupied>
                        <NumUnits>${esc(areaOccupied)}</NumUnits>
                        <UnitMeasurementCd>FTK</UnitMeasurementCd>
                    </AreaOccupied>
                    <OccupancyCd>csio:11</OccupancyCd>
                </BldgOccupancy>`;

  // ── Alarm and Security ────────────────────────────────────
  // Emit AlarmAndSecurity blocks for burglar and fire alarms if not "None"

  let alarmXml = '';
  const burglarAlarmCd = COMML_ALARM_MAP[protection.burglarAlarm] || null;
  const fireAlarmCd    = COMML_ALARM_MAP[protection.fireAlarm] || null;

  if (burglarAlarmCd) {
    alarmXml += `
                <AlarmAndSecurity id="alarm-burglar">
                    <AlarmDescCd>csio:${esc(burglarAlarmCd)}</AlarmDescCd>
                    <AlarmDesc>Burglar Alarm</AlarmDesc>
                </AlarmAndSecurity>`;
  }
  if (fireAlarmCd) {
    alarmXml += `
                <AlarmAndSecurity id="alarm-fire">
                    <AlarmDescCd>csio:${esc(fireAlarmCd)}</AlarmDescCd>
                    <AlarmDesc>Fire Alarm</AlarmDesc>
                </AlarmAndSecurity>`;
  }

  // ── Mortgage holder ───────────────────────────────────────

  const mortgageHolder = data.mortgageHolder || '';
  const numMortgages   = mortgageHolder ? '1' : '0';

  // ── Commercial Property Line of Business ──────────────────
  // Build CPROP coverages based on frontend selections

  let cpropCoveragesXml = '';
  let covIdx = 1;

  // Building coverage
  if (coverages.buildingCov === 'Yes' || coverages.buildingCov === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'BLDG', 'Building',
      coverages.buildingLimit || null
    );
  }

  // Equipment coverage
  if (coverages.equipmentCov === 'Yes' || coverages.equipmentCov === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'Equipment', 'Equipment',
      coverages.equipmentLimit || null
    );
  }

  // Stock / Contents
  if (coverages.stockCov === 'Yes' || coverages.stockCov === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'STCK', 'Stock', null
    );
  }
  if (coverages.contentsCov === 'Yes' || coverages.contentsCov === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'CNTS', 'Contents', null
    );
  }

  // Sewer Backup
  if (coverages.sewerBackup === 'Yes' || coverages.sewerBackup === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'RVCS', 'Sewer Backup',
      coverages.sewerBackupLimit || null
    );
  }

  // Flood
  if (coverages.flood === 'Yes' || coverages.flood === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'FLD', 'Flood', null
    );
  }

  // Earthquake
  if (coverages.earthquake === 'Yes' || coverages.earthquake === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'EQ', 'Earthquake', null
    );
  }

  // Contractor Equipment (policy-level additional coverage mapped to CPROP)
  if (coverages.contractorEquipment === 'Yes' || coverages.contractorEquipment === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'EQFL', 'Contractor Equipment', null
    );
  }

  // Tool Floater
  if (coverages.toolFloater === 'Yes' || coverages.toolFloater === true) {
    cpropCoveragesXml += commlCoverage(
      `location-1-comml-coverage-${covIdx++}`,
      'TLFL', 'Tool Floater', null
    );
  }

  // Always include Business Income and Equipment Breakdown as baseline coverages
  cpropCoveragesXml += commlCoverage(
    `location-1-comml-coverage-${covIdx++}`,
    'BIALS', 'Business Income', null
  );
  cpropCoveragesXml += commlCoverage(
    `location-1-comml-coverage-${covIdx++}`,
    'EquipmentBreakdown', 'Equipment Breakdown', null
  );

  // ── General Liability Line of Business ────────────────────

  let glXml = '';
  if (coverages.cgl === 'Yes' || coverages.cgl === true) {
    const cglLimit = coverages.cglLimit || '';

    // GL-level QuestionAnswers from the UC-011 template
    // These are hardcoded GL underwriting questions as per CSIO spec;
    // the frontend only captures undergroundWork (csio:422).
    // The rest default to NO as per the template pattern.
    // GL underwriting questions indented at 24 spaces (6 levels deep)
    const glIndent = 24;
    const glQuestionAnswers =
      questionAnswer('422', questions.undergroundWork, glIndent) +    // Any underground work?
      questionAnswer('464', 'No', glIndent) +   // Exterior insulation finish system?
      questionAnswer('463', 'No', glIndent) +   // Any work on dams/bridges/tunnels?
      questionAnswer('845', 'No', glIndent) +   // Environmental cleanup?
      questionAnswer('423', 'No', glIndent) +   // Professional services?
      questionAnswer('550', 'No', glIndent) +   // Products completed ops?
      questionAnswer('453', 'No', glIndent) +   // Blasting operations?
      questionAnswer('400', 'No', glIndent) +   // Asbestos removal?
      questionAnswer('202', 'No', glIndent) +   // Structural alterations?
      questionAnswer('205', 'No', glIndent);    // Work in USA?

    let cglLimitXml = '';
    if (cglLimit) {
      cglLimitXml = `
                    <CommlCoverage id="gl-cgl-limit">
                        <CoverageCd>csio:CGL</CoverageCd>
                        <CoverageDesc>Commercial General Liability</CoverageDesc>
                        <Limit>
                            <FormatInteger>${esc(cglLimit)}</FormatInteger>
                        </Limit>
                    </CommlCoverage>`;
    }

    glXml = `
            <GeneralLiabilityLineBusiness id="general-liability-1">
                <LOBCd>csio:GL</LOBCd>${cglLimitXml}
                <LiabilityInfo>
                    <ContractorsUnderwritingQuestions id="busop-questions-1" IdRef="business-info-1">
                        <SubcontractedWorkPct>0</SubcontractedWorkPct>${glQuestionAnswers}
                        <ResidentialPct>0</ResidentialPct>
                        <CommlPct>100</CommlPct>
                        <csio:IndustrialPct>0</csio:IndustrialPct>
                        <csio:InstitutionalPct>0</csio:InstitutionalPct>
                        <csio:NumEmployeesPremise>${esc(numEmployees)}</csio:NumEmployeesPremise>
                    </ContractorsUnderwritingQuestions>
                </LiabilityInfo>
            </GeneralLiabilityLineBusiness>`;
  }

  // ── Assemble full XML ─────────────────────────────────────

  const xml = `<?xml version="1.0"?>
<ACORD xmlns="http://www.ACORD.org/standards/PC_Surety/ACORD1/xml/"
    xmlns:csio="http://www.CSIO.org/standards/PC_Surety/CSIO1/xml/">
    <SignonRq>
        <SessKey>${esc(sessKey)}</SessKey>
        <ClientDt>${esc(now)}</ClientDt>
        <CustLangPref>${esc(language)}</CustLangPref>
        <ClientApp>
            <Org>CSIO</Org>
            <Name>CSIO</Name>
            <Version>2026</Version>
        </ClientApp>
    </SignonRq>
    <InsuranceSvcRq>
        <RqUID>${esc(rqUID)}</RqUID>
        <${rqElementName}>
            <RqUID>${esc(innerRqUID)}</RqUID>
            <TransactionRequestDt>${esc(now)}</TransactionRequestDt>
            <CurCd>CAD</CurCd>
            <Producer id="producer-1">
                <ProducerInfo>
                    <ContractNumber>${esc(producerCode)}</ContractNumber>
                </ProducerInfo>
            </Producer>
            <InsuredOrPrincipal id="insured-1">
                <ItemIdInfo>
                    <AgencyId>TEST00001</AgencyId>
                    <InsurerId>${esc(insurer.insurerId)}</InsurerId>
                </ItemIdInfo>
                <GeneralPartyInfo>
                    <NameInfo>
                        <CommlName id="account-name-1">
                            <CommercialName>${esc(account.commercialName)}</CommercialName>
                        </CommlName>
                        <SupplementaryNameInfo id="supplementary-name-info-1">
                            <SupplementaryNameCd>csio:DBA</SupplementaryNameCd>
                            <SupplementaryName>${esc(account.dbaName)}</SupplementaryName>
                        </SupplementaryNameInfo>
                    </NameInfo>
                    <Addr id="account-address-1">
                        <Addr1>${esc(account.address)}</Addr1>
                        <City>${esc(account.city)}</City>
                        <StateProvCd>${esc(account.province)}</StateProvCd>
                        <PostalCode>${esc(account.postalCode)}</PostalCode>
                        <CountryCd>${esc(account.country || 'CA')}</CountryCd>
                    </Addr>
                    <Communications>
                        <EmailInfo id="account-email-1">
                            <EmailAddr>${esc(account.email)}</EmailAddr>
                        </EmailInfo>
                        <WebsiteInfo id="account-website-1">
                            <WebsiteURL>${esc(account.website)}</WebsiteURL>
                        </WebsiteInfo>
                    </Communications>
                </GeneralPartyInfo>
                <InsuredOrPrincipalInfo>${businessInfoXml}
                </InsuredOrPrincipalInfo>
            </InsuredOrPrincipal>
            <CommlPolicy>${!isQuote && companysQuoteNumber ? `
                <QuoteInfo>
                    <CompanysQuoteNumber>${esc(companysQuoteNumber)}</CompanysQuoteNumber>
                </QuoteInfo>` : ''}
                <LOBCd>csio:PACK</LOBCd>
                <ContractTerm>
                    <EffectiveDt>${esc(effectiveDt)}</EffectiveDt>
                    <ExpirationDt>${esc(expirationDt)}</ExpirationDt>
                </ContractTerm>
                <BillingAccountNumber>${esc(policyNumber)}</BillingAccountNumber>
                <BillingMethodCd>csio:${esc(billingMethod)}</BillingMethodCd>
                <LanguageCd>${esc(language)}</LanguageCd>
                <PaymentOption>
                    <MethodPaymentCd>csio:${esc(paymentMethodCd)}</MethodPaymentCd>
                </PaymentOption>${policyQuestionAnswers}
                <csio:CompanyCd>${esc(insurer.companyCd)}</csio:CompanyCd>${commlPolicySupplement}
            </CommlPolicy>
            <Location id="location-1">
                <ItemIdInfo>
                    <AgencyId>1</AgencyId>
                    <InsurerId>${esc(insurer.insurerId)}</InsurerId>
                </ItemIdInfo>
                <Addr id="location-address-1">
                    <Addr1>${esc(locAddr1)}</Addr1>
                    <City>${esc(locCity)}</City>
                    <StateProvCd>${esc(locProvince)}</StateProvCd>
                    <PostalCode>${esc(locPostal)}</PostalCode>
                    <CountryCd>CA</CountryCd>
                </Addr>
            </Location>
            <CommlSubLocation id="comml-sub-location-1" LocationRef="location-1">
                <InterestCd>csio:TN</InterestCd>
                <Construction>
                    <YearBuilt>${esc(yearBuilt)}</YearBuilt>
                    <NumStories>${esc(numStories)}</NumStories>
                    <csio:BldgConstructionCd>${esc(constructionCd)}</csio:BldgConstructionCd>
                </Construction>${bldgImprovementsXml}${bldgProtectionXml}${bldgOccupancyXml}${alarmXml}
                <csio:NumMortgages>${numMortgages}</csio:NumMortgages>
            </CommlSubLocation>
            <CommlPropertyLineBusiness>
                <LOBCd>csio:CPROP</LOBCd>
                <PropertyInfo>
                    <CommlPropertyInfo LocationRef="location-1">${cpropCoveragesXml}
                    </CommlPropertyInfo>
                </PropertyInfo>
            </CommlPropertyLineBusiness>${glXml}
        </${rqElementName}>
    </InsuranceSvcRq>
</ACORD>`;

  return xml;
}

module.exports = {
  buildCommlCsioXml,
};
