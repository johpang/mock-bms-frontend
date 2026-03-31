const express = require('express');
const router = express.Router();
const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const habMockData = require('../habMockData');

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name) =>
    ['selectedInsurer', 'coverage', 'message', 'result'].includes(name),
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false, format: true, suppressEmptyNode: false,
});

function parseRequestBody(req) {
  if (typeof req.body === 'string') {
    const parsed = xmlParser.parse(req.body);
    const rootKey = Object.keys(parsed).find((k) => k !== '?xml');
    return rootKey ? parsed[rootKey] : parsed;
  }
  return req.body;
}

function wrapArraysForXml(obj) {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(wrapArraysForXml);
  const arrayChildNames = {
    results: 'result', coverages: 'coverage', underwritingMessages: 'message',
    selectedInsurers: 'insurer',
  };
  const out = {};
  for (const [key, val] of Object.entries(obj)) {
    if (Array.isArray(val) && arrayChildNames[key]) {
      out[key] = { [arrayChildNames[key]]: val.map(wrapArraysForXml) };
    } else if (typeof val === 'object' && val !== null) {
      out[key] = wrapArraysForXml(val);
    } else {
      out[key] = val;
    }
  }
  return out;
}

function buildXmlResponse(rootTag, obj) {
  const wrapped = { [rootTag]: wrapArraysForXml(obj) };
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlBuilder.build(wrapped);
}

function addRandomVariation(premium, pct = 5) {
  const v = (Math.random() - 0.5) * 2 * (pct / 100);
  return Math.round(premium * (1 + v) * 100) / 100;
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function ensureArray(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

// POST /api/hab/quote
router.post('/quote', (req, res) => {
  try {
    const body = parseRequestBody(req);

    let selectedInsurers = body.selectedInsurers;
    if (selectedInsurers && !Array.isArray(selectedInsurers)) {
      selectedInsurers = ensureArray(selectedInsurers.selectedInsurer || selectedInsurers.insurer || selectedInsurers);
    }
    if (Array.isArray(selectedInsurers) && selectedInsurers.length > 0 && typeof selectedInsurers[0] === 'object') {
      selectedInsurers = selectedInsurers.flatMap((item) => ensureArray(item.selectedInsurer || item.insurer || item));
    }

    console.log('[Hab Quote Request - XML]');
    console.log('  Timestamp:', new Date().toISOString());
    console.log('  Selected Insurers:', selectedInsurers || []);

    if (!selectedInsurers || !Array.isArray(selectedInsurers) || selectedInsurers.length === 0) {
      res.set('Content-Type', 'application/xml');
      return res.status(400).send(buildXmlResponse('habQuoteResponse', { success: false, error: 'selectedInsurers must be a non-empty array' }));
    }

    const quoteId = 'HQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    const results = selectedInsurers
      .filter((id) => habMockData[id])
      .map((id) => {
        const base = deepClone(habMockData[id]);
        const annualVar = addRandomVariation(base.premiums.annual);
        base.premiums = { annual: annualVar, monthly: Math.round((annualVar / 12) * 100) / 100 };
        base.coverages = base.coverages.map((c) => {
          if (c.premium > 0) c.premium = addRandomVariation(c.premium, 3);
          return c;
        });
        return base;
      });

    console.log('  Quote ID:', quoteId);
    console.log('  Results Count:', results.length);

    setTimeout(() => {
      res.set('Content-Type', 'application/xml');
      res.send(buildXmlResponse('habQuoteResponse', {
        success: true, quoteId, timestamp, results: results,
      }));
    }, 1500);
  } catch (error) {
    console.error('[Hab Quote Error]', error);
    res.set('Content-Type', 'application/xml');
    res.status(500).send(buildXmlResponse('habQuoteResponse', { success: false, error: error.message }));
  }
});

module.exports = router;
