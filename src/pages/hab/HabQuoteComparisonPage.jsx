import React from 'react';
import { useHab } from '../../context/HabContext';
import { formatCurrency } from '../../utils/formatters';
import MockDisclaimer from '../../components/MockDisclaimer';

/**
 * HabQuoteComparisonPage Component
 * Displays habitational insurer quote comparison in a table with radio buttons for single selection
 * Similar to auto QuoteComparisonPage
 *
 * @component
 * @returns {React.ReactElement} The quote comparison page
 */
const HabQuoteComparisonPage = () => {
  const { habResponses, nextStep, prevStep, selectedInsurerIndex, setSelectedInsurerIndex, isLoading, quoteFailureReason } =
    useHab();

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    success: '#1a7f37',
    lightAccent: '#e8f5ff',
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
    title: {
      fontSize: '28px',
      fontWeight: 700,
      color: colors.navy,
      marginBottom: '8px',
      letterSpacing: '0.5px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '32px',
      fontWeight: 400,
    },
    tableWrapper: {
      marginBottom: '32px',
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      overflow: 'hidden',
      backgroundColor: colors.white,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    headerRow: {
      backgroundColor: colors.lightGray,
      borderBottom: `2px solid ${colors.border}`,
    },
    headerCell: {
      padding: '16px 20px',
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: 700,
      color: colors.navy,
      textTransform: 'none',
      letterSpacing: '0.3px',
    },
    dataRow: (isSelected) => ({
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: isSelected ? colors.lightAccent : colors.white,
      transition: 'background-color 0.2s ease',
      cursor: 'pointer',
    }),
    dataCell: {
      padding: '16px 20px',
      fontSize: '14px',
      verticalAlign: 'middle',
      color: colors.text,
    },
    radioCellContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginRight: '12px',
    },
    radioInput: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: colors.accent,
    },
    insurerName: {
      fontWeight: 600,
      color: colors.navy,
    },
    premium: {
      fontWeight: 600,
      fontSize: '15px',
      color: colors.navy,
    },
    emptyState: {
      padding: '48px 24px',
      textAlign: 'center',
      backgroundColor: colors.lightGray,
      borderRadius: '4px',
      marginBottom: '32px',
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
    selectionHint: {
      padding: '12px 16px',
      backgroundColor: colors.lightAccent,
      border: `1px solid ${colors.accent}30`,
      borderRadius: '4px',
      fontSize: '13px',
      color: colors.text,
      marginTop: '16px',
      fontWeight: 500,
    },
    errorBanner: {
      backgroundColor: '#fce8e6',
      border: `1px solid ${colors.error}`,
      color: colors.error,
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '24px',
      fontSize: '14px',
      fontWeight: 500,
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
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

  const handleSelectInsurer = (index) => {
    const response = habResponses?.[index];
    if (response && response._status !== 'loading' && response._status !== 'error' && response._status !== 'failed-producer') {
      setSelectedInsurerIndex(index);
    }
  };

  const handleViewDetails = () => {
    if (selectedInsurerIndex !== null) {
      nextStep();
    }
  };

  const selectedResponse = selectedInsurerIndex !== null ? habResponses?.[selectedInsurerIndex] : null;
  const isSelectedReady = selectedResponse && selectedResponse._status !== 'loading' && selectedResponse._status !== 'error' && selectedResponse._status !== 'failed-producer';
  const isViewDetailsDisabled = !isSelectedReady;

  const spinnerStyle = {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid #e0e0e0',
    borderTop: `2px solid ${colors.accent}`,
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  };

  if (!habResponses || habResponses.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <MockDisclaimer />
        <h1 style={styles.title}>Insurer Quote Comparison</h1>
        <p style={styles.subtitle}>Compare quotes from selected insurers</p>

        <div style={styles.emptyState}>
          <div style={styles.emptyStateTitle}>No Quotes Available</div>
          <div style={styles.emptyStateText}>
            Submit the insurer selection form to retrieve quote comparisons.
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
            Back
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
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <MockDisclaimer />
      <h1 style={styles.title}>Insurer Quote Comparison</h1>
      <p style={styles.subtitle}>
        Select an insurer to view detailed coverage breakdown and premium information
      </p>

      {quoteFailureReason && (
        <div style={styles.errorBanner}>{quoteFailureReason}</div>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={{ ...styles.headerCell, width: '50%' }}>Select Insurers</th>
              <th style={{ ...styles.headerCell, width: '50%', textAlign: 'right' }}>
                Annual Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {habResponses.map((response, index) => {
              const rowLoading = response._status === 'loading';
              const rowError = response._status === 'error';
              const rowFailedProducer = response._status === 'failed-producer';
              const rowReady = !rowLoading && !rowError && !rowFailedProducer;

              return (
                <tr
                  key={index}
                  style={{
                    ...styles.dataRow(selectedInsurerIndex === index && rowReady),
                    cursor: rowReady ? 'pointer' : 'default',
                    opacity: rowLoading ? 0.7 : 1,
                  }}
                  onClick={() => handleSelectInsurer(index)}
                >
                  <td style={{ ...styles.dataCell, display: 'flex', alignItems: 'center' }}>
                    <div style={styles.radioCellContent}>
                      <input
                        type="radio"
                        name="insurer-selection"
                        checked={selectedInsurerIndex === index}
                        onChange={() => handleSelectInsurer(index)}
                        disabled={!rowReady}
                        style={{ ...styles.radioInput, cursor: rowReady ? 'pointer' : 'not-allowed' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <span style={styles.insurerName}>{response.insurerName}</span>
                  </td>
                  <td style={{ ...styles.dataCell, textAlign: 'right' }}>
                    {rowLoading && (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', color: '#666' }}>
                        <span style={spinnerStyle} /> Quoting...
                      </span>
                    )}
                    {rowError && (
                      <span style={{ color: '#cf222e', fontWeight: 500 }}>Failed</span>
                    )}
                    {rowFailedProducer && (
                      <span style={{ color: '#666', fontWeight: 500 }}>—</span>
                    )}
                    {rowReady && (
                      <span style={styles.premium}>{formatCurrency(response.premiums?.annual)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isSelectedReady && (
        <div style={styles.selectionHint}>
          Selected: {habResponses[selectedInsurerIndex]?.insurerName}
        </div>
      )}
      {isLoading && (
        <div style={{ padding: '8px 16px', fontSize: '13px', color: '#666', marginTop: '8px' }}>
          Fetching quotes... {habResponses.filter(r => r._status === 'done').length} of {habResponses.length} received
        </div>
      )}

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
          onClick={handleViewDetails}
          disabled={isViewDetailsDisabled}
          style={styles.button(true, isViewDetailsDisabled)}
          onMouseEnter={(e) => {
            if (!isViewDetailsDisabled) {
              e.target.style.boxShadow = '0 4px 12px rgba(42, 82, 152, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default HabQuoteComparisonPage;
