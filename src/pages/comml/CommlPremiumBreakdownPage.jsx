import React, { useState, useRef } from 'react';
import { useComml } from '../../context/CommlContext';
import { formatCurrency, formatDate, formatAmountInput } from '../../utils/formatters';
import MockDisclaimer from '../../components/MockDisclaimer';
import { ADDITIONAL_INFO_PRODUCER_CODE, ADDITIONAL_INFO_BIND_MESSAGE } from '../../config/index.js';

/**
 * CommlPremiumBreakdownPage Component
 * Displays individual insurer detail view for commercial insurance quotes
 * Shows coverage breakdown, underwriting messages, and premium details
 *
 * @component
 * @returns {React.ReactElement} The premium breakdown page
 */
const CommlPremiumBreakdownPage = () => {
  const { commlResponses, prevStep, nextStep, selectedInsurerIndex, commlData } = useComml();

  const [bindBlocked, setBindBlocked] = useState(false);
  const bindBlockerRef = useRef(null);

  const handleProceedToBind = () => {
    if (commlData.producerCode === ADDITIONAL_INFO_PRODUCER_CODE) {
      setBindBlocked(true);
      setTimeout(() => {
        bindBlockerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
      return;
    }
    nextStep();
  };

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    lightAccent: '#e8f5ff',
    warning: '#d4a574',
    error: '#cf222e',
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
      border: `1px solid #d32f2f`,
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
    errorBanner: {
      backgroundColor: '#fce8e6',
      border: `1px solid ${colors.error}`,
      color: colors.error,
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '24px',
      fontSize: '14px',
      fontWeight: 500,
      // Offset for the fixed top bar + sticky step indicator so scrollIntoView
      // doesn't park the banner behind them.
      scrollMarginTop: '140px',
    },
  };

  if (!commlResponses || commlResponses.length === 0) {
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

  const selectedResponse = commlResponses[selectedInsurerIndex ?? 0];

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
      {bindBlocked && (
        <div ref={bindBlockerRef} style={styles.errorBanner}>
          {ADDITIONAL_INFO_BIND_MESSAGE}
        </div>
      )}
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
            {formatDate(commlData.policyEffectiveDate) || formatDate(selectedResponse.effectiveDate)}
          </div>
        </div>
        <div style={styles.summaryItemWide}>
          <div style={styles.summaryLabel}>Business Address</div>
          <div style={styles.summaryValue}>
            {[commlData.account?.address, commlData.account?.city, commlData.account?.province, commlData.account?.postalCode].filter(Boolean).join(', ') || 'N/A'}
          </div>
        </div>
      </div>

      <div style={styles.sectionsContainer}>
        {(() => {
          const messages = [...(selectedResponse.underwritingMessages || [])];
          if (commlData.building?.occupancy === 'Tenant') {
            messages.push(
              'Additional Information: Leasehold Interest Information required.  Please validate quote information before proceeding to bind, or contact BrokerHelp for assistance.'
            );
          }
          return messages.length > 0 ? (
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
          ) : null;
        })()}

        {(() => {
          const coverageDefinitions = [
            { key: 'cgl', label: 'Commercial General Liability', limitKey: 'cglLimit' },
            { key: 'buildingCov', label: 'Building', limitKey: 'buildingLimit' },
            { key: 'equipmentCov', label: 'Equipment', limitKey: 'equipmentLimit' },
            { key: 'stockCov', label: 'Stock' },
            { key: 'contentsCov', label: 'Contents' },
            { key: 'sewerBackup', label: 'Sewer Backup', limitKey: 'sewerBackupLimit' },
            { key: 'flood', label: 'Flood' },
            { key: 'earthquake', label: 'Earthquake' },
          ];

          // Hardcoded premiums per coverage key. Other coverages fall through to "Included".
          const hardcodedPremiums = {
            cgl: 357,
            equipmentCov: 235,
            sewerBackup: 125,
          };

          const coverages = commlData.building?.coverages || {};
          const enabledCoverages = coverageDefinitions.filter(
            (c) => coverages[c.key] === true || coverages[c.key] === 'Yes'
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
                      <th style={styles.tableHeaderCell}>Limit</th>
                      <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enabledCoverages.map((cov) => {
                      const limit = cov.limitKey ? coverages[cov.limitKey] : '';
                      const premium = hardcodedPremiums[cov.key];

                      return (
                        <tr key={cov.key} style={styles.tableDataRow}>
                          <td style={styles.tableDataCell}>{cov.label}</td>
                          <td style={styles.tableDataCell}>
                            {formatAmountInput(limit) || '—'}
                          </td>
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
          onClick={handleProceedToBind}
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

export default CommlPremiumBreakdownPage;
