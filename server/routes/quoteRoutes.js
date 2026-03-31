const express = require('express');
const router = express.Router();
const mockData = require('../mockData');
const { buildCsioXml, getInsurerConfig, INSURER_CONFIG } = require('../csioTransformer');

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
// POST /api/quote — Request insurance quotes (JSON in / JSON out)
//
// The frontend sends its simplified data model as JSON.
// The server transforms it to CSIO-compliant XML per insurer,
// logs everything, and returns mock results as JSON.
// ────────────────────────────────────────────────────────────────
router.post('/quote', (req, res) => {
  try {
    const body = req.body; // JSON from frontend

    console.log('');
    console.log('═'.repeat(70));
    console.log('[QUOTE] Incoming request from frontend');
    console.log('═'.repeat(70));
    console.log('[QUOTE] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const selectedInsurers = body.selectedInsurers || [];

    // Validate input
    if (!Array.isArray(selectedInsurers) || selectedInsurers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'selectedInsurers must be a non-empty array',
      });
    }

    // ── CSIO XML transformation per insurer ──
    console.log(`[QUOTE] Transforming to CSIO XML for ${selectedInsurers.length} insurer(s)...`);
    console.log('');

    const csioPayloads = [];
    for (const insurerId of selectedInsurers) {
      const config = getInsurerConfig(insurerId);
      if (!config) {
        console.warn(`[QUOTE]   ⚠ Unknown insurer "${insurerId}" — skipping`);
        continue;
      }

      const csioXml = buildCsioXml(body, insurerId, { type: 'quote' });
      csioPayloads.push({ insurerId, xml: csioXml });

      console.log('─'.repeat(70));
      console.log(`[QUOTE] CSIO XML for ${config.name} (${insurerId}):`);
      console.log('─'.repeat(70));
      console.log(csioXml);
      console.log('');
    }

    // Extract deductibles from the first vehicle for mock response
    const firstVehicle = Array.isArray(body.vehicles) && body.vehicles.length > 0 ? body.vehicles[0] : {};
    const reqCompDeductible = firstVehicle.comprehensiveDeductible || '';
    const reqCollDeductible = firstVehicle.collisionDeductible || '';

    // Generate quote ID
    const quoteId = 'QT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    // Filter mock data and apply variations
    const results = selectedInsurers
      .filter((insurerId) => mockData[insurerId])
      .map((insurerId) => {
        const baseData = deepClone(mockData[insurerId]);

        // Apply random variation to premiums
        const annualVariation = addRandomVariation(baseData.premiums.annual);
        const monthlyVariation = Math.round((annualVariation / 12) * 100) / 100;

        baseData.premiums = {
          annual: annualVariation,
          monthly: monthlyVariation,
        };

        // Apply variation to coverage premiums and echo back request deductibles
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

    // Simulate 1.5 second delay to show loading state
    setTimeout(() => {
      const responseObj = {
        success: true,
        quoteId,
        timestamp,
        results,
      };

      console.log('[QUOTE] Sending JSON response to frontend');
      console.log('');

      res.json(responseObj);
    }, 1500);
  } catch (error) {
    console.error('[QUOTE] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ────────────────────────────────────────────────────────────────
// POST /api/bind — Bind a quote (JSON in / JSON out)
//
// The frontend sends simplified JSON. The server transforms to
// CSIO-compliant PersAutoPolicyAddRq XML, logs it, and returns
// a mock bind response.
// ────────────────────────────────────────────────────────────────
router.post('/bind', (req, res) => {
  try {
    const body = req.body; // JSON from frontend

    console.log('');
    console.log('═'.repeat(70));
    console.log('[BIND] Incoming request from frontend');
    console.log('═'.repeat(70));
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

    // ── CSIO XML transformation for bind ──
    // For bind, we use the full quoteData if provided, or build from what we have
    const bindPayload = body.quoteData || body;
    const insurerId = body.insurerId || 'aviva'; // default insurer for bind

    const config = getInsurerConfig(insurerId);
    if (config) {
      const csioXml = buildCsioXml(bindPayload, insurerId, { type: 'bind' });

      console.log('─'.repeat(70));
      console.log(`[BIND] CSIO XML for ${config.name} (PersAutoPolicyAddRq):`);
      console.log('─'.repeat(70));
      console.log(csioXml);
      console.log('');
    }

    // Generate policy number
    const policyNumber = 'POL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    // Simulate 1 second processing delay
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
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
