import React from 'react';
import { useAutoQuote } from '../context/AutoContext';
import { InsurerComparisonTable } from '../components/QuoteResponse';
import MockDisclaimer from '../components/MockDisclaimer';

/**
 * QuoteComparisonPage Component
 * Screen 3 bottom - Displays insurer quote comparison and allows selection for detail view
 *
 * @component
 * @returns {React.ReactElement} The quote comparison page
 */
const QuoteComparisonPage = () => {
  const { quoteResponses, nextStep, prevStep, selectedInsurerIndex, setSelectedInsurerIndex, isLoading, quoteFailureReason } = useAutoQuote();

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    success: '#1a7f37',
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
    selectionHint: {
      padding: '12px 16px',
      backgroundColor: '#e8f5ff',
      border: `1px solid ${colors.accent}30`,
      borderRadius: '4px',
      fontSize: '13px',
      color: colors.text,
      marginTop: '16px',
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

  const handleViewDetails = () => {
    if (selectedInsurerIndex !== null) {
      nextStep();
    }
  };

  const selectedResponse = selectedInsurerIndex !== null ? quoteResponses?.[selectedInsurerIndex] : null;
  const isSelectedReady = selectedResponse && selectedResponse._status !== 'loading' && selectedResponse._status !== 'error';
  const isViewDetailsDisabled = !isSelectedReady;

  if (!quoteResponses || quoteResponses.length === 0) {
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
              e.target.style.backgroundColor = colors.lightGray;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.white;
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
      <MockDisclaimer />
      <h1 style={styles.title}>Insurer Quote Comparison</h1>
      <p style={styles.subtitle}>
        Select an insurer to view detailed coverage breakdown and premium information
      </p>

      {quoteFailureReason && (
        <div style={styles.errorBanner}>{quoteFailureReason}</div>
      )}

      <div style={styles.tableWrapper}>
        <InsurerComparisonTable
          responses={quoteResponses}
          onSelectInsurer={setSelectedInsurerIndex}
          selectedIndex={selectedInsurerIndex}
        />
        {isSelectedReady && (
          <div style={styles.selectionHint}>
            Selected: {quoteResponses[selectedInsurerIndex]?.insurerName}
          </div>
        )}
        {isLoading && (
          <div style={{ padding: '8px 16px', fontSize: '13px', color: '#666', marginTop: '8px' }}>
            Fetching quotes... {quoteResponses.filter(r => r._status === 'done').length} of {quoteResponses.length} received
          </div>
        )}
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

export default QuoteComparisonPage;
