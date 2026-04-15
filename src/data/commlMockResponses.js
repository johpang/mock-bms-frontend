/**
 * Hardcoded mock insurer responses for commercial line.
 * Used when REACT_APP_MOCK_MODE=true (no backend required).
 */

const commlMockResponses = {
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
      "Commercial property rate includes standard deductible",
      "General liability — contractors classification applied",
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 2100.00 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 450.00 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 2300.00 },
    ],
  },
  intact: {
    insurerName: "Indigo Ins. Co.",
    insurerId: "intact",
    referenceNumber: "C-915386",
    type: "New Business",
    premiums: { annual: 5120.50, monthly: 426.71 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "New business rate applied",
      "Equipment breakdown coverage bundled",
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 2250.00 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 520.50 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 2350.00 },
    ],
  },
  definity: {
    insurerName: "Delta Insurance",
    insurerId: "definity",
    referenceNumber: "C-726541",
    type: "New Business",
    premiums: { annual: 4680.00, monthly: 390.00 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "Small business discount applied",
      "Multi-year policy eligible",
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 1980.00 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 400.00 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 2300.00 },
    ],
  },
  wawanesa: {
    insurerName: "Beta Insurance Inc.",
    insurerId: "wawanesa",
    referenceNumber: "C-637829",
    type: "New Business",
    premiums: { annual: 5340.75, monthly: 445.06 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "Standard commercial package rate",
      "Annual billing discount available",
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 2380.00 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 560.75 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 2400.00 },
    ],
  },
  caa: {
    insurerName: "Coach Insurance",
    insurerId: "caa",
    referenceNumber: "C-548971",
    type: "New Business",
    premiums: { annual: 4520.00, monthly: 376.67 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "CAA member discount applied",
      "Preferred commercial rate",
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 1900.00 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 380.00 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 2240.00 },
    ],
  },
  goreMutual: {
    insurerName: "Gamma Insurance",
    insurerId: "goreMutual",
    referenceNumber: "C-659284",
    type: "New Business",
    premiums: { annual: 5078.30, monthly: 423.19 },
    effectiveDate: "04/01/2026",
    businessName: "2435268 Ontario Inc. O/A ABC Landscaping",
    businessAddress: "400 Applewood Crescent, Unit 200, Concord, ON L4K 0C3",
    underwritingMessages: [
      "Ontario mutual commercial rate",
      "Loyalty discount eligible after first term",
    ],
    coverages: [
      { name: "Commercial Property (CPROP)", deductible: "$1,000", amount: "$250,000", premium: 2200.00 },
      { name: "Business Income", deductible: "", amount: "Included", premium: 0 },
      { name: "Equipment", deductible: "$500", amount: "$50,000", premium: 478.30 },
      { name: "Equipment Breakdown", deductible: "", amount: "Included", premium: 0 },
      { name: "Commercial General Liability (CGL)", deductible: "$1,000", amount: "$2,000,000", premium: 2400.00 },
    ],
  },
};

export default commlMockResponses;
