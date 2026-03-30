const mockData = {
  aviva: {
    insurerName: "Aviva",
    insurerId: "aviva",
    referenceNumber: "804752",
    type: "New Business",
    premiums: { annual: 1904.35, monthly: 158.70 },
    effectiveDate: "04/01/2026",
    territory: 9,
    coverageCodes: [
      { code: 42, label: "DCPD" },
      { code: 11, label: "Ab" },
      { code: 45, label: "Coll" },
      { code: 45, label: "Comp" }
    ],
    underwritingMessages: [
      "Claims Free Discount cannot be added",
      "Endorsement #26 not supported"
    ],
    vehicleSummary: "2024 Honda Civic",
    coverages: [
      { name: "Bodily Injury Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 576 },
      { name: "Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 0 },
      { name: "Direct Compensation", coverageAmount: "", deductible: "0", premium: 231 },
      { name: "Accident Benefits", coverageAmount: "", deductible: "", premium: 435 },
      { name: "Collision", coverageAmount: "", deductible: "$1,000", premium: 356 },
      { name: "Comprehensive", coverageAmount: "", deductible: "$1,000", premium: 354 },
      { name: "Uninsured Automobile", coverageAmount: "", deductible: "", premium: 21 },
      { name: "Liability to non-owned vehicles", coverageAmount: "", deductible: "", premium: 0 }
    ]
  },
  intact: {
    insurerName: "Intact",
    insurerId: "intact",
    referenceNumber: "915386",
    type: "New Business",
    premiums: { annual: 1956.08, monthly: 163.01 },
    effectiveDate: "04/01/2026",
    territory: 9,
    coverageCodes: [
      { code: 42, label: "DCPD" },
      { code: 11, label: "Ab" },
      { code: 45, label: "Coll" },
      { code: 45, label: "Comp" }
    ],
    underwritingMessages: [
      "Early renewal discount applied",
      "Good driving record noted"
    ],
    vehicleSummary: "2024 Honda Civic",
    coverages: [
      { name: "Bodily Injury Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 598 },
      { name: "Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 0 },
      { name: "Direct Compensation", coverageAmount: "", deductible: "0", premium: 245 },
      { name: "Accident Benefits", coverageAmount: "", deductible: "", premium: 451 },
      { name: "Collision", coverageAmount: "", deductible: "$1,000", premium: 372 },
      { name: "Comprehensive", coverageAmount: "", deductible: "$1,000", premium: 368 },
      { name: "Uninsured Automobile", coverageAmount: "", deductible: "", premium: 22 },
      { name: "Liability to non-owned vehicles", coverageAmount: "", deductible: "", premium: 0 }
    ]
  },
  definity: {
    insurerName: "Definity",
    insurerId: "definity",
    referenceNumber: "726541",
    type: "New Business",
    premiums: { annual: 1989.03, monthly: 165.75 },
    effectiveDate: "04/01/2026",
    territory: 9,
    coverageCodes: [
      { code: 42, label: "DCPD" },
      { code: 11, label: "Ab" },
      { code: 45, label: "Coll" },
      { code: 45, label: "Comp" }
    ],
    underwritingMessages: [
      "Bundling discount eligible",
      "Safe driver premium reduction"
    ],
    vehicleSummary: "2024 Honda Civic",
    coverages: [
      { name: "Bodily Injury Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 612 },
      { name: "Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 0 },
      { name: "Direct Compensation", coverageAmount: "", deductible: "0", premium: 252 },
      { name: "Accident Benefits", coverageAmount: "", deductible: "", premium: 467 },
      { name: "Collision", coverageAmount: "", deductible: "$1,000", premium: 385 },
      { name: "Comprehensive", coverageAmount: "", deductible: "$1,000", premium: 382 },
      { name: "Uninsured Automobile", coverageAmount: "", deductible: "", premium: 23 },
      { name: "Liability to non-owned vehicles", coverageAmount: "", deductible: "", premium: 0 }
    ]
  },
  wawanesa: {
    insurerName: "Wawanesa",
    insurerId: "wawanesa",
    referenceNumber: "637829",
    type: "New Business",
    premiums: { annual: 2015.50, monthly: 167.96 },
    effectiveDate: "04/01/2026",
    territory: 9,
    coverageCodes: [
      { code: 42, label: "DCPD" },
      { code: 11, label: "Ab" },
      { code: 45, label: "Coll" },
      { code: 45, label: "Comp" }
    ],
    underwritingMessages: [
      "Multi-policy discount available",
      "Annual billing discount applied"
    ],
    vehicleSummary: "2024 Honda Civic",
    coverages: [
      { name: "Bodily Injury Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 625 },
      { name: "Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 0 },
      { name: "Direct Compensation", coverageAmount: "", deductible: "0", premium: 261 },
      { name: "Accident Benefits", coverageAmount: "", deductible: "", premium: 483 },
      { name: "Collision", coverageAmount: "", deductible: "$1,000", premium: 401 },
      { name: "Comprehensive", coverageAmount: "", deductible: "$1,000", premium: 396 },
      { name: "Uninsured Automobile", coverageAmount: "", deductible: "", premium: 24 },
      { name: "Liability to non-owned vehicles", coverageAmount: "", deductible: "", premium: 0 }
    ]
  },
  caa: {
    insurerName: "CAA Insurance",
    insurerId: "caa",
    referenceNumber: "548971",
    type: "New Business",
    premiums: { annual: 1878.22, monthly: 156.52 },
    effectiveDate: "04/01/2026",
    territory: 9,
    coverageCodes: [
      { code: 42, label: "DCPD" },
      { code: 11, label: "Ab" },
      { code: 45, label: "Coll" },
      { code: 45, label: "Comp" }
    ],
    underwritingMessages: [
      "CAA member discount applied",
      "Preferred customer rate"
    ],
    vehicleSummary: "2024 Honda Civic",
    coverages: [
      { name: "Bodily Injury Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 561 },
      { name: "Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 0 },
      { name: "Direct Compensation", coverageAmount: "", deductible: "0", premium: 225 },
      { name: "Accident Benefits", coverageAmount: "", deductible: "", premium: 421 },
      { name: "Collision", coverageAmount: "", deductible: "$1,000", premium: 343 },
      { name: "Comprehensive", coverageAmount: "", deductible: "$1,000", premium: 341 },
      { name: "Uninsured Automobile", coverageAmount: "", deductible: "", premium: 20 },
      { name: "Liability to non-owned vehicles", coverageAmount: "", deductible: "", premium: 0 }
    ]
  },
  goreMutual: {
    insurerName: "Gore Mutual",
    insurerId: "goreMutual",
    referenceNumber: "659284",
    type: "New Business",
    premiums: { annual: 2045.75, monthly: 170.48 },
    effectiveDate: "04/01/2026",
    territory: 9,
    coverageCodes: [
      { code: 42, label: "DCPD" },
      { code: 11, label: "Ab" },
      { code: 45, label: "Coll" },
      { code: 45, label: "Comp" }
    ],
    underwritingMessages: [
      "Ontario mutual insurance rate",
      "Loyalty discount eligible"
    ],
    vehicleSummary: "2024 Honda Civic",
    coverages: [
      { name: "Bodily Injury Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 638 },
      { name: "Property Damage", coverageAmount: "1,000,000", deductible: "", premium: 0 },
      { name: "Direct Compensation", coverageAmount: "", deductible: "0", premium: 271 },
      { name: "Accident Benefits", coverageAmount: "", deductible: "", premium: 500 },
      { name: "Collision", coverageAmount: "", deductible: "$1,000", premium: 416 },
      { name: "Comprehensive", coverageAmount: "", deductible: "$1,000", premium: 411 },
      { name: "Uninsured Automobile", coverageAmount: "", deductible: "", premium: 25 },
      { name: "Liability to non-owned vehicles", coverageAmount: "", deductible: "", premium: 0 }
    ]
  }
};

module.exports = mockData;
