/**
 * CSIO XML Response Parser
 *
 * Parses CSIO-compliant XML responses (ACORD-ca v1.50.0) into the
 * simplified JSON structure the BMS frontend expects.
 *
 * Architecture:
 *   parseCsioXml(xmlString)           — generic XML → JS object (reusable)
 *   parseAutoQuoteResponse(xml, ctx)  — auto quote screen mapping
 *   parseAutoBindResponse(xml, ctx)   — auto bind screen mapping
 *   parseHabQuoteResponse(xml, ctx)   — hab quote (future)
 *   parseCommlQuoteResponse(xml, ctx) — commercial quote (future)
 *
 * Each screen-specific function returns the shape the UI already renders.
 */

const { XMLParser } = require('fast-xml-parser');

// ── Generic XML ingestion ──────────────────────────────────────

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,        // strip csio: / acord: namespace prefixes
  parseTagValue: true,          // auto-cast numbers where possible
  isArray: (name) => {
    // Force these to always be arrays even when there's only one element
    const alwaysArray = [
      'Coverage', 'PersDriver', 'PersVeh', 'DriverVeh',
      'QuestionAnswer', 'Message', 'ExtendedStatus',
      'PropertyLineBusiness', 'HomeLineBusiness',
      'CommlCoverage', 'CommlSubLocation',
    ];
    return alwaysArray.includes(name);
  },
};

/**
 * Parses a CSIO XML string into a plain JS object.
 * This is the reusable ingestion layer — all screen-specific
 * parsers build on top of it.
 *
 * @param {string} xmlString - Raw CSIO XML response
 * @returns {{ parsed: Object, raw: string }} Parsed object + original XML
 */
function parseCsioXml(xmlString) {
  if (!xmlString || typeof xmlString !== 'string' || xmlString.trim().length === 0) {
    console.warn('[ResponseParser] Empty or non-string XML received');
    return { parsed: null, raw: xmlString };
  }

  const parser = new XMLParser(parserOptions);
  let parsed = parser.parse(xmlString);

  console.log('[ResponseParser] Parsed XML root keys:', Object.keys(parsed));

  // Handle double-wrapped ACORD responses (outer transport envelope)
  // Some upstream APIs return: <ACORD><InsuranceSvcRs><ACORD>...actual content...</ACORD></InsuranceSvcRs></ACORD>
  const innerAcord = parsed?.ACORD?.InsuranceSvcRs?.ACORD;
  if (innerAcord) {
    console.log('[ResponseParser] Detected double-wrapped ACORD envelope — unwrapping');
    parsed = { ACORD: innerAcord };
  }

  return { parsed, raw: xmlString };
}

// ── Safe navigation helpers ────────────────────────────────────

/** Safely walk a dot-separated path. Returns undefined on any miss. */
function get(obj, path, fallback) {
  const val = path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  return val !== undefined ? val : fallback;
}

/** Coerce to array (handles single-element vs array inconsistencies). */
function toArray(val) {
  if (val === undefined || val === null) return [];
  return Array.isArray(val) ? val : [val];
}

/**
 * Recursively collect every <Coverage> element from an object tree.
 * Walks all keys looking for "Coverage" arrays/objects at any depth.
 * This handles all LOBs — auto (PersVeh > Coverage), hab (HomeLineBusiness > Coverage),
 * and commercial (CommlPropertyLineBusiness > Coverage).
 */
function collectAllCoverages(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 10) return [];
  let result = [];

  // If this node itself has a Coverage key, collect it
  if (obj.Coverage) {
    result = result.concat(toArray(obj.Coverage));
  }
  // Also check CommlCoverage for commercial lines
  if (obj.CommlCoverage) {
    result = result.concat(toArray(obj.CommlCoverage));
  }

  // Recurse into child objects/arrays to find nested Coverage elements
  // (e.g., PersVeh, HomeLineBusiness, PropertyLineBusiness, etc.)
  for (const key of Object.keys(obj)) {
    if (key === 'Coverage' || key === 'CommlCoverage') continue; // already collected
    const child = obj[key];
    if (Array.isArray(child)) {
      child.forEach((item) => {
        if (item && typeof item === 'object') {
          result = result.concat(collectAllCoverages(item, depth + 1));
        }
      });
    } else if (child && typeof child === 'object') {
      result = result.concat(collectAllCoverages(child, depth + 1));
    }
  }

  return result;
}

/** Pull a numeric amount from a CSIO FormatCurrencyAmt node. */
function currencyAmt(node) {
  if (!node) return 0;
  const amt = get(node, 'FormatCurrencyAmt.Amt') || get(node, 'Amt');
  return typeof amt === 'number' ? amt : parseFloat(amt) || 0;
}

// ── Auto Quote Response Parser ─────────────────────────────────

/**
 * Parses a PersAutoPolicyQuoteInqRs XML response into the JSON shape
 * that QuoteComparisonPage and PremiumBreakdownPage expect.
 *
 * @param {string} xmlString   - Raw CSIO XML response from the insurer
 * @param {Object} ctx         - Contextual info
 * @param {string} ctx.insurerId   - Internal insurer key (e.g. 'aviva')
 * @param {string} ctx.insurerName - Display name (e.g. 'Aviva')
 * @param {Object} ctx.requestData - Original request payload for fallbacks
 * @returns {Object} Shape matching autoMockResponses.js structure
 */
function parseAutoQuoteResponse(xmlString, ctx = {}) {
  const { parsed } = parseCsioXml(xmlString);

  // Navigate to the response element
  // Could be PersAutoPolicyQuoteInqRs or nested under InsuranceSvcRs
  const acord = parsed?.ACORD || parsed;
  const svcRs = acord?.InsuranceSvcRs || acord;
  const rs = svcRs?.PersAutoPolicyQuoteInqRs
    || svcRs?.PersAutoPolicyAddRs
    || svcRs;

  // ── Extract status / messages ──
  const msgStatus = get(rs, 'MsgStatus') || {};
  const msgStatusCd = get(msgStatus, 'MsgStatusCd') || '';
  const extendedStatuses = toArray(get(msgStatus, 'ExtendedStatus'));
  const messages = extendedStatuses
    .map((es) => get(es, 'ExtendedStatusDesc') || get(es, 'ExtendedStatusCd') || '')
    .filter(Boolean);

  // Also collect <Message> elements if present
  const messageNodes = toArray(get(rs, 'Message'));
  messageNodes.forEach((m) => {
    const desc = get(m, 'MessageText') || get(m, 'Description') || '';
    if (desc) messages.push(desc);
  });

  // ── Policy-level data ──
  const persPolicy = get(rs, 'PersPolicy') || {};
  const policyNumber = get(persPolicy, 'PolicyNumber') || '';
  const contractTerm = get(persPolicy, 'ContractTerm') || {};
  const effectiveDt = get(contractTerm, 'EffectiveDt') || '';

  // CompanysQuoteNumber — saved from quote response to forward into bind request
  // Try multiple paths as XML structure varies between insurers
  const companysQuoteNumber = get(persPolicy, 'QuoteInfo.CompanysQuoteNumber')
    || get(persPolicy, 'CompanysQuoteNumber')
    || get(rs, 'QuoteInfo.CompanysQuoteNumber')
    || get(rs, 'CompanysQuoteNumber')
    || '';

  // Reference number: prefer CompanysQuoteNumber, then PolicyNumber, RqUID, fallback
  const referenceNumber = companysQuoteNumber
    || policyNumber
    || get(rs, 'RqUID')
    || String(Math.floor(Math.random() * 900000 + 100000));

  // ── Premium ──
  const autoLine = get(rs, 'PersAutoLineBusiness') || {};
  // Sum every //Coverage/CurrentTermAmt in the response tree.
  const allCoverages = collectAllCoverages(rs);
  let annualPremium = Math.round(
    allCoverages.reduce((sum, cov) => sum + currencyAmt(get(cov, 'CurrentTermAmt')), 0) * 100
  ) / 100;

  if (annualPremium > 0) {
    console.log(`[ResponseParser] Premium from Coverage/CurrentTermAmt sum: $${annualPremium} (${allCoverages.length} coverages found)`);
  }

  // Fallback: generate a plausible demo value
  if (!annualPremium) {
    annualPremium = 1800 + Math.round(Math.random() * 400);
    console.log(`[ResponseParser] No premium found in XML — using generated demo value: $${annualPremium}`);
  }

  // Vehicle refs for vehicle summary (lightweight, no coverage extraction)
  const persVehs = toArray(get(autoLine, 'PersVeh'));

  const monthlyPremium = Math.round((annualPremium / 12) * 100) / 100;

  // ── Vehicle summary ──
  let vehicleSummary = '';
  const reqVehicles = ctx.requestData?.vehicles || [];
  if (reqVehicles.length > 0) {
    const v = reqVehicles[0];
    vehicleSummary = `${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim();
  }
  if (!vehicleSummary) {
    // Try from the XML response
    const firstVeh = persVehs[0];
    const pcveh = get(firstVeh, 'PCVEH') || firstVeh || {};
    vehicleSummary = `${get(pcveh, 'ModelYear') || ''} ${get(pcveh, 'Manufacturer') || ''} ${get(pcveh, 'Model') || ''}`.trim();
  }

  // ── Territory ──
  const territory = get(persPolicy, 'TerritoryCd')
    || (() => {
      const firstVeh = persVehs[0];
      const pcveh = get(firstVeh, 'PCVEH') || firstVeh || {};
      return get(pcveh, 'TerritoryCd');
    })()
    || 0;

  // ── Format effective date ──
  let formattedDate = '';
  if (effectiveDt) {
    try {
      const [datePart] = String(effectiveDt).split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      formattedDate = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
      formattedDate = effectiveDt;
    }
  }

  // ── Hardcoded display values (same as mock responses) ──
  // Only the total premium comes from the real XML response.
  // Everything else is hardcoded to match the demo UI.
  const hardcodedCoverageCodes = [
    { code: 42, label: 'DCPD' },
    { code: 11, label: 'Ab' },
    { code: 45, label: 'Coll' },
    { code: 45, label: 'Comp' },
  ];

  const hardcodedUnderwritingMessages = [
    'Vehicle: Vehicle # 1: The purchase date of the winter tires has been defaulted to the effective date of the policy.',
    'Coverages have been amended based on availability. Please review.',
  ];

  const bipdLimit = ctx.requestData?.bipdLimit || '';
  const bipdDisplay = bipdLimit ? Number(bipdLimit).toLocaleString() : '1,000,000';

  const hardcodedCoverages = [
    { name: 'Bodily Injury Property Damage', coverageAmount: bipdDisplay, deductible: '', premium: 576 },
    { name: 'Direct Compensation', coverageAmount: '', deductible: '', premium: 231 },
    { name: 'Accident Benefits', coverageAmount: '', deductible: '', premium: 435 },
    { name: 'Collision', coverageAmount: '', deductible: '$1,000', premium: 356 },
    { name: 'Comprehensive', coverageAmount: '', deductible: '$1,000', premium: 354 },
    { name: 'Uninsured Automobile', coverageAmount: '', deductible: '', premium: 21 },
    { name: 'Liability to non-owned vehicles', coverageAmount: '', deductible: '', premium: 0 },
  ];

  const result = {
    insurerName: ctx.insurerName || ctx.insurerId || 'Insurer',
    insurerId: ctx.insurerId || '',
    referenceNumber,
    companysQuoteNumber,
    type: 'New Business',
    premiums: {
      annual: Math.round(annualPremium * 100) / 100,
      monthly: monthlyPremium,
    },
    effectiveDate: formattedDate || get(ctx, 'requestData.policyEffectiveDate') || '',
    territory: 9,
    coverageCodes: hardcodedCoverageCodes,
    underwritingMessages: messages.length > 0 ? messages : hardcodedUnderwritingMessages,
    vehicleSummary,
    coverages: hardcodedCoverages,
    // Include raw XML status for debugging
    _xmlStatus: msgStatusCd,
    _xmlRaw: xmlString,
  };

  console.log('[ResponseParser] Parsed auto quote result:', {
    insurer: result.insurerName,
    refNo: result.referenceNumber,
    companysQuoteNumber: result.companysQuoteNumber || '(none)',
    annual: result.premiums.annual,
    monthly: result.premiums.monthly,
    messageCount: result.underwritingMessages.length,
    xmlStatus: msgStatusCd,
  });

  return result;
}

// ── Auto Bind Response Parser ──────────────────────────────────

/**
 * Parses a PersAutoPolicyAddRs response for the bind confirmation screen.
 *
 * @param {string} xmlString   - Raw CSIO XML response
 * @param {Object} ctx         - Contextual info
 * @returns {Object} Bind result object
 */
function parseAutoBindResponse(xmlString, ctx = {}) {
  const { parsed } = parseCsioXml(xmlString);

  const acord = parsed?.ACORD || parsed;
  const svcRs = acord?.InsuranceSvcRs || acord;
  const rs = svcRs?.PersAutoPolicyAddRs || svcRs;

  const msgStatus = get(rs, 'MsgStatus') || {};
  const msgStatusCd = get(msgStatus, 'MsgStatusCd') || '';
  const success = msgStatusCd === 'Success' || msgStatusCd === '';

  const persPolicy = get(rs, 'PersPolicy') || {};
  const policyNumber = get(persPolicy, 'PolicyNumber') || '';

  return {
    success,
    policyNumber: policyNumber || 'POL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    quoteNumber: ctx.quoteNumber || '',
    bindTimestamp: new Date().toISOString(),
    status: success ? 'BOUND' : 'FAILED',
    message: success ? 'Policy has been successfully bound.' : `Bind failed: ${msgStatusCd}`,
    _xmlStatus: msgStatusCd,
  };
}

// ── Hab / Commercial stubs (future) ────────────────────────────

function parseHabQuoteResponse(xmlString, ctx = {}) {
  const { parsed } = parseCsioXml(xmlString);

  const acord = parsed?.ACORD || parsed;
  const svcRs = acord?.InsuranceSvcRs || acord;
  const rs = svcRs?.HomeOwnerPolicyQuoteInqRs
    || svcRs?.HomePolicyQuoteInqRs
    || svcRs?.HomeOwnerPolicyAddRs
    || svcRs?.HomePolicyAddRs
    || svcRs;

  // ── Status / messages ──
  const msgStatus = get(rs, 'MsgStatus') || {};
  const msgStatusCd = get(msgStatus, 'MsgStatusCd') || '';
  const extendedStatuses = toArray(get(msgStatus, 'ExtendedStatus'));
  const messages = extendedStatuses
    .map((es) => get(es, 'ExtendedStatusDesc') || get(es, 'ExtendedStatusCd') || '')
    .filter(Boolean);
  const messageNodes = toArray(get(rs, 'Message'));
  messageNodes.forEach((m) => {
    const desc = get(m, 'MessageText') || get(m, 'Description') || '';
    if (desc) messages.push(desc);
  });

  // ── Policy-level data ──
  const persPolicy = get(rs, 'PersPolicy') || {};
  const policyNumber = get(persPolicy, 'PolicyNumber') || '';
  const contractTerm = get(persPolicy, 'ContractTerm') || {};
  const effectiveDt = get(contractTerm, 'EffectiveDt') || '';
  // Try multiple paths — hab responses may nest under HomeLineBusiness or PersPolicy
  const companysQuoteNumber = get(persPolicy, 'QuoteInfo.CompanysQuoteNumber')
    || get(persPolicy, 'CompanysQuoteNumber')
    || get(rs, 'QuoteInfo.CompanysQuoteNumber')
    || get(rs, 'CompanysQuoteNumber')
    || '';
  console.log('[ResponseParser/Hab] CompanysQuoteNumber extracted:', companysQuoteNumber || '(none)');

  const referenceNumber = companysQuoteNumber
    || policyNumber
    || get(rs, 'RqUID')
    || String(Math.floor(Math.random() * 900000 + 100000));

  // ── Premium ──
  const allCoverages = collectAllCoverages(rs);
  let annualPremium = Math.round(
    allCoverages.reduce((sum, cov) => sum + currencyAmt(get(cov, 'CurrentTermAmt')), 0) * 100
  ) / 100;

  if (!annualPremium) {
    annualPremium = 1800 + Math.round(Math.random() * 400);
    console.log(`[ResponseParser/Hab] No premium found in XML — using generated demo value: $${annualPremium}`);
  }
  const monthlyPremium = Math.round((annualPremium / 12) * 100) / 100;

  // ── Format effective date ──
  let formattedDate = '';
  if (effectiveDt) {
    try {
      const [datePart] = String(effectiveDt).split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      formattedDate = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
      formattedDate = effectiveDt;
    }
  }

  // ── Hab-specific hardcoded coverages ──
  const hardcodedCoverages = [
    { name: 'Residence', deductible: '', amount: '', premium: annualPremium },
    { name: 'Guaranteed Replacement Cost', deductible: '', amount: 'Included', premium: 0 },
    { name: 'Outbuildings', deductible: '', amount: 'Included', premium: 0 },
    { name: 'Personal Property', deductible: '$1,000', amount: '$75,000', premium: 0 },
    { name: 'Legal Liability', deductible: '', amount: 'Included', premium: 0 },
    { name: 'Voluntary Medical Payments', deductible: '', amount: 'Included', premium: 0 },
    { name: 'Voluntary Property Damage', deductible: '', amount: 'Included', premium: 0 },
    { name: 'Sewer Back-Up & Overland Water', deductible: '$1,000', amount: '$25,000', premium: 320 },
  ];

  const hardcodedUnderwritingMessages = [
    'Dwelling: The minimum threshold premiums have been met.',
    'Credit factor applied to the quote.',
    'Coverages have been amended based on availability. Please review.',
  ];

  const result = {
    insurerName: ctx.insurerName || ctx.insurerId || 'Insurer',
    insurerId: ctx.insurerId || '',
    referenceNumber,
    companysQuoteNumber,
    type: 'New Business',
    premiums: {
      annual: Math.round(annualPremium * 100) / 100,
      monthly: monthlyPremium,
    },
    effectiveDate: formattedDate || get(ctx, 'requestData.policyEffectiveDate') || '',
    propertyAddress: get(ctx, 'requestData.property.address') || '',
    riskType: 'Primary -- Homeowners',
    underwritingMessages: messages.length > 0 ? messages : hardcodedUnderwritingMessages,
    coverages: hardcodedCoverages,
    _xmlStatus: msgStatusCd,
    _xmlRaw: xmlString,
  };

  console.log('[ResponseParser/Hab] Parsed hab quote result:', {
    insurer: result.insurerName,
    refNo: result.referenceNumber,
    companysQuoteNumber: result.companysQuoteNumber || '(none)',
    annual: result.premiums.annual,
    xmlStatus: msgStatusCd,
  });

  return result;
}

function parseHabBindResponse(xmlString, ctx = {}) {
  return parseAutoBindResponse(xmlString, ctx);
}

function parseCommlQuoteResponse(xmlString, ctx = {}) {
  // First get the standard auto-shape result (hardcoded display + premium)
  const result = parseAutoQuoteResponse(xmlString, ctx);

  // Override CompanysQuoteNumber from CommlPolicy xpath if present
  const { parsed } = parseCsioXml(xmlString);
  if (parsed) {
    const acord = parsed?.ACORD || parsed;
    const svcRs = acord?.InsuranceSvcRs || acord;
    const rs = svcRs?.CommlPkgPolicyQuoteInqRs || svcRs?.CommlPkgPolicyAddRs || svcRs;
    const commlPolicy = get(rs, 'CommlPolicy') || {};
    const commlQuoteNum = get(commlPolicy, 'QuoteInfo.CompanysQuoteNumber')
      || get(commlPolicy, 'CompanysQuoteNumber')
      || get(rs, 'QuoteInfo.CompanysQuoteNumber')
      || get(rs, 'CompanysQuoteNumber')
      || '';
    console.log('[ResponseParser/Comml] CompanysQuoteNumber extracted:', commlQuoteNum || '(none)');
    if (commlQuoteNum) {
      result.companysQuoteNumber = commlQuoteNum;
      result.referenceNumber = commlQuoteNum;
    }

    // Re-extract real upstream messages so we can apply the comml-specific
    // fallback list when the response carried no <ExtendedStatus> / <Message>
    // elements (parseAutoQuoteResponse would otherwise leave the auto fallback).
    const msgStatus = get(rs, 'MsgStatus') || {};
    const realMessages = toArray(get(msgStatus, 'ExtendedStatus'))
      .map((es) => get(es, 'ExtendedStatusDesc') || get(es, 'ExtendedStatusCd') || '')
      .filter(Boolean);
    toArray(get(rs, 'Message')).forEach((m) => {
      const desc = get(m, 'MessageText') || get(m, 'Description') || '';
      if (desc) realMessages.push(desc);
    });
    if (realMessages.length === 0) {
      result.underwritingMessages = [
        'Coverages have been amended based on availability. Please review.',
      ];
    }
  }

  console.log('[ResponseParser/Comml] Final comml quote result:', {
    insurer: result.insurerName,
    refNo: result.referenceNumber,
    companysQuoteNumber: result.companysQuoteNumber || '(none)',
    annual: result.premiums.annual,
  });

  return result;
}

function parseCommlBindResponse(xmlString, ctx = {}) {
  return parseAutoBindResponse(xmlString, ctx);
}

module.exports = {
  parseCsioXml,
  parseAutoQuoteResponse,
  parseAutoBindResponse,
  parseHabQuoteResponse,
  parseHabBindResponse,
  parseCommlQuoteResponse,
  parseCommlBindResponse,
};
