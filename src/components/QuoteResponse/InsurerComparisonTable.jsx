import React from 'react';
import { formatCurrency } from '../../utils/formatters';

/**
 * InsurerComparisonTable Component
 * Displays a comparison table of insurer quotes with single-select radio buttons
 *
 * @component
 * @param {Array<Object>} responses - Array of insurer response objects
 * @param {string} responses[].insurerName - Name of the insurer
 * @param {number} responses[].premiums.annual - Annual premium amount
 * @param {function} onSelectInsurer - Callback when an insurer is selected (index as argument)
 * @param {number} selectedIndex - Currently selected insurer index
 * @returns {React.ReactElement} The comparison table component
 */
const InsurerComparisonTable = ({ responses, onSelectInsurer, selectedIndex }) => {
  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    lightBlue: '#e8f0ff',
  };

  const styles = {
    container: {
      width: '100%',
      borderCollapse: 'collapse',
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      overflow: 'hidden',
      backgroundColor: colors.white,
    },
    headerRow: {
      backgroundColor: colors.navy,
      borderBottom: `2px solid ${colors.accent}`,
    },
    headerCell: {
      padding: '16px',
      fontSize: '13px',
      fontWeight: 600,
      color: colors.white,
      textAlign: 'left',
      letterSpacing: '0.3px',
    },
    headerCellRight: {
      textAlign: 'right',
      paddingRight: '24px',
    },
    dataRow: (isSelected, isEven) => ({
      backgroundColor: isSelected ? colors.lightBlue : isEven ? colors.lightGray : colors.white,
      borderBottom: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      height: '60px',
      alignItems: 'center',
    }),
    dataCell: {
      padding: '16px',
      fontSize: '14px',
      color: colors.text,
      fontWeight: 500,
    },
    dataCellRight: {
      textAlign: 'right',
      paddingRight: '24px',
    },
    radioContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: '8px',
      marginRight: '12px',
    },
    radio: {
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
      fontWeight: 700,
      fontSize: '15px',
      color: colors.navy,
    },
  };

  if (!responses || responses.length === 0) {
    return (
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          color: colors.text,
          backgroundColor: colors.lightGray,
          borderRadius: '4px',
        }}
      >
        No quote responses available. Submit the form to get insurer quotes.
      </div>
    );
  }

  const spinnerStyle = {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid #e0e0e0',
    borderTop: `2px solid ${colors.accent}`,
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <table style={styles.container}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={{ ...styles.headerCell, width: '50%' }}>Select Insurers</th>
            <th style={{ ...styles.headerCell, ...styles.headerCellRight, width: '50%' }}>
              Annual Premium
            </th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => {
            const isLoading = response._status === 'loading';
            const isError = response._status === 'error';
            const isFailedProducer = response._status === 'failed-producer';
            const isReady = !isLoading && !isError && !isFailedProducer;

            return (
              <tr
                key={index}
                style={{
                  ...styles.dataRow(selectedIndex === index && isReady, index % 2 === 1),
                  cursor: isReady ? 'pointer' : 'default',
                  opacity: isLoading ? 0.7 : 1,
                }}
                onClick={() => isReady && onSelectInsurer(index)}
              >
                <td style={{ ...styles.dataCell, display: 'flex', alignItems: 'center' }}>
                  <span style={styles.radioContainer}>
                    <input
                      type="radio"
                      name="insurer-select"
                      checked={selectedIndex === index}
                      onChange={() => isReady && onSelectInsurer(index)}
                      disabled={!isReady}
                      style={{ ...styles.radio, cursor: isReady ? 'pointer' : 'not-allowed' }}
                    />
                  </span>
                  <span style={styles.insurerName}>{response.insurerName}</span>
                </td>
                <td style={{ ...styles.dataCell, ...styles.dataCellRight }}>
                  {isLoading && (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', color: '#666' }}>
                      <span style={spinnerStyle} /> Quoting...
                    </span>
                  )}
                  {isError && (
                    <span style={{ color: '#cf222e', fontWeight: 500 }}>Failed</span>
                  )}
                  {isFailedProducer && (
                    <span style={{ color: '#666', fontWeight: 500 }}>—</span>
                  )}
                  {isReady && (
                    <span style={styles.premium}>
                      {formatCurrency(response.premiums?.annual)}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default InsurerComparisonTable;
