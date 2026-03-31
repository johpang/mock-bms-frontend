/**
 * Proxy Routes
 *
 * Accepts JSON from the frontend, transforms to CSIO-compliant XML
 * using csioTransformer, then forwards to the real AWS API endpoints.
 * The server handles OAuth token acquisition so that client credentials
 * never reach the browser.
 *
 * Environment variables consumed (via serverConfig):
 *   AWS_API_BASE_URL  – base URL of the AWS API (e.g. https://api.example.com)
 *   AWS_QUOTE_PATH    – path for quote requests  (default: /quote)
 *   AWS_BIND_PATH     – path for bind requests   (default: /bind)
 */

const express = require('express');
const router = express.Router();
const { getAuthHeaders } = require('../authService');
const serverConfig = require('../serverConfig');
const { buildCsioXml, getInsurerConfig } = require('../csioTransformer');

/**
 * Forwards a CSIO XML request body to an upstream URL and pipes the response back.
 * @param {string} upstreamUrl  – Full URL to forward to
 * @param {string} csioXml      – The CSIO-compliant XML to send
 * @param {string} insurerLabel – Label for logging (e.g. "Aviva")
 * @param {import('express').Response} res
 */
async function forwardXml(upstreamUrl, csioXml, insurerLabel, res) {
  try {
    const headers = await getAuthHeaders();

    console.log(`[Proxy] Forwarding CSIO XML for ${insurerLabel} → ${upstreamUrl}`);

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
  } catch (error) {
    console.error(`[Proxy] Error forwarding request for ${insurerLabel}:`, error.message);
    throw error;
  }
}

// ─────────────────────────────────────────────
// POST /api/quote  →  AWS quote endpoint
//
// Accepts JSON from frontend. For each selected insurer,
// transforms to CSIO XML and forwards upstream.
// ─────────────────────────────────────────────
router.post('/quote', async (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('═'.repeat(70));
    console.log('[Proxy/QUOTE] Incoming request from frontend');
    console.log('═'.repeat(70));
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

    // Fan out: one CSIO XML POST per insurer
    const upstreamResults = [];
    for (const insurerId of selectedInsurers) {
      const config = getInsurerConfig(insurerId);
      if (!config) {
        console.warn(`[Proxy/QUOTE]   ⚠ Unknown insurer "${insurerId}" — skipping`);
        continue;
      }

      const csioXml = buildCsioXml(body, insurerId, { type: 'quote' });

      console.log('─'.repeat(70));
      console.log(`[Proxy/QUOTE] CSIO XML for ${config.name}:`);
      console.log('─'.repeat(70));
      console.log(csioXml);
      console.log('');

      const result = await forwardXml(url, csioXml, config.name, res);
      upstreamResults.push({ insurerId, ...result });
    }

    // For now, return the first upstream response (or aggregate later)
    if (upstreamResults.length > 0) {
      const first = upstreamResults[0];
      res.status(first.status).set('Content-Type', first.contentType).send(first.body);
    } else {
      res.status(400).json({ success: false, error: 'No valid insurers to forward' });
    }
  } catch (error) {
    console.error('[Proxy/QUOTE] Error:', error.message);
    res.status(502).json({
      success: false,
      error: 'Proxy error: ' + error.message,
    });
  }
});

// ─────────────────────────────────────────────
// POST /api/bind   →  AWS bind endpoint
//
// Accepts JSON from frontend. Transforms to CSIO
// PersAutoPolicyAddRq XML and forwards upstream.
// ─────────────────────────────────────────────
router.post('/bind', async (req, res) => {
  try {
    const body = req.body;

    console.log('');
    console.log('═'.repeat(70));
    console.log('[Proxy/BIND] Incoming request from frontend');
    console.log('═'.repeat(70));
    console.log('[Proxy/BIND] Received JSON payload:');
    console.log(JSON.stringify(body, null, 2));
    console.log('');

    const bindPayload = body.quoteData || body;
    const insurerId = body.insurerId || 'aviva';
    const config = getInsurerConfig(insurerId);
    const insurerLabel = config ? config.name : insurerId;

    const csioXml = buildCsioXml(bindPayload, insurerId, { type: 'bind' });

    console.log('─'.repeat(70));
    console.log(`[Proxy/BIND] CSIO XML for ${insurerLabel} (PersAutoPolicyAddRq):`);
    console.log('─'.repeat(70));
    console.log(csioXml);
    console.log('');

    const url = serverConfig.aws.baseUrl + serverConfig.aws.bindPath;
    const result = await forwardXml(url, csioXml, insurerLabel, res);

    res.status(result.status).set('Content-Type', result.contentType).send(result.body);
  } catch (error) {
    console.error('[Proxy/BIND] Error:', error.message);
    res.status(502).json({
      success: false,
      error: 'Proxy error: ' + error.message,
    });
  }
});

module.exports = router;
