import React from 'react';
import { formatCurrency } from '../../utils/formatters';

/**
 * CoverageBreakdownTable Component
 * Displays detailed coverage information in a professional table format
 *
 * @component
 * @param {Array<Object>} coverages - Array of coverage objects
 * @param {string} coverages[].name - Coverage name
 * @param {number} coverages[].coverageAmount - Coverage amount limit
 * @param {number} coverages[].deductible - Deductible amount
 * @param {number} coverages[].premium - Premium for this coverage
 * @param {string} vehicleSummary - Vehicle summary string (e.g., "2024 Honda Civic")
 * @returns {React.ReactElement} The coverage breakdown table component
 */
const CoverageBreakdownTable = ({ coverages, vehicleSummary }) => {
  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
  };

  const styles = {
    wrapper: {
      width: '100%',
    },
    vehicleHeader: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.navy,
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${colors.accent}`,
    },
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
      borderRight: `1px solid ${colors.accent}`,
    },
    headerCellLast: {
      borderRight: 'none',
      textAlign: 'right',
      paddingRight: '24px',
    },
    dataRow: (isEven) => ({
      backgroundColor: isEven ? colors.lightGray : colors.white,
      borderBottom: `1px solid ${colors.border}`,
      height: '48px',
    }),
    dataCell: {
      padding: '16px',
      fontSize: '14px',
      color: colors.text,
      fontWeight: 500,
      borderRight: `1px solid ${colors.border}`,
      verticalAlign: 'middle',
    },
    dataCellLast: {
      borderRight: 'none',
      textAlign: 'right',
      paddingRight: '24px',
      fontWeight: 600,
      fontSize: '15px',
      color: colors.navy,
    },
    coverageName: {
      fontWeight: 600,
      color: colors.navy,
    },
  };

  if (!coverages || coverages.length === 0) {
    return (
      <div style={styles.wrapper}>
        {vehicleSummary && <div style={styles.vehicleHeader}>{vehicleSummary}</div>}
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            color: colors.text,
            backgroundColor: colors.lightGray,
            borderRadius: '4px',
          }}
        >
          No coverage information available.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {vehicleSummary && <div style={styles.vehicleHeader}>{vehicleSummary}</div>}
      <table style={styles.container}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={{ ...styles.headerCell, width: '35%' }}>Coverage</th>
            <th style={{ ...styles.headerCell, width: '25%' }}>Coverage Amount</th>
            <th style={{ ...styles.headerCell, width: '20%' }}>Deductible</th>
            <th style={{ ...styles.headerCell, ...styles.headerCellLast, width: '20%' }}>
              Premium
            </th>
          </tr>
        </thead>
        <tbody>
          {coverages.map((coverage, index) => (
            <tr key={index} style={styles.dataRow(index % 2 === 1)}>
              <td style={{ ...styles.dataCell }}>
                <span style={styles.coverageName}>{coverage.name}</span>
              </td>
              <td style={styles.dataCell}>{formatCurrency(coverage.coverageAmount, { noDecimals: true })}</td>
              <td style={styles.dataCell}>{formatCurrency(coverage.deductible)}</td>
              <td style={{ ...styles.dataCell, ...styles.dataCellLast }}>
                {formatCurrency(coverage.premium)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoverageBreakdownTable;
