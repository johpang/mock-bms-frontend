/**
 * Proxy Routes
 *
 * Accepts JSON from the frontend, transforms to CSIO-compliant XML,
 * then forwards to the real AWS API endpoints.
 *
 * Short-circuit: if customer first name is "John" or "Kristen",
 * use hardcoded CSIO XML from use case files instead of dynamic mapping.
 */

const express = require('express');
const path = require('path');
const router = express.Router();
const { getAuthHeaders } = require('../authService');
const serverConfig = require('../serverConfig');
const { buildCsioXml, getInsurerConfig } = require('../csioTransformer');
const { buildHabCsioXml } = require('../csioHabTransformer');
const { getHardcodedXml } = require('../csioHelpers');

const TEMPLATES_DIR = path.join(__dirname, '..', 'csio-templates');

/**
 * Forwards CSIO XML to an upstream URL and returns the response.
 */
async function forwardXml(upstreamUrl, csioXml, insurerLabel) {
  const headers = await getAuthHeaders();

  console.log(`[Proxy] Forwarding CSIO XML for ${insurerLabel} -> ${upstreamUrl}`);

  const upstreamResponse = await fetch(upstreamUrl, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/xml',
    },
    body: csioXml,
  });

  const responseBody = await upstreamResponse.text();
  console.log(`[Proxy] Upstream responded ${upstreamResponse.status} for ${insurerLabel}`);

  return {
    status: upstreamResponse.status,
    contentType: upstreamResponse.headers.get('content-type') || 'application/xml',
    body: responseBody,
  };
}

// ─────────────────────────────────────────────
// POST /api/quote  ->  AWS quote endpoint
// ─────────────────────────────────────────────
router.post('/quote', async (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[Proxy/QUOTE] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[Proxy/QUOTE] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const selectedInsurers = body.selectedInsurers || [];
    if (!Array.isArray(selectedInsurers) || selectedInsurers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'selectedInsurers must be a non-empty array',
      });
    }

    const url = serverConfig.aws.baseUrl + serverConfig.aws.quotePath;
    const hardcoded = getHardcodedXml(body, 'quote', TEMPLATES_DIR);

    const upstreamResults = [];
    for (const insurerId of selectedInsurers) {
      const config = getInsurerConfig(insurerId);
      const label = config ? config.name : insurerId;

      let csioXml;
      if (hardcoded) {
        console.log(`[Proxy/QUOTE] Template match: ${hardcoded.label} -- using hardcoded XML for ${label}`);
        csioXml = hardcoded.xml;
      } else {
        if (!config) {
          console.warn(`[Proxy/QUOTE] Unknown insurer "${insurerId}" -- skipping`);
          continue;
        }
        csioXml = buildCsioXml(body, insurerId, { type: 'quote' });
      }

      console.log('-'.repeat(70));
      console.log(`[Proxy/QUOTE] CSIO XML for ${label}:`);
      console.log('-'.repeat(70));
      console.log(csioXml);
      console.log('');

      const result = await forwardXml(url, csioXml, label);
      upstreamResults.push({ insurerId, ...result });
    }

    if (upstreamResults.length > 0) {
      const first = upstreamResults[0];
      res.status(first.status).set('Content-Type', first.contentType).send(first.body);
    } else {
      res.status(400).json({ success: false, error: 'No valid insurers to forward' });
    }
  } catch (error) {
    console.error('[Proxy/QUOTE] Error:', error.message);
    res.status(502).json({ success: false, error: 'Proxy error: ' + error.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/bind   ->  AWS bind endpoint
// ─────────────────────────────────────────────
router.post('/bind', async (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[Proxy/BIND] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[Proxy/BIND] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const bindPayload = body.quoteData || body;
    const insurerId = body.insurerId || 'aviva';
    const config = getInsurerConfig(insurerId);
    const insurerLabel = config ? config.name : insurerId;

    const hardcoded = getHardcodedXml(body, 'bind', TEMPLATES_DIR);
    let csioXml;

    if (hardcoded) {
      console.log(`[Proxy/BIND] Template match: ${hardcoded.label} -- using hardcoded XML`);
      csioXml = hardcoded.xml;
    } else {
      csioXml = buildCsioXml(bindPayload, insurerId, { type: 'bind' });
    }

    console.log('-'.repeat(70));
    console.log(`[Proxy/BIND] CSIO XML for ${insurerLabel}:`);
    console.log('-'.repeat(70));
    console.log(csioXml);
    console.log('');

    const url = serverConfig.aws.baseUrl + serverConfig.aws.bindPath;
    const result = await forwardXml(url, csioXml, insurerLabel);

    res.status(result.status).set('Content-Type', result.contentType).send(result.body);
  } catch (error) {
    console.error('[Proxy/BIND] Error:', error.message);
    res.status(502).json({ success: false, error: 'Proxy error: ' + error.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/hab/quote  ->  AWS hab quote endpoint
// ─────────────────────────────────────────────
router.post('/hab/quote', async (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[Proxy/HAB-QUOTE] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[Proxy/HAB-QUOTE] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const selectedInsurers = body.selectedInsurers || [];
    if (!Array.isArray(selectedInsurers) || selectedInsurers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'selectedInsurers must be a non-empty array',
      });
    }

    const url = serverConfig.aws.baseUrl + serverConfig.aws.habQuotePath;
    const hardcoded = getHardcodedXml(body, 'habQuote', TEMPLATES_DIR);

    const upstreamResults = [];
    for (const insurerId of selectedInsurers) {
      const config = getInsurerConfig(insurerId);
      const label = config ? config.name : insurerId;

      let csioXml;
      if (hardcoded) {
        console.log(`[Proxy/HAB-QUOTE] Template match: ${hardcoded.label} -- using hardcoded XML for ${label}`);
        csioXml = hardcoded.xml;
      } else {
        csioXml = buildHabCsioXml(body, insurerId, { type: 'quote' });
      }

      console.log('-'.repeat(70));
      console.log(`[Proxy/HAB-QUOTE] CSIO XML for ${label}:`);
      console.log('-'.repeat(70));
      console.log(csioXml);
      console.log('');

      const result = await forwardXml(url, csioXml, label);
      upstreamResults.push({ insurerId, ...result });
    }

    if (upstreamResults.length > 0) {
      const first = upstreamResults[0];
      res.status(first.status).set('Content-Type', first.contentType).send(first.body);
    } else {
      res.status(400).json({ success: false, error: 'No valid insurers to forward' });
    }
  } catch (error) {
    console.error('[Proxy/HAB-QUOTE] Error:', error.message);
    res.status(502).json({ success: false, error: 'Proxy error: ' + error.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/hab/bind   ->  AWS hab bind endpoint
// ─────────────────────────────────────────────
router.post('/hab/bind', async (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[Proxy/HAB-BIND] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[Proxy/HAB-BIND] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const bindPayload = body.quoteData || body;
    const insurerId = body.insurerId || 'aviva';
    const config = getInsurerConfig(insurerId);
    const insurerLabel = config ? config.name : insurerId;

    const hardcoded = getHardcodedXml(body, 'habBind', TEMPLATES_DIR);
    let csioXml;

    if (hardcoded) {
      console.log(`[Proxy/HAB-BIND] Template match: ${hardcoded.label} -- using hardcoded XML`);
      csioXml = hardcoded.xml;
    } else {
      csioXml = buildHabCsioXml(bindPayload, insurerId, { type: 'bind' });
    }

    console.log('-'.repeat(70));
    console.log(`[Proxy/HAB-BIND] CSIO XML for ${insurerLabel}:`);
    console.log('-'.repeat(70));
    console.log(csioXml);
    console.log('');

    const url = serverConfig.aws.baseUrl + serverConfig.aws.habBindPath;
    const result = await forwardXml(url, csioXml, insurerLabel);

    res.status(result.status).set('Content-Type', result.contentType).send(result.body);
  } catch (error) {
    console.error('[Proxy/HAB-BIND] Error:', error.message);
    res.status(502).json({ success: false, error: 'Proxy error: ' + error.message });
  }
});

module.exports = router;
