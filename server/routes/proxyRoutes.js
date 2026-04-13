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
const { buildCommlCsioXml } = require('../csioCommlTransformer');
const { getHardcodedXml } = require('../csioHelpers');
const {
  parseAutoQuoteResponse,
  parseAutoBindResponse,
  parseHabQuoteResponse,
  parseHabBindResponse,
  parseCommlQuoteResponse,
  parseCommlBindResponse,
} = require('../csioResponseParser');

const TEMPLATES_DIR = path.join(__dirname, '..', 'csio-templates');

/**
 * Forwards CSIO XML to an upstream URL and returns the response.
 */
async function forwardXml(upstreamUrl, csioXml, insurerLabel) {
  const headers = await getAuthHeaders();

  console.log('');
  console.log(`[Proxy] >>> OUTBOUND REQUEST for ${insurerLabel}`);
  console.log(`[Proxy]     URL:    ${upstreamUrl}`);
  console.log(`[Proxy]     Method: POST`);
  console.log(`[Proxy]     Headers:`);
  Object.entries({ ...headers, 'Content-Type': 'application/xml' }).forEach(([k, v]) => {
    // Mask the Bearer token for security, show first/last 8 chars
    const display = k === 'Authorization' && v.length > 30
      ? `${v.substring(0, 15)}...${v.substring(v.length - 8)}`
      : v;
    console.log(`[Proxy]       ${k}: ${display}`);
  });
  console.log(`[Proxy]     Body length: ${csioXml.length} chars`);
  console.log('');

  const startTime = Date.now();

  const upstreamResponse = await fetch(upstreamUrl, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/xml',
    },
    body: csioXml,
  });

  const elapsed = Date.now() - startTime;
  const responseBody = await upstreamResponse.text();

  console.log(`[Proxy] <<< UPSTREAM RESPONSE for ${insurerLabel}`);
  console.log(`[Proxy]     Status:       ${upstreamResponse.status} ${upstreamResponse.statusText}`);
  console.log(`[Proxy]     Elapsed:      ${elapsed}ms`);
  console.log(`[Proxy]     Content-Type: ${upstreamResponse.headers.get('content-type') || '(none)'}`);
  console.log(`[Proxy]     Body length:  ${responseBody.length} chars`);
  if (responseBody.length === 0) {
    console.log(`[Proxy]     Body:         (empty)`);
  } else {
    console.log(`[Proxy]     Body:`);
    console.log(responseBody);
  }
  console.log('');

  // Log all response headers for debugging
  console.log(`[Proxy]     Response headers:`);
  upstreamResponse.headers.forEach((value, key) => {
    console.log(`[Proxy]       ${key}: ${value}`);
  });
  console.log('');

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

    // Parse each upstream XML response into the JSON shape the frontend expects
    const quoteId = 'QT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const results = upstreamResults.map((ur) => {
      const cfg = getInsurerConfig(ur.insurerId);
      return parseAutoQuoteResponse(ur.body, {
        insurerId: ur.insurerId,
        insurerName: cfg ? cfg.name : ur.insurerId,
        requestData: body,
      });
    });

    console.log('[Proxy/QUOTE] Returning parsed JSON with', results.length, 'result(s)');
    res.json({
      success: true,
      quoteId,
      timestamp: new Date().toISOString(),
      results,
    });
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
      csioXml = buildCsioXml(bindPayload, insurerId, { type: 'bind', companysQuoteNumber: body.companysQuoteNumber || '' });
    }

    console.log('-'.repeat(70));
    console.log(`[Proxy/BIND] CSIO XML for ${insurerLabel}:`);
    console.log('-'.repeat(70));
    console.log(csioXml);
    console.log('');

    const url = serverConfig.aws.baseUrl + serverConfig.aws.bindPath;
    const result = await forwardXml(url, csioXml, insurerLabel);

    // Parse the upstream XML bind response into JSON
    const bindResult = parseAutoBindResponse(result.body, {
      insurerId,
      insurerName: insurerLabel,
      quoteNumber: body.quoteNumber || '',
    });

    console.log('[Proxy/BIND] Returning parsed JSON:', bindResult.status);
    res.json(bindResult);
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

    const quoteId = 'QT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const results = upstreamResults.map((ur) => {
      const cfg = getInsurerConfig(ur.insurerId);
      return parseHabQuoteResponse(ur.body, {
        insurerId: ur.insurerId,
        insurerName: cfg ? cfg.name : ur.insurerId,
        requestData: body,
      });
    });

    console.log('[Proxy/HAB-QUOTE] Returning parsed JSON with', results.length, 'result(s)');
    res.json({ success: true, quoteId, timestamp: new Date().toISOString(), results });
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
      csioXml = buildHabCsioXml(bindPayload, insurerId, { type: 'bind', companysQuoteNumber: body.companysQuoteNumber || '' });
    }

    console.log('-'.repeat(70));
    console.log(`[Proxy/HAB-BIND] CSIO XML for ${insurerLabel}:`);
    console.log('-'.repeat(70));
    console.log(csioXml);
    console.log('');

    const url = serverConfig.aws.baseUrl + serverConfig.aws.habBindPath;
    const result = await forwardXml(url, csioXml, insurerLabel);

    const bindResult = parseHabBindResponse(result.body, {
      insurerId,
      insurerName: insurerLabel,
      quoteNumber: body.quoteNumber || '',
    });

    console.log('[Proxy/HAB-BIND] Returning parsed JSON:', bindResult.status);
    res.json(bindResult);
  } catch (error) {
    console.error('[Proxy/HAB-BIND] Error:', error.message);
    res.status(502).json({ success: false, error: 'Proxy error: ' + error.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/comml/quote  ->  AWS commercial quote endpoint
// ─────────────────────────────────────────────
router.post('/comml/quote', async (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[Proxy/COMML-QUOTE] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[Proxy/COMML-QUOTE] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const selectedInsurers = body.selectedInsurers || [];
    if (!Array.isArray(selectedInsurers) || selectedInsurers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'selectedInsurers must be a non-empty array',
      });
    }

    const url = serverConfig.aws.baseUrl + serverConfig.aws.commlQuotePath;

    const upstreamResults = [];
    for (const insurerId of selectedInsurers) {
      const config = getInsurerConfig(insurerId);
      const label = config ? config.name : insurerId;

      if (!config) {
        console.warn(`[Proxy/COMML-QUOTE] Unknown insurer "${insurerId}" -- skipping`);
        continue;
      }

      const csioXml = buildCommlCsioXml(body, insurerId, { type: 'quote' });

      console.log('-'.repeat(70));
      console.log(`[Proxy/COMML-QUOTE] CSIO XML for ${label}:`);
      console.log('-'.repeat(70));
      console.log(csioXml);
      console.log('');

      const result = await forwardXml(url, csioXml, label);
      upstreamResults.push({ insurerId, ...result });
    }

    const quoteId = 'QT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const results = upstreamResults.map((ur) => {
      const cfg = getInsurerConfig(ur.insurerId);
      return parseCommlQuoteResponse(ur.body, {
        insurerId: ur.insurerId,
        insurerName: cfg ? cfg.name : ur.insurerId,
        requestData: body,
      });
    });

    console.log('[Proxy/COMML-QUOTE] Returning parsed JSON with', results.length, 'result(s)');
    res.json({ success: true, quoteId, timestamp: new Date().toISOString(), results });
  } catch (error) {
    console.error('[Proxy/COMML-QUOTE] Error:', error.message);
    res.status(502).json({ success: false, error: 'Proxy error: ' + error.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/comml/bind   ->  AWS commercial bind endpoint
// ─────────────────────────────────────────────
router.post('/comml/bind', async (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('='.repeat(70));
    console.log('[Proxy/COMML-BIND] Incoming request from frontend');
    console.log('='.repeat(70));
    console.log('[Proxy/COMML-BIND] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const bindPayload = body.quoteData || body;
    const insurerId = body.insurerId || 'aviva';
    const config = getInsurerConfig(insurerId);
    const insurerLabel = config ? config.name : insurerId;

    const csioXml = buildCommlCsioXml(bindPayload, insurerId, { type: 'bind', companysQuoteNumber: body.companysQuoteNumber || '' });

    console.log('-'.repeat(70));
    console.log(`[Proxy/COMML-BIND] CSIO XML for ${insurerLabel}:`);
    console.log('-'.repeat(70));
    console.log(csioXml);
    console.log('');

    const url = serverConfig.aws.baseUrl + serverConfig.aws.commlBindPath;
    const result = await forwardXml(url, csioXml, insurerLabel);

    const bindResult = parseCommlBindResponse(result.body, {
      insurerId,
      insurerName: insurerLabel,
      quoteNumber: body.quoteNumber || '',
    });

    console.log('[Proxy/COMML-BIND] Returning parsed JSON:', bindResult.status);
    res.json(bindResult);
  } catch (error) {
    console.error('[Proxy/COMML-BIND] Error:', error.message);
    res.status(502).json({ success: false, error: 'Proxy error: ' + error.message });
  }
});

module.exports = router;
