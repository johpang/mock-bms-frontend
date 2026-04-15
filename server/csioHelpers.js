/**
 * CSIO Helper Functions
 *
 * Reusable utility functions for CSIO XML generation.
 * Used by csioTransformer.js and available for other modules.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generates a new UUID v4 string.
 * @returns {string}
 */
function uuid() {
  return crypto.randomUUID();
}

/**
 * Returns the current timestamp in ISO format with the correct Eastern offset,
 * accounting for Daylight Saving Time (EDT = -04:00, EST = -05:00).
 * @returns {string}
 */
function isoNow() {
  const now = new Date();
  // Determine Eastern offset by checking Jan 1 (always EST) vs current
  const janOffset = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const curOffset = now.getTimezoneOffset();
  const isDST = curOffset < janOffset;
  const offsetStr = isDST ? '-04:00' : '-05:00';
  return now.toISOString().replace('Z', offsetStr);
}

/**
 * Extracts the date portion (YYYY-MM-DD) from a date string.
 * @param {string} dateStr
 * @returns {string}
 */
function dateOnly(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toISOString().split('T')[0];
}

/**
 * Adds one year to a date string.
 * @param {string} dateStr
 * @returns {string}
 */
function addOneYear(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

/**
 * Escapes special XML characters in a string.
 * @param {*} str
 * @returns {string}
 */
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Generates a random numeric string of the given length.
 * Safe for XML (no scientific notation).
 * @param {number} length
 * @returns {string}
 */
function randomNumericId(length = 35) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

/**
 * Loads a hardcoded XML template by matching the request's ID field
 * against templateConfig.json entries.
 *
 * The ID comes from the saved quote JSON (e.g. "SC-001", "UC-006").
 * For quote requests, body.id is checked directly.
 * For bind requests, body.quoteData.id is also checked.
 *
 * If an insurerId is provided, the template's <csio:CompanyCd> value
 * is replaced with the correct companyCd from INSURER_CONFIG.
 *
 * For bind requests, if body.companysQuoteNumber is present, a
 * <QuoteInfo><CompanysQuoteNumber> block is injected into the
 * policy element (<PersPolicy> or <CommlPolicy>).
 *
 * @param {Object} body - The request body
 * @param {string} type - 'quote', 'bind', 'habQuote', or 'habBind'
 * @param {string} templatesDir - Absolute path to the templates directory
 * @param {string} [insurerId] - Optional insurer key (e.g. 'aviva') to inject correct CompanyCd
 * @returns {{ xml: string, label: string } | null}
 */
function getHardcodedXml(body, type, templatesDir, insurerId) {
  const configPath = path.join(templatesDir, 'templateConfig.json');
  if (!fs.existsSync(configPath)) return null;

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const id = body.id || body.quoteData?.id || '';
  if (!id) return null;

  const entry = config.templates?.[id];
  if (!entry) return null;

  const templateFile = entry[type];
  if (!templateFile) return null;

  const templatePath = path.join(templatesDir, templateFile);
  if (!fs.existsSync(templatePath)) {
    console.warn(`[csioHelpers] Template file not found: ${templatePath}`);
    return null;
  }

  let xml = fs.readFileSync(templatePath, 'utf-8');

  // Swap CompanyCd to match the selected insurer
  if (insurerId) {
    const { INSURER_CONFIG } = require('./csioTypecodes');
    const insurer = INSURER_CONFIG[insurerId];
    if (insurer && insurer.companyCd) {
      xml = xml.replace(/<csio:CompanyCd>[^<]*<\/csio:CompanyCd>/, `<csio:CompanyCd>${insurer.companyCd}</csio:CompanyCd>`);
      console.log(`[csioHelpers] Replaced CompanyCd with ${insurer.companyCd} for ${insurerId}`);
    }
  }

  // Inject CompanysQuoteNumber for bind requests
  const companysQuoteNumber = body.companysQuoteNumber || '';
  if (companysQuoteNumber && type.toLowerCase().includes('bind')) {
    const quoteInfoBlock = `\n        <QuoteInfo>\n          <CompanysQuoteNumber>${esc(companysQuoteNumber)}</CompanysQuoteNumber>\n        </QuoteInfo>`;
    // Insert after <PersPolicy> or <CommlPolicy> opening tag
    if (xml.includes('<CommlPolicy>')) {
      xml = xml.replace('<CommlPolicy>', `<CommlPolicy>${quoteInfoBlock}`);
    } else if (xml.includes('<PersPolicy>')) {
      xml = xml.replace('<PersPolicy>', `<PersPolicy>${quoteInfoBlock}`);
    }
    console.log(`[csioHelpers] Injected CompanysQuoteNumber: ${companysQuoteNumber}`);
  }

  return { xml, label: id };
}

module.exports = { uuid, isoNow, dateOnly, addOneYear, esc, randomNumericId, getHardcodedXml };