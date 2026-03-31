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
 * Returns the current timestamp in ISO format with EST offset.
 * @returns {string}
 */
function isoNow() {
  return new Date().toISOString().replace('Z', '-05:00');
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
 * Loads a hardcoded XML template for a demo persona if the customer
 * first name matches a known persona.
 *
 * @param {Object} body - The request body containing customer info
 * @param {string} type - 'quote' or 'bind'
 * @param {string} templatesDir - Absolute path to the templates directory
 * @returns {{ xml: string, label: string } | null}
 */
function getHardcodedXml(body, type, templatesDir) {
  const configPath = path.join(templatesDir, 'templateConfig.json');
  if (!fs.existsSync(configPath)) return null;

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const firstName = (body.customer?.firstName || '').trim().toLowerCase();
  const persona = config.personas?.[firstName];
  if (!persona) return null;

  const fileName = persona[type];
  if (!fileName) return null;

  const filePath = path.join(templatesDir, fileName);
  if (!fs.existsSync(filePath)) return null;

  return {
    xml: fs.readFileSync(filePath, 'utf-8'),
    label: persona.label,
  };
}

module.exports = {
  uuid,
  isoNow,
  dateOnly,
  addOneYear,
  esc,
  randomNumericId,
  getHardcodedXml,
};
