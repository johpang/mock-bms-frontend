import React from 'react';
import { useHab } from '../../context/HabContext';
import { formatCurrency, formatDate, formatAmountInput } from '../../utils/formatters';
import MockDisclaimer from '../../components/MockDisclaimer';

/**
 * HabPremiumBreakdownPage Component
 * Displays individual insurer detail view for habitational insurance quotes
 * Shows coverage breakdown, underwriting messages, and premium details
 *
 * @component
 * @returns {React.ReactElement} The premium breakdown page
 */
const HabPremiumBreakdownPage = () => {
  const { habResponses, prevStep, nextStep, selectedInsurerIndex, habData } = useHab();

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    lightAccent: '#e8f5ff',
    warning: '#d4a574',
  };

  const styles = {
    pageContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 24px',
      minHeight: 'calc(100vh - 100px)',
      backgroundColor: colors.white,
    },
    headerSection: {
      paddingBottom: '32px',
      borderBottom: `2px solid ${colors.border}`,
      marginBottom: '32px',
    },
    insurerNameAndType: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '20px',
    },
    insurerName: {
      fontSize: '32px',
      fontWeight: 700,
      color: colors.navy,
      letterSpacing: '0.5px',
    },
    typeLabel: {
      display: 'inline-block',
      backgroundColor: colors.lightAccent,
      border: `1px solid ${colors.accent}`,
      color: colors.accent,
      padding: '6px 12px',
      borderRadius: '3px',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.3px',
    },
    refAndPremiumRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '32px',
    },
    leftColumn: {
      flex: 1,
    },
    rightColumn: {
      flex: 1,
      textAlign: 'right',
    },
    referenceInfo: {
      marginBottom: '8px',
    },
    referenceLabel: {
      fontSize: '12px',
      color: '#666',
      fontWeight: 500,
      letterSpacing: '0.2px',
    },
    referenceValue: {
      fontSize: '15px',
      fontWeight: 600,
      color: colors.text,
      marginTop: '2px',
    },
    premiumSection: {
      paddingTop: '8px',
    },
    annualPremiumLabel: {
      fontSize: '13px',
      color: '#666',
      fontWeight: 500,
      letterSpacing: '0.2px',
    },
    annualPremium: {
      fontSize: '36px',
      fontWeight: 700,
      color: colors.navy,
      lineHeight: 1,
      marginTop: '4px',
    },
    monthlyPremium: {
      fontSize: '14px',
      color: '#666',
      fontWeight: 500,
      marginTop: '8px',
    },
    premiumSummaryRow: {
      display: 'flex',
      gap: '32px',
      padding: '20px 0',
      borderBottom: `1px solid ${colors.border}`,
      marginBottom: '32px',
    },
    summaryItem: {
      flex: '0 0 auto',
      minWidth: '140px',
    },
    summaryItemWide: {
      flex: 1,
    },
    summaryLabel: {
      fontSize: '12px',
      color: '#666',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      marginBottom: '6px',
    },
    summaryValue: {
      fontSize: '15px',
      fontWeight: 600,
      color: colors.text,
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: colors.navy,
      marginBottom: '20px',
      paddingTop: '24px',
      borderTop: `2px solid ${colors.border}`,
    },
    sectionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
    },
    underwritingContainer: {
      backgroundColor: '#ffebee',
      border: '1px solid #d32f2f',
      borderRadius: '4px',
      padding: '20px',
      marginTop: '16px',
    },
    underwritingMessageItem: {
      padding: '8px 0',
      fontSize: '14px',
      color: colors.text,
      lineHeight: 1.5,
    },
    underwritingMessageBullet: {
      display: 'inline-block',
      width: '6px',
      height: '6px',
      backgroundColor: '#d32f2f',
      borderRadius: '50%',
      marginRight: '12px',
      marginBottom: '2px',
    },
    tableContainer: {
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '16px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeaderRow: {
      backgroundColor: colors.lightGray,
      borderBottom: `2px solid ${colors.border}`,
    },
    tableHeaderCell: {
      padding: '12px 20px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: 700,
      color: colors.navy,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    tableDataRow: {
      borderBottom: `1px solid ${colors.border}`,
      transition: 'background-color 0.2s ease',
    },
    tableDataCell: {
      padding: '12px 20px',
      fontSize: '14px',
      color: colors.text,
    },
    tableDataCellRight: {
      textAlign: 'right',
      fontWeight: 500,
    },
    emptyState: {
      padding: '48px 24px',
      textAlign: 'center',
      backgroundColor: colors.lightGray,
      borderRadius: '4px',
    },
    emptyStateTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: colors.navy,
      marginBottom: '8px',
    },
    emptyStateText: {
      fontSize: '14px',
      color: '#666',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-start',
      marginTop: '40px',
    },
    button: (isPrimary, isDisabled) => ({
      padding: '12px 32px',
      fontSize: '15px',
      fontWeight: 600,
      borderRadius: '4px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: isPrimary ? colors.navy : 'transparent',
      color: isPrimary ? colors.white : colors.navy,
      border: isPrimary ? 'none' : `2px solid ${colors.navy}`,
      opacity: isDisabled ? 0.6 : 1,
    }),
  };

  if (!habResponses || habResponses.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.emptyState}>
          <div style={styles.emptyStateTitle}>No Quote Details Available</div>
          <div style={styles.emptyStateText}>
            Please go back and select an insurer to view premium breakdown details.
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button
            onClick={prevStep}
            style={styles.button(false, false)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Back to Comparison
          </button>
        </div>
      </div>
    );
  }

  const selectedResponse = habResponses[selectedInsurerIndex ?? 0];

  if (!selectedResponse) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.emptyState}>
          <div style={styles.emptyStateTitle}>Invalid Selection</div>
          <div style={styles.emptyStateText}>The selected quote is no longer available.</div>
        </div>
        <div style={styles.buttonContainer}>
          <button
            onClick={prevStep}
            style={styles.button(false, false)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Back to Comparison
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <style>{`
        tbody tr:hover {
          background-color: ${colors.lightAccent};
        }
      `}</style>

      <MockDisclaimer />
      <div style={styles.headerSection}>
        <div style={styles.insurerNameAndType}>
          <h1 style={styles.insurerName}>{selectedResponse.insurerName}</h1>
          <span style={styles.typeLabel}>Quote</span>
        </div>

        <div style={styles.refAndPremiumRow}>
          <div style={styles.leftColumn}>
            <div style={styles.referenceInfo}>
              <div style={styles.referenceLabel}>Insurer Quote Reference Number</div>
              <div style={styles.referenceValue}>{selectedResponse.referenceNumber}</div>
            </div>
          </div>
          <div style={styles.rightColumn}>
            <div style={styles.premiumSection}>
              <div style={styles.annualPremiumLabel}>Annual Premium</div>
              <div style={styles.annualPremium}>
                {formatCurrency(selectedResponse.premiums?.annual)}
              </div>
              <div style={styles.monthlyPremium}>
                {formatCurrency(selectedResponse.premiums?.monthly)}/month
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.premiumSummaryRow}>
        <div style={styles.summaryItem}>
          <div style={styles.summaryLabel}>Effective Date</div>
          <div style={styles.summaryValue}>
            {formatDate(habData.effectiveDate) || formatDate(selectedResponse.effectiveDate)}
          </div>
        </div>
        <div style={styles.summaryItemWide}>
          <div style={styles.summaryLabel}>Property Address</div>
          <div style={styles.summaryValue}>
            {[habData.riskAddress?.address, habData.riskAddress?.city, habData.riskAddress?.province, habData.riskAddress?.postalCode].filter(Boolean).join(', ') || 'N/A'}
          </div>
        </div>
      </div>

      <div style={styles.sectionsContainer}>
        {(() => {
          const messages = [
            'Risk is eligible for higher limit for Sewer Back Up',
            'Mortgage Free Discount could not be added',
          ];

          if (habData.lossHistory?.hasLossesOrClaims === 'Yes' && habData.lossHistory?.claimDate) {
            messages.push(`Risk 1: Claim disclosed ${habData.lossHistory.claimDate}`);
          }

          return (
            <div>
              <h2 style={styles.sectionTitle}>Underwriting Messages</h2>
              <div style={styles.underwritingContainer}>
                {messages.map((message, index) => (
                  <div key={index} style={styles.underwritingMessageItem}>
                    <span style={styles.underwritingMessageBullet} />
                    {message}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {(() => {
          const coverageDefinitions = [
            { key: 'dwellingBuilding', label: 'Dwelling Building' },
            { key: 'detachedPrivateStructures', label: 'Detached Private Structures' },
            { key: 'personalProperty', label: 'Personal Property' },
            { key: 'additionalLivingExpenses', label: 'Additional Living Expenses' },
            { key: 'legalLiability', label: 'Legal Liability' },
            { key: 'voluntaryMedicalPayments', label: 'Voluntary Medical Payments' },
            { key: 'voluntaryPropertyDamage', label: 'Voluntary Property Damage' },
            { key: 'sewerBackup', label: 'Sewer Backup' },
            { key: 'legalServices', label: 'Legal Services' },
            { key: 'identityTheftProtection', label: 'Identity Theft Protection' },
          ];

          // Hardcoded premiums per coverage key. 0 => rendered as "Included".
          // Dwelling Building and Sewer Backup fall through to the response for now.
          const hardcodedPremiums = {
            detachedPrivateStructures: 389,
            personalProperty: 269,
            additionalLivingExpenses: 234,
            legalLiability: 539,
            voluntaryMedicalPayments: 0,
            voluntaryPropertyDamage: 0,
            legalServices: 0,
            identityTheftProtection: 25,
          };

          const responseCoverageMap = {};
          (selectedResponse.coverages || []).forEach((c) => {
            responseCoverageMap[c.name] = c;
          });
          const labelToResponseName = {
            'Dwelling Building': 'Residence',
            'Sewer Backup': 'Sewer Back-Up & Overland Water',
          };

          const selectedCoverages = habData.coverages || {};
          const enabledCoverages = coverageDefinitions.filter(
            (c) => selectedCoverages[c.key]?.enabled
          );

          if (enabledCoverages.length === 0) return null;

          return (
            <div>
              <h2 style={styles.sectionTitle}>Coverage Breakdown</h2>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeaderCell}>Coverage</th>
                      <th style={styles.tableHeaderCell}>Deductible</th>
                      <th style={styles.tableHeaderCell}>Amount</th>
                      <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enabledCoverages.map((cov) => {
                      const userCov = selectedCoverages[cov.key] || {};
                      const premium = cov.key in hardcodedPremiums
                        ? hardcodedPremiums[cov.key]
                        : responseCoverageMap[labelToResponseName[cov.label] || cov.label]?.premium;

                      return (
                        <tr key={cov.key} style={styles.tableDataRow}>
                          <td style={styles.tableDataCell}>{cov.label}</td>
                          <td style={styles.tableDataCell}>{formatAmountInput(userCov.deductible) || '—'}</td>
                          <td style={styles.tableDataCell}>{formatAmountInput(userCov.amount) || '—'}</td>
                          <td style={{ ...styles.tableDataCell, ...styles.tableDataCellRight }}>
                            {premium ? formatCurrency(premium) : 'Included'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={prevStep}
          style={styles.button(false, false)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          Back
        </button>
        <button
          onClick={nextStep}
          style={styles.button(true, false)}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(42, 82, 152, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          Proceed to Bind
        </button>
      </div>
    </div>
  );
};

export default HabPremiumBreakdownPage;
