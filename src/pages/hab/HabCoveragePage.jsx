import React, { useState, useEffect } from 'react';
import { useHab } from '../../context/HabContext';
import { formatCurrency } from '../../utils/formatters';
import MockDisclaimer from '../../components/MockDisclaimer';
import { RadioGroup } from '../../components/FormControls';

/**
 * HabCoveragePage Component
 * Coverage selection form with Amount and Deductible inputs
 * This is the coverage entry form BEFORE insurer selection.
 *
 * @component
 * @returns {React.ReactElement} The habitational coverage page
 */
const HabCoveragePage = () => {
  const { habData, updateHabData, nextStep, prevStep } = useHab();

  const [coverages, setCoverages] = useState(habData.coverages || {});

  // Initialize coverages if empty
  useEffect(() => {
    const estCost = habData.replacementCost?.estimatedReplacementCost || '';
    if (!habData.coverages || Object.keys(habData.coverages).length === 0) {
      const initialCoverages = {
        dwellingBuilding: { enabled: false, amount: estCost, deductible: '' },
        detachedPrivateStructures: { enabled: false, amount: '', deductible: '' },
        personalProperty: { enabled: false, amount: '', deductible: '' },
        additionalLivingExpenses: { enabled: false, amount: '', deductible: '' },
        legalLiability: { enabled: false, amount: '', deductible: '' },
        voluntaryMedicalPayments: { enabled: false, amount: '', deductible: '' },
        voluntaryPropertyDamage: { enabled: false, amount: '', deductible: '' },
        sewerBackup: { enabled: false, amount: '', deductible: '' },
        legalServices: { enabled: true, amount: '25000', deductible: '' },
        identityTheftProtection: { enabled: true, amount: '25000', deductible: '' },
      };
      setCoverages(initialCoverages);
      updateHabData('coverages', initialCoverages);
    } else {
      // Sync dwelling building amount with estimated replacement cost if it changed
      const currentDwelling = habData.coverages.dwellingBuilding;
      if (estCost && currentDwelling && currentDwelling.amount !== estCost) {
        const updatedCoverages = {
          ...habData.coverages,
          dwellingBuilding: { ...currentDwelling, amount: estCost },
        };
        setCoverages(updatedCoverages);
        updateHabData('coverages', updatedCoverages);
      } else {
        setCoverages(habData.coverages);
      }
    }
  }, [habData.coverages, habData.replacementCost?.estimatedReplacementCost, updateHabData]);

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    lightAccent: '#e8f5ff',
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
    tableContainer: {
      overflow: 'x auto',
      marginBottom: '32px',
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
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
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    dataRow: {
      borderBottom: `1px solid ${colors.border}`,
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: colors.lightAccent,
      },
    },
    dataCell: {
      padding: '16px 20px',
      fontSize: '14px',
      verticalAlign: 'middle',
    },
    coverageLabel: {
      fontWeight: 500,
      color: colors.text,
    },
    checkboxInput: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: colors.accent,
    },
    textInput: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      fontFamily: 'inherit',
      color: colors.text,
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease',
    },
    textInputDisabled: {
      backgroundColor: colors.lightGray,
      cursor: 'not-allowed',
      opacity: 0.6,
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

  const coverageDefinitions = [
    { key: 'dwellingBuilding', label: 'Dwelling Building' },
    { key: 'detachedPrivateStructures', label: 'Detached Private Structures' },
    { key: 'personalProperty', label: 'Personal Property' },
    { key: 'additionalLivingExpenses', label: 'Additional Living Expenses' },
    { key: 'legalLiability', label: 'Legal Liability' },
    { key: 'voluntaryMedicalPayments', label: 'Voluntary Medical Payments' },
    { key: 'voluntaryPropertyDamage', label: 'Voluntary Property Damage' },
    { key: 'sewerBackup', label: 'Sewer Backup' },
    { key: 'legalServices', label: 'Legal Services', locked: true },
    { key: 'identityTheftProtection', label: 'Identity Theft Protection', locked: true },
  ];

  const handleToggleCoverage = (coverageKey) => {
    const updatedCoverage = {
      ...coverages[coverageKey],
      enabled: !coverages[coverageKey].enabled,
    };
    const updatedCoverages = {
      ...coverages,
      [coverageKey]: updatedCoverage,
    };
    setCoverages(updatedCoverages);
    updateHabData('coverages', updatedCoverages);
  };

  const handleAmountChange = (coverageKey, value) => {
    const updatedCoverage = {
      ...coverages[coverageKey],
      amount: value,
    };
    const updatedCoverages = {
      ...coverages,
      [coverageKey]: updatedCoverage,
    };
    setCoverages(updatedCoverages);
    updateHabData('coverages', updatedCoverages);
  };

  const handleDeductibleChange = (coverageKey, value) => {
    const updatedCoverage = {
      ...coverages[coverageKey],
      deductible: value,
    };
    const updatedCoverages = {
      ...coverages,
      [coverageKey]: updatedCoverage,
    };
    setCoverages(updatedCoverages);
    updateHabData('coverages', updatedCoverages);
  };

  const handleNext = () => {
    updateHabData('coverages', coverages);
    nextStep();
  };

  return (
    <div style={styles.pageContainer}>
      <style>{`
        tr:hover {
          background-color: ${colors.lightAccent};
        }
        input[type="text"]:focus {
          outline: none;
          border-color: ${colors.accent} !important;
          box-shadow: 0 0 0 3px ${colors.accent}20;
        }
      `}</style>

      <MockDisclaimer />
      <h1 style={styles.title}>Coverage Selection</h1>
      <p style={styles.subtitle}>Select the coverages you need and specify amounts and deductibles</p>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={{ ...styles.headerCell, width: '35%' }}>Coverage Name</th>
              <th style={{ ...styles.headerCell, width: '15%', textAlign: 'center' }}>Included</th>
              <th style={{ ...styles.headerCell, width: '25%' }}>Coverage Amount</th>
              <th style={{ ...styles.headerCell, width: '25%' }}>Deductible</th>
            </tr>
          </thead>
          <tbody>
            {coverageDefinitions.map((coverage) => {
              const coverageData = coverages[coverage.key] || {
                enabled: false,
                amount: '',
                deductible: '',
              };
              const isLocked = coverage.locked;

              return (
                <tr key={coverage.key} style={styles.dataRow}>
                  <td style={{ ...styles.dataCell, ...styles.coverageLabel }}>
                    {coverage.label}
                  </td>
                  <td style={{ ...styles.dataCell, textAlign: 'center' }}>
                    {isLocked ? (
                      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>Yes</span>
                    ) : (
                      <RadioGroup
                        label=""
                        name={`coverage-${coverage.key}`}
                        value={coverageData.enabled ? 'Yes' : 'No'}
                        onChange={(e) => {
                          const isEnabled = e.target.value === 'Yes';
                          const updatedCoverage = { ...coverages[coverage.key], enabled: isEnabled };
                          const updatedCoverages = { ...coverages, [coverage.key]: updatedCoverage };
                          setCoverages(updatedCoverages);
                          updateHabData('coverages', updatedCoverages);
                        }}
                        options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                        inline={true}
                      />
                    )}
                  </td>
                  <td style={styles.dataCell}>
                    <input
                      type="text"
                      placeholder="$0"
                      value={coverageData.amount}
                      onChange={(e) => handleAmountChange(coverage.key, e.target.value)}
                      disabled={!coverageData.enabled || isLocked}
                      style={{
                        ...styles.textInput,
                        ...((!coverageData.enabled || isLocked) ? styles.textInputDisabled : {}),
                      }}
                    />
                  </td>
                  <td style={styles.dataCell}>
                    <input
                      type="text"
                      placeholder="$0"
                      value={coverageData.deductible}
                      onChange={(e) => handleDeductibleChange(coverage.key, e.target.value)}
                      disabled={!coverageData.enabled || isLocked}
                      style={{
                        ...styles.textInput,
                        ...((!coverageData.enabled || isLocked) ? styles.textInputDisabled : {}),
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
          onClick={handleNext}
          style={styles.button(true, false)}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(42, 82, 152, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HabCoveragePage;
