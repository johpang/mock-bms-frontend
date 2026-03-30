const express = require('express');
const router = express.Router();
const mockData = require('../mockData');

// Helper function to add random variation to a premium
function addRandomVariation(premium, variationPercent = 5) {
  const variation = (Math.random() - 0.5) * 2 * (variationPercent / 100);
  return Math.round(premium * (1 + variation) * 100) / 100;
}

// Helper function to deep clone an object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// POST /api/quote endpoint
router.post('/quote', (req, res) => {
  try {
    const { selectedInsurers, vehicles } = req.body;

    // Extract deductibles from the first vehicle in the request to echo back
    const firstVehicle = Array.isArray(vehicles) && vehicles.length > 0 ? vehicles[0] : {};
    const reqCompDeductible = firstVehicle.coverage?.comprehensiveDeductible || firstVehicle.comprehensiveDeductible || '';
    const reqCollDeductible = firstVehicle.coverage?.collisionDeductible || firstVehicle.collisionDeductible || '';

    console.log('[Quote Request]');
    console.log('  Timestamp:', new Date().toISOString());
    console.log('  Selected Insurers:', selectedInsurers || []);
    console.log('  Request Body:', JSON.stringify(req.body, null, 2));

    // Validate input
    if (!selectedInsurers || !Array.isArray(selectedInsurers) || selectedInsurers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'selectedInsurers must be a non-empty array'
      });
    }

    // Generate quote ID
    const quoteId = 'QT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const timestamp = new Date().toISOString();

    // Filter mock data and apply variations
    const results = selectedInsurers
      .filter(insurerId => mockData[insurerId])
      .map(insurerId => {
        const baseData = deepClone(mockData[insurerId]);

        // Apply random variation to premiums
        const annualVariation = addRandomVariation(baseData.premiums.annual);
        const monthlyVariation = Math.round((annualVariation / 12) * 100) / 100;

        baseData.premiums = {
          annual: annualVariation,
          monthly: monthlyVariation
        };

        // Apply variation to coverage premiums and echo back request deductibles
        baseData.coverages = baseData.coverages.map(coverage => {
          let updated = { ...coverage };

          // Echo back deductibles from the request for Collision and Comprehensive
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

    console.log('  Quote ID:', quoteId);
    console.log('  Results Count:', results.length);
    console.log('  Returning results for insurers:', results.map(r => r.insurerName).join(', '));

    // Simulate 1.5 second delay to show loading state
    setTimeout(() => {
      const response = {
        success: true,
        quoteId,
        timestamp,
        results
      };

      console.log('[Quote Response]');
      console.log('  Status: Success');
      console.log('  Quote ID:', quoteId);
      console.log('  Timestamp:', timestamp);
      console.log('  Insurers Returned:', results.map(r => r.insurerName).join(', '));
      console.log('');

      res.json(response);
    }, 1500);

  } catch (error) {
    console.error('[Quote Error]', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
