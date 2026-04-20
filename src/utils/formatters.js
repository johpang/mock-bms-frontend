/**
 * Formatter Utilities
 * Provides display formatting functions for various data types
 */

import React from 'react';

/**
 * Formats a value as currency (CAD).
 * Accepts numbers, numeric strings, or pre-formatted strings like "$1,000".
 * Returns empty string for null, undefined, empty string, 0, or "0".
 *
 * @param {number|string} amount - The amount to format
 * @param {Object} [options]
 * @param {boolean} [options.showZero=false] - If true, format 0 as "$0.00" instead of blank
 * @param {boolean} [options.noDecimals=false] - If true, strip decimal places (e.g., "$1,234")
 * @returns {string} Formatted currency string (e.g., "$1,234.56") or ""
 */
export function formatCurrency(amount, options = {}) {
  // Blank for null/undefined/empty
  if (amount === null || amount === undefined || amount === '') {
    return '';
  }

  // If it's already a formatted string starting with "$", return as-is
  if (typeof amount === 'string' && amount.startsWith('$')) {
    return amount;
  }

  // Try to parse string values (strip commas first)
  let numeric = amount;
  if (typeof amount === 'string') {
    numeric = Number(amount.replace(/,/g, ''));
  }

  // If not a valid number, return blank
  if (typeof numeric !== 'number' || isNaN(numeric)) {
    return '';
  }

  // Blank for zero unless explicitly requested
  if (numeric === 0 && !options.showZero) {
    return '';
  }

  const fractionDigits = options.noDecimals ? 0 : 2;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric);
}

/**
 * Splits a string into plain text + <a> elements for any http(s) URLs found.
 * Used to render bind-message links as clickable anchors.
 *
 * @param {string} text
 * @returns {Array<string|React.ReactElement>}
 */
export function linkifyText(text) {
  if (!text) return [text];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const url = match[0];
    parts.push(
      React.createElement(
        'a',
        { key: key++, href: url, rel: 'noopener noreferrer', style: { color: '#2a5298', textDecoration: 'underline' } },
        url,
      ),
    );
    lastIndex = match.index + url.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/**
 * Formats a user-typed monetary amount (limits, deductibles) for display.
 * Strips "$" and "," so inputs like "$25,000" or "25,000" still render cleanly.
 * Falls back to the raw string prefixed with "$" if the value can't be parsed,
 * instead of rendering "$NaN".
 *
 * @param {string|number} value
 * @returns {string} e.g. "$25,000", or "" for empty input
 */
export function formatAmountInput(value) {
  if (value === null || value === undefined || value === '') return '';
  const cleaned = String(value).replace(/[$,\s]/g, '');
  const n = Number(cleaned);
  if (Number.isFinite(n)) return `$${n.toLocaleString()}`;
  return `$${value}`;
}

/**
 * Formats a phone number to (XXX) XXX-XXXX format
 * @param {string} value - The phone number to format (digits only or with formatting)
 * @returns {string} Formatted phone number
 */
export function formatPhone(value) {
  if (!value) {
    return '';
  }

  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Handle 10-digit or 11-digit (with country code)
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11) {
    // Remove leading 1 if present
    const phoneDigits = digits.startsWith('1') ? digits.slice(1) : digits;
    return `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
  }

  // Return original value if format doesn't match
  return value;
}

/**
 * Formats a postal code to X1X 1X1 format
 * @param {string} value - The postal code to format
 * @returns {string} Formatted postal code
 */
export function formatPostalCode(value) {
  if (!value) {
    return '';
  }

  // Remove spaces and convert to uppercase
  const cleaned = value.replace(/\s/g, '').toUpperCase();

  // Format as X1X 1X1 if it has 6 characters
  if (cleaned.length >= 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  }

  return cleaned;
}

/**
 * Formats a date string to a readable format
 * Accepts YYYY-MM-DD format and returns "Month DD, YYYY"
 * @param {string} dateString - The date string to format (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "March 30, 2024")
 */
export function formatDate(dateString) {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
