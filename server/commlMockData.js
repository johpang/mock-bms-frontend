/**
 * Commercial Lines Mock Insurer Data
 * Base data for 6 insurers — commercial lines
 */

const commlMockData = {
  aviva: {
    insurerName: "Alpha Insurance",
    insurerId: "aviva",
    referenceNumber: "C-804752",
    type: "New Business",
    premiums: { annual: 4850.00, monthly: 404.17 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "Safety features verified and rated",
      "Multi-year policy discount available"
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 0 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 0 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 0 }
    ]
  },
  intact: {
    insurerName: "Indigo Ins. Co.",
    insurerId: "intact",
    referenceNumber: "C-915386",
    type: "New Business",
    premiums: { annual: 5125.00, monthly: 427.08 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "Experience rating applied",
      "Clean loss history credited"
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 0 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 0 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 0 }
    ]
  },
  definity: {
    insurerName: "Delta Insurance",
    insurerId: "definity",
    referenceNumber: "C-726541",
    type: "New Business",
    premiums: { annual: 4675.50, monthly: 389.63 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "Industry standard rate applied",
      "Quick quote advantage"
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 0 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 0 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 0 }
    ]
  },
  wawanesa: {
    insurerName: "Beta Insurance Inc.",
    insurerId: "wawanesa",
    referenceNumber: "C-637829",
    type: "New Business",
    premiums: { annual: 5250.75, monthly: 437.56 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "Preferred provider rate",
      "Comprehensive coverage option"
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 0 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 0 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 0 }
    ]
  },
  caa: {
    insurerName: "Coach Insurance",
    insurerId: "caa",
    referenceNumber: "C-548971",
    type: "New Business",
    premiums: { annual: 4725.00, monthly: 393.75 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "CAA member advantage applied",
      "Enhanced coverage at competitive rate"
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 0 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 0 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 0 }
    ]
  },
  goreMutual: {
    insurerName: "Gamma Insurance",
    insurerId: "goreMutual",
    referenceNumber: "C-659284",
    type: "New Business",
    premiums: { annual: 5050.25, monthly: 420.85 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "Mutual insurance stability",
      "Business continuity protection included"
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 0 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 0 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 0 }
    ]
  }
};

module.exports = commlMockData;
