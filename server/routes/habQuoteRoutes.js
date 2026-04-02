const express = require('express');
const path = require('path');
const router = express.Router();
const habMockData = require('../habMockData');
const { buildHabCsioXml } = require('../csioHabTransformer');
const { getInsurerConfig } = require('../csioTransformer');
const { getHardcodedXml } = require('../csioHelpers');

const TEMPLATES_DIR = path.join(__dirname, '..', 'csio-templates');

function addRandomVariation(premium, pct = 5) {
  const v = (Math.random() - 0.5) * 2 * (pct / 100);
  return Math.round(premium * (1 + v) * 100) / 100;
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ----------------------------------------------------------------
// POST /api/hab/quote - Request habitational quotes (JSON in / JSON out)
//
// Short-circuit: if customer first name matches a known hab persona,
// use hardcoded CSIO XML from template files.
// Otherwise: dynamic mapping via csioHabTransformer.
// ----------------------------------------------------------------
router.post('/quote', (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[HAB QUOTE] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[HAB QUOTE] Received JSON payload:');
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
    const hardcoded = getHardcodedXml(body, 'habQuote', TEMPLATES_DIR);

    if (hardcoded) {
      console.log(`[HAB QUOTE] Demo persona detected: ${hardcoded.label}`);
      console.log('[HAB QUOTE] Using hardcoded CSIO XML template (skipping dynamic mapping)');
      console.log('');

      for (const insurerId of selectedInsurers) {
        const config = getInsurerConfig(insurerId);
        const label = config ? config.name : insurerId;

        console.log('-'.repeat(70));
        console.log(`[HAB QUOTE] Hardcoded CSIO XML for ${label}:`);
        console.log('-'.repeat(70));
        console.log(hardcoded.xml);
        console.log('');
      }
    } else {
      // Dynamic CSIO XML transformation per insurer
      console.log(`[HAB QUOTE] Transforming to CSIO XML for ${selectedInsurers.length} insurer(s) via dynamic mapping...`);
      console.log('');

      for (const insurerId of selectedInsurers) {
        const config = getInsurerConfig(insurerId);
        if (!config) {
          console.warn(`[HAB QUOTE] Unknown insurer "${insurerId}" -- skipping`);
          continue;
        }

        const csioXml = buildHabCsioXml(body, insurerId, { type: 'quote' });

        console.log('-'.repeat(70));
        console.log(`[HAB QUOTE] CSIO XML for ${config.name} (${insurerId}):`);
        console.log('-'.repeat(70));
        console.log(csioXml);
        console.log('');
      }
    }

    // Mock response
    const quoteId = 'HQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    const results = selectedInsurers
      .filter((id) => habMockData[id])
      .map((id) => {
        const base = deepClone(habMockData[id]);
        const annualVar = addRandomVariation(base.premiums.annual);
        base.premiums = { annual: annualVar, monthly: Math.round((annualVar / 12) * 100) / 100 };
        base.coverages = base.coverages.map((c) => {
          if (c.premium > 0) return { ...c, premium: addRandomVariation(c.premium, 3) };
          return { ...c };
        });
        return base;
      });

    console.log(`[HAB QUOTE] Generated quote ID: ${quoteId}`);
    console.log(`[HAB QUOTE] Returning ${results.length} result(s) for: ${results.map((r) => r.insurerName).join(', ')}`);

    setTimeout(() => {
      const responseObj = { success: true, quoteId, timestamp, results };
      console.log('[HAB QUOTE] Sending JSON response to frontend');
      console.log('');
      res.json(responseObj);
    }, 1500);
  } catch (error) {
    console.error('[HAB QUOTE] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------
// POST /api/hab/bind - Bind a hab quote (JSON in / JSON out)
//
// Same short-circuit logic for hardcoded personas,
// otherwise dynamic mapping via csioHabTransformer.
// ----------------------------------------------------------------
router.post('/bind', (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[HAB BIND] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[HAB BIND] Received JSON payload:');
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
    const hardcoded = getHardcodedXml(bindPayload, 'habBind', TEMPLATES_DIR);

    if (hardcoded) {
      console.log(`[HAB BIND] Demo persona detected: ${hardcoded.label}`);
      console.log('[HAB BIND] Using hardcoded CSIO XML template (skipping dynamic mapping)');
      console.log('');
      console.log('-'.repeat(70));
      console.log(`[HAB BIND] Hardcoded CSIO XML (HomePolicyAddRq):`);
      console.log('-'.repeat(70));
      console.log(hardcoded.xml);
      console.log('');
    } else {
      // Dynamic mapping
      const config = getInsurerConfig(insurerId);
      if (config) {
        const csioXml = buildHabCsioXml(bindPayload, insurerId, { type: 'bind' });
        console.log('-'.repeat(70));
        console.log(`[HAB BIND] CSIO XML for ${config.name} (HomePolicyAddRq):`);
        console.log('-'.repeat(70));
        console.log(csioXml);
        console.log('');
      }
    }

    const policyNumber = 'HPOL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    setTimeout(() => {
      const responseObj = {
        success: true,
        policyNumber,
        quoteNumber,
        bindTimestamp: timestamp,
        status: 'BOUND',
        message: 'Habitational policy has been successfully bound.',
      };

      console.log(`[HAB BIND] Policy bound: ${policyNumber} for quote ${quoteNumber}`);
      console.log('[HAB BIND] Sending JSON response to frontend');
      console.log('');
      res.json(responseObj);
    }, 1000);
  } catch (error) {
    console.error('[HAB BIND] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
