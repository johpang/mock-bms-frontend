const express = require('express');
const path = require('path');
const router = express.Router();
const mockData = require('../autoMockData');
const { buildCsioXml, getInsurerConfig } = require('../csioTransformer');
const { getHardcodedXml } = require('../csioHelpers');

const TEMPLATES_DIR = path.join(__dirname, '..', 'csio-templates');

// Helper function to add random variation to a premium
function addRandomVariation(premium, variationPercent = 5) {
  const variation = (Math.random() - 0.5) * 2 * (variationPercent / 100);
  return Math.round(premium * (1 + variation) * 100) / 100;
}

// Helper function to deep clone an object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ────────────────────────────────────────────────────────────────
// POST /api/quote - Request insurance quotes (JSON in / JSON out)
//
// Short-circuit: if customer first name is "John" or "Kristen",
// use hardcoded CSIO XML from use case files.
// Otherwise: dynamic mapping via csioTransformer.
// ────────────────────────────────────────────────────────────────
router.post('/quote', (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[QUOTE] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[QUOTE] Received JSON payload:');
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
    const hardcoded = getHardcodedXml(body, 'quote', TEMPLATES_DIR);

    if (hardcoded) {
      console.log(`[QUOTE] Template match: ${hardcoded.label}`);
      console.log('[QUOTE] Using hardcoded CSIO XML template (skipping dynamic mapping)');
      console.log('');

      for (const insurerId of selectedInsurers) {
        const config = getInsurerConfig(insurerId);
        const label = config ? config.name : insurerId;

        console.log('-'.repeat(70));
        console.log(`[QUOTE] Hardcoded CSIO XML for ${label}:`);
        console.log('-'.repeat(70));
        console.log(hardcoded.xml);
        console.log('');
      }
    } else {
      // Dynamic CSIO XML transformation per insurer
      console.log(`[QUOTE] Transforming to CSIO XML for ${selectedInsurers.length} insurer(s) via dynamic mapping...`);
      console.log('');

      for (const insurerId of selectedInsurers) {
        const config = getInsurerConfig(insurerId);
        if (!config) {
          console.warn(`[QUOTE] Unknown insurer "${insurerId}" -- skipping`);
          continue;
        }

        const csioXml = buildCsioXml(body, insurerId, { type: 'quote' });

        console.log('-'.repeat(70));
        console.log(`[QUOTE] CSIO XML for ${config.name} (${insurerId}):`);
        console.log('-'.repeat(70));
        console.log(csioXml);
        console.log('');
      }
    }

    // Mock response (same regardless of hardcoded vs dynamic)
    const firstVehicle = Array.isArray(body.vehicles) && body.vehicles.length > 0 ? body.vehicles[0] : {};
    const reqCompDeductible = firstVehicle.comprehensiveDeductible || '';
    const reqCollDeductible = firstVehicle.collisionDeductible || '';

    const quoteId = 'QT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    const results = selectedInsurers
      .filter((insurerId) => mockData[insurerId])
      .map((insurerId) => {
        const baseData = deepClone(mockData[insurerId]);

        const annualVariation = addRandomVariation(baseData.premiums.annual);
        const monthlyVariation = Math.round((annualVariation / 12) * 100) / 100;
        baseData.premiums = { annual: annualVariation, monthly: monthlyVariation };

        baseData.coverages = baseData.coverages.map((coverage) => {
          let updated = { ...coverage };
          if (coverage.name === 'Collision' && reqCollDeductible) {
            updated.deductible = '$' + Number(reqCollDeductible).toLocaleString();
          }
          if (coverage.name === 'Comprehensive' && reqCompDeductible) {
            updated.deductible = '$' + Number(reqCompDeductible).toLocaleString();
          }
          if (updated.premium > 0) {
            updated.premium = addRandomVariation(updated.premium, 3);
          }
          return updated;
        });

        return baseData;
      });

    console.log(`[QUOTE] Generated quote ID: ${quoteId}`);
    console.log(`[QUOTE] Returning ${results.length} result(s) for: ${results.map((r) => r.insurerName).join(', ')}`);

    setTimeout(() => {
      const responseObj = { success: true, quoteId, timestamp, results };
      console.log('[QUOTE] Sending JSON response to frontend');
      console.log('');
      res.json(responseObj);
    }, 1500);
  } catch (error) {
    console.error('[QUOTE] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────
// POST /api/bind - Bind a quote (JSON in / JSON out)
//
// Same short-circuit logic: John -> UC02, Kristen -> UC04,
// otherwise dynamic mapping via csioTransformer.
// ────────────────────────────────────────────────────────────────
router.post('/bind', (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[BIND] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[BIND] Received JSON payload:');
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
    const hardcoded = getHardcodedXml(body, 'bind', TEMPLATES_DIR);

    if (hardcoded) {
      console.log(`[BIND] Template match: ${hardcoded.label}`);
      console.log('[BIND] Using hardcoded CSIO XML template (skipping dynamic mapping)');
      console.log('');
      console.log('-'.repeat(70));
      console.log(`[BIND] Hardcoded CSIO XML (PersAutoPolicyAddRq):`);
      console.log('-'.repeat(70));
      console.log(hardcoded.xml);
      console.log('');
    } else {
      // Dynamic mapping
      const config = getInsurerConfig(insurerId);
      if (config) {
        const csioXml = buildCsioXml(bindPayload, insurerId, { type: 'bind' });
        console.log('-'.repeat(70));
        console.log(`[BIND] CSIO XML for ${config.name} (PersAutoPolicyAddRq):`);
        console.log('-'.repeat(70));
        console.log(csioXml);
        console.log('');
      }
    }

    const policyNumber = 'POL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    setTimeout(() => {
      const responseObj = {
        success: true,
        policyNumber,
        quoteNumber,
        bindTimestamp: timestamp,
        status: 'BOUND',
        message: 'Policy has been successfully bound.',
      };

      console.log(`[BIND] Policy bound: ${policyNumber} for quote ${quoteNumber}`);
      console.log('[BIND] Sending JSON response to frontend');
      console.log('');
      res.json(responseObj);
    }, 1000);
  } catch (error) {
    console.error('[BIND] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
