const express = require('express');
const path = require('path');
const router = express.Router();
const commlMockData = require('../commlMockData');
const { getInsurerConfig } = require('../csioTransformer');
const { getHardcodedXml } = require('../csioHelpers');
const { buildCommlCsioXml } = require('../csioCommlTransformer');

const TEMPLATES_DIR = path.join(__dirname, '..', 'csio-templates');

function addRandomVariation(premium, pct = 5) {
  const v = (Math.random() - 0.5) * 2 * (pct / 100);
  return Math.round(premium * (1 + v) * 100) / 100;
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ----------------------------------------------------------------
// POST /api/comml/quote - Request commercial quotes (JSON in / JSON out)
//
// Priority:
//   1. Hardcoded CSIO XML template (if quote ID matches templateConfig.json)
//   2. Dynamic CSIO XML mapping (buildCommlCsioXml)
//
// In both cases the frontend receives the same mock JSON response.
// The CSIO XML is logged to the server console for inspection.
// ----------------------------------------------------------------
router.post('/quote', (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[COMML QUOTE] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[COMML QUOTE] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const selectedInsurers = body.selectedInsurers || [];

    if (!Array.isArray(selectedInsurers) || selectedInsurers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'selectedInsurers must be a non-empty array',
      });
    }

    // Check for hardcoded persona
    const hardcoded = getHardcodedXml(body, 'commlQuote', TEMPLATES_DIR);

    if (hardcoded) {
      console.log(`[COMML QUOTE] Template match: ${hardcoded.label}`);
      console.log('[COMML QUOTE] Using hardcoded CSIO XML template (skipping dynamic mapping)');
      console.log('');

      for (const insurerId of selectedInsurers) {
        const config = getInsurerConfig(insurerId);
        const label = config ? config.name : insurerId;

        console.log('-'.repeat(70));
        console.log(`[COMML QUOTE] Hardcoded CSIO XML for ${label}:`);
        console.log('-'.repeat(70));
        console.log(hardcoded.xml);
        console.log('');
      }
    } else {
      // Dynamic CSIO XML transformation
      console.log('[COMML QUOTE] No template match — using dynamic CSIO XML mapping');
      console.log('');

      for (const insurerId of selectedInsurers) {
        const config = getInsurerConfig(insurerId);
        const label = config ? config.name : insurerId;

        try {
          const xml = buildCommlCsioXml(body, insurerId, { type: 'quote' });

          console.log('-'.repeat(70));
          console.log(`[COMML QUOTE] Dynamic CSIO XML for ${label} (CommlPkgPolicyQuoteInqRq):`);
          console.log('-'.repeat(70));
          console.log(xml);
          console.log('');
        } catch (xmlErr) {
          console.error(`[COMML QUOTE] XML generation error for ${label}:`, xmlErr.message);
        }
      }
    }

    // Mock response (same regardless of template vs dynamic)
    const quoteId = 'CQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    const results = selectedInsurers
      .filter((id) => commlMockData[id])
      .map((id) => {
        const base = deepClone(commlMockData[id]);
        const annualVar = addRandomVariation(base.premiums.annual);
        base.premiums = { annual: annualVar, monthly: Math.round((annualVar / 12) * 100) / 100 };
        base.coverages = base.coverages.map((c) => {
          if (c.premium > 0) return { ...c, premium: addRandomVariation(c.premium, 3) };
          return { ...c };
        });
        return base;
      });

    console.log(`[COMML QUOTE] Generated quote ID: ${quoteId}`);
    console.log(`[COMML QUOTE] Returning ${results.length} result(s) for: ${results.map((r) => r.insurerName).join(', ')}`);

    setTimeout(() => {
      const responseObj = { success: true, quoteId, timestamp, results };
      console.log('[COMML QUOTE] Sending JSON response to frontend');
      console.log('');
      res.json(responseObj);
    }, 1500);
  } catch (error) {
    console.error('[COMML QUOTE] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------
// POST /api/comml/bind - Bind a commercial quote (JSON in / JSON out)
//
// Priority:
//   1. Hardcoded CSIO XML template (if quote ID matches templateConfig.json)
//   2. Dynamic CSIO XML mapping (buildCommlCsioXml with type='bind')
// ----------------------------------------------------------------
router.post('/bind', (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[COMML BIND] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[COMML BIND] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const quoteNumber = body.quoteNumber || body.referenceNumber || '';

    if (!quoteNumber) {
      return res.status(400).json({
        success: false,
        error: 'quoteNumber is required',
      });
    }

    const bindPayload = body.quoteData || body;
    const insurerId = body.insurerId || 'aviva';

    // Check for hardcoded persona
    const hardcoded = getHardcodedXml(body, 'commlBind', TEMPLATES_DIR);

    if (hardcoded) {
      console.log(`[COMML BIND] Template match: ${hardcoded.label}`);
      console.log('[COMML BIND] Using hardcoded CSIO XML template (skipping dynamic mapping)');
      console.log('');
      console.log('-'.repeat(70));
      console.log(`[COMML BIND] Hardcoded CSIO XML (CommlPkgPolicyAddRq):`);
      console.log('-'.repeat(70));
      console.log(hardcoded.xml);
      console.log('');
    } else {
      // Dynamic CSIO XML transformation
      console.log('[COMML BIND] No template match — using dynamic CSIO XML mapping');
      console.log('');

      try {
        const xml = buildCommlCsioXml(bindPayload, insurerId, { type: 'bind' });

        console.log('-'.repeat(70));
        console.log(`[COMML BIND] Dynamic CSIO XML (CommlPkgPolicyAddRq):`);
        console.log('-'.repeat(70));
        console.log(xml);
        console.log('');
      } catch (xmlErr) {
        console.error('[COMML BIND] XML generation error:', xmlErr.message);
      }
    }

    const policyNumber = 'CPOL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    setTimeout(() => {
      const responseObj = {
        success: true,
        policyNumber,
        quoteNumber,
        bindTimestamp: timestamp,
        status: 'BOUND',
        message: 'Commercial policy has been successfully bound.',
      };

      console.log(`[COMML BIND] Policy bound: ${policyNumber} for quote ${quoteNumber}`);
      console.log('[COMML BIND] Sending JSON response to frontend');
      console.log('');
      res.json(responseObj);
    }, 1000);
  } catch (error) {
    console.error('[COMML BIND] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
