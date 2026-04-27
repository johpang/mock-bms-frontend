/**
 * Habitational Mock Insurer Data
 * Base data for 6 insurers — hab line
 */

const habMockData = {
  aviva: {
    insurerName: "Alpha Insurance",
    insurerId: "aviva",
    referenceNumber: "H-804752",
    type: "New Business",
    premiums: { annual: 1956.08, monthly: 163.01 },
    effectiveDate: "04/01/2026",
    propertyAddress: "52 Marshall Street, Barrie, L4N 3S7",
    riskType: "Primary -- Homeowners",
    underwritingMessages: [
      "Dwelling: The minimum threshold premiums have been met.",
      "Credit factor applied to the quote.",
      "Coverages have been amended based on availability. Please review."
    ],
    coverages: [
      { name: "Residence", deductible: "", amount: "", premium: 1956.08 },
      { name: "Guaranteed Replacement Cost", deductible: "", amount: "Included", premium: 0 },
      { name: "Outbuildings", deductible: "", amount: "Included", premium: 0 },
      { name: "Personal Property", deductible: "$1,000", amount: "$75,000", premium: 0 },
      { name: "Legal Liability", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Medical Payments", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Property Damage", deductible: "", amount: "Included", premium: 0 },
      { name: "Sewer Back-Up & Overland Water", deductible: "$1,000", amount: "$25,000", premium: 320 }
    ]
  },
  intact: {
    insurerName: "Indigo Ins. Co.",
    insurerId: "intact",
    referenceNumber: "H-915386",
    type: "New Business",
    premiums: { annual: 2012.45, monthly: 167.70 },
    effectiveDate: "04/01/2026",
    propertyAddress: "52 Marshall Street, Barrie, L4N 3S7",
    riskType: "Primary -- Homeowners",
    underwritingMessages: [
      "Dwelling: The minimum threshold premiums have been met.",
      "Credit factor applied to the quote.",
      "Coverages have been amended based on availability. Please review."
    ],
    coverages: [
      { name: "Residence", deductible: "", amount: "", premium: 2012.45 },
      { name: "Guaranteed Replacement Cost", deductible: "", amount: "Included", premium: 0 },
      { name: "Outbuildings", deductible: "", amount: "Included", premium: 0 },
      { name: "Personal Property", deductible: "$1,000", amount: "$75,000", premium: 0 },
      { name: "Legal Liability", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Medical Payments", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Property Damage", deductible: "", amount: "Included", premium: 0 },
      { name: "Sewer Back-Up & Overland Water", deductible: "$1,000", amount: "$25,000", premium: 345 }
    ]
  },
  definity: {
    insurerName: "Delta Insurance",
    insurerId: "definity",
    referenceNumber: "H-726541",
    type: "New Business",
    premiums: { annual: 1889.50, monthly: 157.46 },
    effectiveDate: "04/01/2026",
    propertyAddress: "52 Marshall Street, Barrie, L4N 3S7",
    riskType: "Primary -- Homeowners",
    underwritingMessages: [
      "Dwelling: The minimum threshold premiums have been met.",
      "Credit factor applied to the quote.",
      "Coverages have been amended based on availability. Please review."
    ],
    coverages: [
      { name: "Residence", deductible: "", amount: "", premium: 1889.50 },
      { name: "Guaranteed Replacement Cost", deductible: "", amount: "Included", premium: 0 },
      { name: "Outbuildings", deductible: "", amount: "Included", premium: 0 },
      { name: "Personal Property", deductible: "$1,000", amount: "$75,000", premium: 0 },
      { name: "Legal Liability", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Medical Payments", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Property Damage", deductible: "", amount: "Included", premium: 0 },
      { name: "Sewer Back-Up & Overland Water", deductible: "$1,000", amount: "$25,000", premium: 298 }
    ]
  },
  wawanesa: {
    insurerName: "Beta Insurance Inc.",
    insurerId: "wawanesa",
    referenceNumber: "H-637829",
    type: "New Business",
    premiums: { annual: 2105.75, monthly: 175.48 },
    effectiveDate: "04/01/2026",
    propertyAddress: "52 Marshall Street, Barrie, L4N 3S7",
    riskType: "Primary -- Homeowners",
    underwritingMessages: [
      "Dwelling: The minimum threshold premiums have been met.",
      "Credit factor applied to the quote.",
      "Coverages have been amended based on availability. Please review."
    ],
    coverages: [
      { name: "Residence", deductible: "", amount: "", premium: 2105.75 },
      { name: "Guaranteed Replacement Cost", deductible: "", amount: "Included", premium: 0 },
      { name: "Outbuildings", deductible: "", amount: "Included", premium: 0 },
      { name: "Personal Property", deductible: "$1,000", amount: "$75,000", premium: 0 },
      { name: "Legal Liability", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Medical Payments", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Property Damage", deductible: "", amount: "Included", premium: 0 },
      { name: "Sewer Back-Up & Overland Water", deductible: "$1,000", amount: "$25,000", premium: 365 }
    ]
  },
  caa: {
    insurerName: "Coach Insurance",
    insurerId: "caa",
    referenceNumber: "H-548971",
    type: "New Business",
    premiums: { annual: 1845.00, monthly: 153.75 },
    effectiveDate: "04/01/2026",
    propertyAddress: "52 Marshall Street, Barrie, L4N 3S7",
    riskType: "Primary -- Homeowners",
    underwritingMessages: [
      "Dwelling: The minimum threshold premiums have been met.",
      "Credit factor applied to the quote.",
      "Coverages have been amended based on availability. Please review."
    ],
    coverages: [
      { name: "Residence", deductible: "", amount: "", premium: 1845.00 },
      { name: "Guaranteed Replacement Cost", deductible: "", amount: "Included", premium: 0 },
      { name: "Outbuildings", deductible: "", amount: "Included", premium: 0 },
      { name: "Personal Property", deductible: "$1,000", amount: "$75,000", premium: 0 },
      { name: "Legal Liability", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Medical Payments", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Property Damage", deductible: "", amount: "Included", premium: 0 },
      { name: "Sewer Back-Up & Overland Water", deductible: "$1,000", amount: "$25,000", premium: 280 }
    ]
  },
  goreMutual: {
    insurerName: "Gamma Insurance",
    insurerId: "goreMutual",
    referenceNumber: "H-659284",
    type: "New Business",
    premiums: { annual: 2078.30, monthly: 173.19 },
    effectiveDate: "04/01/2026",
    propertyAddress: "52 Marshall Street, Barrie, L4N 3S7",
    riskType: "Primary -- Homeowners",
    underwritingMessages: [
      "Dwelling: The minimum threshold premiums have been met.",
      "Credit factor applied to the quote.",
      "Coverages have been amended based on availability. Please review."
    ],
    coverages: [
      { name: "Residence", deductible: "", amount: "", premium: 2078.30 },
      { name: "Guaranteed Replacement Cost", deductible: "", amount: "Included", premium: 0 },
      { name: "Outbuildings", deductible: "", amount: "Included", premium: 0 },
      { name: "Personal Property", deductible: "$1,000", amount: "$75,000", premium: 0 },
      { name: "Legal Liability", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Medical Payments", deductible: "", amount: "Included", premium: 0 },
      { name: "Voluntary Property Damage", deductible: "", amount: "Included", premium: 0 },
      { name: "Sewer Back-Up & Overland Water", deductible: "$1,000", amount: "$25,000", premium: 340 }
    ]
  }
};

module.exports = habMockData;
