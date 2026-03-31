import React from 'react';
import { useAutoQuote } from '../context/AutoContext';
import { CoverageBreakdownTable, UnderwritingMessages } from '../components/QuoteResponse';
import { formatCurrency, formatDate } from '../utils/formatters';
import MockDisclaimer from '../components/MockDisclaimer';

/**
 * PremiumBreakdownPage Component
 * Screen 4 - Displays detailed premium and coverage information for a selected insurer
 *
 * @component
 * @returns {React.ReactElement} The premium breakdown page
 */
const PremiumBreakdownPage = () => {
  const { quoteResponses, prevStep, nextStep, selectedInsurerIndex } = useAutoQuote();

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
  };

  const styles = {
    pageContainer: {
      maxWidth: '1100px',
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
    },
    insurerName: {
      fontSize: '32px',
      fontWeight: 700,
      color: colors.navy,
      letterSpacing: '0.5px',
    },
    typeLabel: {
      display: 'inline-block',
      backgroundColor: '#e8f5ff',
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
    infoRow: {
      display: 'flex',
      gap: '32px',
      padding: '20px 0',
      borderBottom: `1px solid ${colors.border}`,
      marginBottom: '32px',
    },
    infoItem: {
      flex: '0 0 auto',
      minWidth: '140px',
    },
    infoItemWide: {
      flex: 1,
    },
    infoLabel: {
      fontSize: '12px',
      color: '#666',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      marginBottom: '6px',
    },
    infoValue: {
      fontSize: '15px',
      fontWeight: 600,
      color: colors.text,
    },
    coverageCodesContainer: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'nowrap',
      marginTop: '8px',
    },
    rateGroupItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: colors.lightGray,
      border: `1px solid ${colors.border}`,
      padding: '10px 20px',
      borderRadius: '3px',
      minWidth: '64px',
    },
    rateGroupNumber: {
      fontSize: '18px',
      fontWeight: 700,
      color: colors.navy,
      lineHeight: 1,
      marginBottom: '4px',
    },
    rateGroupLabel: {
      fontSize: '11px',
      fontWeight: 600,
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: colors.navy,
      marginBottom: '20px',
      paddingTop: '24px',
      borderTop: `2px solid ${colors.border}`,
      paddingTop: '24px',
    },
    sectionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
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
    button: (isPrimary) => ({
      padding: '12px 32px',
      fontSize: '15px',
      fontWeight: 600,
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: isPrimary ? colors.navy : 'transparent',
      color: isPrimary ? colors.white : colors.navy,
      border: isPrimary ? 'none' : `2px solid ${colors.navy}`,
    }),
  };

  if (!quoteResponses || quoteResponses.length === 0) {
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
            style={styles.button(false)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.lightGray;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.white;
            }}
          >
            Back to Comparison
          </button>
        </div>
      </div>
    );
  }

  const selectedResponse = quoteResponses[selectedInsurerIndex ?? 0];

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
            style={styles.button(false)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.lightGray;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.white;
            }}
          >
            Back to Comparison
          </button>
        </div>
      </div>
    );
  }

  // vehicleSummary may be a string ("2024 Honda Civic") or an object ({ year, make, model })
  const vehicleSummary = typeof selectedResponse.vehicleSummary === 'string'
    ? selectedResponse.vehicleSummary
    : selectedResponse.vehicleSummary
      ? `${selectedResponse.vehicleSummary.year} ${selectedResponse.vehicleSummary.make} ${selectedResponse.vehicleSummary.model}`
      : '';

  return (
    <div style={styles.pageContainer}>
      <MockDisclaimer />
      <div style={styles.headerSection}>
        <div style={styles.insurerNameAndType}>
          <h1 style={styles.insurerName}>{selectedResponse.insurerName}</h1>
          <span style={styles.typeLabel}>{selectedResponse.type}</span>
        </div>

        <div style={styles.refAndPremiumRow}>
          <div style={styles.leftColumn}>
            <div style={styles.referenceInfo}>
              <div style={styles.referenceLabel}>Reference Number</div>
              <div style={styles.referenceValue}>{selectedResponse.referenceNumber}</div>
            </div>
          </div>
          <div style={styles.rightColumn}>
            <div style={styles.premiumSection}>
              <div style={styles.annualPremiumLabel}>Annual Premium</div>
              <div style={styles.annualPremium}>
                {formatCurrency(selectedResponse.premiums.annual)}
              </div>
              <div style={styles.monthlyPremium}>
                {formatCurrency(selectedResponse.premiums.monthly)}/month
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.infoRow}>
        <div style={styles.infoItem}>
          <div style={styles.infoLabel}>Effective Date</div>
          <div style={styles.infoValue}>{formatDate(selectedResponse.effectiveDate)}</div>
        </div>
        <div style={styles.infoItem}>
          <div style={styles.infoLabel}>Territory</div>
          <div style={styles.infoValue}>{selectedResponse.territory}</div>
        </div>
        <div style={styles.infoItemWide}>
          <div style={styles.infoLabel}>Rate Groups</div>
          <div style={styles.coverageCodesContainer}>
            {selectedResponse.coverageCodes && selectedResponse.coverageCodes.length > 0 ? (
              selectedResponse.coverageCodes.map((codeObj, index) => (
                <div key={index} style={styles.rateGroupItem}>
                  <span style={styles.rateGroupNumber}>
                    {typeof codeObj === 'object' ? codeObj.code : codeObj}
                  </span>
                  <span style={styles.rateGroupLabel}>
                    {typeof codeObj === 'object' ? codeObj.label : ''}
                  </span>
                </div>
              ))
            ) : (
              <span style={styles.infoValue}>N/A</span>
            )}
          </div>
        </div>
      </div>

      <div style={styles.sectionsContainer}>
        {selectedResponse.underwritingMessages &&
          selectedResponse.underwritingMessages.length > 0 && (
            <div>
              <UnderwritingMessages messages={selectedResponse.underwritingMessages} />
            </div>
          )}

        {selectedResponse.coverages && selectedResponse.coverages.length > 0 && (
          <div>
            <CoverageBreakdownTable
              coverages={selectedResponse.coverages}
              vehicleSummary={vehicleSummary}
            />
          </div>
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={prevStep}
          style={styles.button(false)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          Back to Comparison
        </button>
        <button
          onClick={nextStep}
          style={styles.button(true)}
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

export default PremiumBreakdownPage;
