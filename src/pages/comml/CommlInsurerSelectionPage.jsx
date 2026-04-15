import React, { useState } from 'react';
import { useComml } from '../../context/CommlContext';
import CheckboxInput from '../../components/FormControls/CheckboxInput';
import MockDisclaimer from '../../components/MockDisclaimer';

/**
 * CommlInsurerSelectionPage Component
 * Allows users to select which insurers to request quotes from
 * Follows the same pattern as auto InsurerSelectionPage
 *
 * @component
 * @returns {React.ReactElement} The insurer selection page
 */
const CommlInsurerSelectionPage = () => {
  const { commlData, setSelectedInsurers, submitQuote, nextStep, prevStep, isLoading, error } =
    useComml();

  /** Insurer list — id must match the keys in server/mockData.js */
  const AVAILABLE_INSURERS = [
    { id: 'aviva', name: 'Alpha Insurance' },
    { id: 'intact', name: 'Indigo Ins. Co.' },
    { id: 'definity', name: 'Delta Insurance' },
    { id: 'wawanesa', name: 'Beta Insurance Inc.' },
    { id: 'caa', name: 'Coach Insurance' },
    { id: 'goreMutual', name: 'Gamma Insurance' },
  ];

  const [localSelectedInsurers, setLocalSelectedInsurers] = useState(
    commlData.selectedInsurers || []
  );

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    error: '#cf222e',
  };

  const styles = {
    pageContainer: {
      maxWidth: '800px',
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
    insurerListContainer: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '32px',
    },
    insurerItem: (isFirst, isLast) => ({
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: isLast ? 'none' : `1px solid ${colors.border}`,
      backgroundColor: 'transparent',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    }),
    insurerLabel: {
      fontSize: '15px',
      fontWeight: 500,
      color: colors.text,
      cursor: 'pointer',
      userSelect: 'none',
    },
    checkboxWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    errorMessage: {
      backgroundColor: '#fce8e6',
      border: `1px solid ${colors.error}`,
      color: colors.error,
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '24px',
      fontSize: '14px',
      fontWeight: 500,
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: `3px solid ${colors.lightGray}`,
      borderTop: `3px solid ${colors.accent}`,
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
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

  const handleInsurerChange = (insurerId) => {
    setLocalSelectedInsurers((prev) => {
      if (prev.includes(insurerId)) {
        return prev.filter((i) => i !== insurerId);
      } else {
        return [...prev, insurerId];
      }
    });
  };

  const handleSubmitQuotes = () => {
    setSelectedInsurers(localSelectedInsurers);

    const insurerMeta = AVAILABLE_INSURERS
      .filter((ins) => localSelectedInsurers.includes(ins.id));

    submitQuote({
      selectedInsurers: localSelectedInsurers,
      _insurerMeta: insurerMeta,
    });

    nextStep();
  };

  const isSubmitDisabled = localSelectedInsurers.length === 0;

  return (
    <div style={styles.pageContainer}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        div[data-insurer-item]:hover {
          background-color: ${colors.lightGray};
        }
      `}</style>

      <MockDisclaimer />
      <h1 style={styles.title}>Select Insurers for Quote</h1>
      <p style={styles.subtitle}>Choose one or more insurers to receive quotes from</p>

      {error && <div style={styles.errorMessage}>{error}</div>}

      <div style={styles.insurerListContainer}>
        {AVAILABLE_INSURERS.map((insurer, index) => (
          <div
            key={insurer.id}
            data-insurer-item="true"
            style={styles.insurerItem(index === 0, index === AVAILABLE_INSURERS.length - 1)}
            onClick={() => handleInsurerChange(insurer.id)}
          >
            <span style={styles.insurerLabel}>{insurer.name}</span>
            <div style={styles.checkboxWrapper} onClick={(e) => e.stopPropagation()}>
              <CheckboxInput
                name={`insurer-${insurer.id}`}
                checked={localSelectedInsurers.includes(insurer.id)}
                onChange={() => handleInsurerChange(insurer.id)}
                label=""
              />
            </div>
          </div>
        ))}
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
          onClick={handleSubmitQuotes}
          disabled={isSubmitDisabled}
          style={styles.button(true, isSubmitDisabled)}
          onMouseEnter={(e) => {
            if (!isSubmitDisabled) {
              e.target.style.boxShadow = '0 4px 12px rgba(42, 82, 152, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={styles.loadingSpinner} /> Getting Quotes...
            </span>
          ) : (
            'Submit for Quote'
          )}
        </button>
      </div>
    </div>
  );
};

export default CommlInsurerSelectionPage;
