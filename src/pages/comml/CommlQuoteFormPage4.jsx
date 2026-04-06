/**
 * CommlQuoteFormPage4 Component
 * Fourth page of the commercial insurance quote form wizard
 * Collects coverages requested
 *
 * All coverages use Yes/No radio buttons per mockup design.
 * Coverages with limits show a limit input when "Yes" is selected.
 *
 * @component
 * @returns {JSX.Element} The fourth form page
 */

import React, { useState } from 'react';
import {
  TextInput,
  SectionHeader,
  RadioGroup,
} from '../../components/FormControls';
import { useComml } from '../../context/CommlContext';

const CommlQuoteFormPage4 = () => {
  const { commlData, updateCommlData, nextStep, prevStep } = useComml();
  const [errors, setErrors] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);

  const yesNoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  // Styles
  const styles = {
    pageContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
    },
    errorBox: {
      backgroundColor: '#ffebee',
      border: '2px solid #f44336',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '2rem',
      color: '#c62828',
      fontSize: '0.95rem',
      lineHeight: '1.5',
    },
    errorTitle: {
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    errorList: {
      marginLeft: '1.5rem',
      listStyle: 'disc',
    },
    sectionContainer: {
      marginBottom: '2rem',
    },
    rowContainer: {
      display: 'grid',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    twoColumnRow: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    fullWidthRow: {
      gridTemplateColumns: '1fr',
    },
    coverageRowContainer: {
      border: '1px solid #d0d0d0',
      borderRadius: '6px',
      padding: '0',
      marginBottom: '1.5rem',
      overflow: 'hidden',
    },
    coverageRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '0',
      padding: '1rem',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    coverageLabel: {
      fontSize: '0.95rem',
      color: '#333',
      fontWeight: '500',
    },
    radioCell: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    limitCell: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingRight: '1rem',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    limitInput: {
      width: '100%',
      maxWidth: '200px',
      padding: '0.5rem 0.75rem',
      fontSize: '0.9rem',
      border: '1px solid var(--color-border, #d0d7de)',
      borderRadius: 'var(--border-radius, 6px)',
      fontFamily: 'var(--font-family)',
      backgroundColor: 'var(--color-white, #ffffff)',
      color: 'var(--color-text, #333)',
      boxSizing: 'border-box',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '3rem',
      justifyContent: 'flex-end',
    },
    buttonBase: {
      padding: '0.875rem 1.75rem',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    },
  };

  // Helper function for coverage updates
  const updateCoverages = (field, value) => {
    const current = commlData.building?.coverages || {};
    updateCommlData('building', { coverages: { ...current, [field]: value } });
  };

  // Convert boolean/string coverage value to Yes/No for radio display
  const getCoverageRadioValue = (key) => {
    const val = commlData.building?.coverages?.[key];
    if (val === true || val === 'Yes') return 'Yes';
    if (val === false || val === 'No') return 'No';
    return '';
  };

  // Check if coverage is selected (Yes)
  const isCoverageSelected = (key) => {
    const val = commlData.building?.coverages?.[key];
    return val === true || val === 'Yes';
  };

  // Handle coverage radio change — store as 'Yes'/'No' string
  const handleCoverageRadioChange = (key, e) => {
    updateCoverages(key, e.target.value);
  };

  // Validation function
  const validateForm = () => {
    const missingFields = [];
    // This page is optional for now
    return missingFields;
  };

  const handleNext = () => {
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      setErrors(missingFields);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors([]);
    nextStep();
  };

  // Get button style based on type and hover state
  const getButtonStyle = (buttonType) => {
    const base = { ...styles.buttonBase };
    if (buttonType === 'primary') {
      base.backgroundColor = '#0a1e3d';
      base.color = '#ffffff';
      base.border = 'none';
      if (hoveredButton === 'next') {
        base.backgroundColor = '#1a3a6b';
      }
    } else {
      base.backgroundColor = 'transparent';
      base.color = '#0a1e3d';
      base.border = '2px solid #0a1e3d';
      if (hoveredButton === 'back') {
        base.backgroundColor = '#f0f0f0';
      }
    }
    return base;
  };

  // Location coverage rows configuration
  const locationCoverageRows = [
    { key: 'buildingCov', label: 'Building', hasLimit: true, limitKey: 'buildingLimit' },
    { key: 'equipmentCov', label: 'Equipment', hasLimit: true, limitKey: 'equipmentLimit' },
    { key: 'stockCov', label: 'Stock', hasLimit: false },
    { key: 'contentsCov', label: 'Contents', hasLimit: false },
    { key: 'sewerBackup', label: 'Sewer Backup', hasLimit: true, limitKey: 'sewerBackupLimit' },
    { key: 'flood', label: 'Flood', hasLimit: false },
    { key: 'earthquake', label: 'Earthquake', hasLimit: false },
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Error Messages */}
      {errors.length > 0 && (
        <div style={styles.errorBox}>
          <div style={styles.errorTitle}>Please fill in the following required fields:</div>
          <ul style={styles.errorList}>
            {errors.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Page Title */}
      <h1 style={{ marginBottom: '2rem', color: '#0a1e3d', fontSize: '1.75rem' }}>
        Commercial Lines — Coverages Requested
      </h1>

      {/* Policy Level Coverages Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Policy Level Coverages" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <RadioGroup
            label="Commercial General Liability"
            name="cgl"
            value={getCoverageRadioValue('cgl')}
            onChange={(e) => handleCoverageRadioChange('cgl', e)}
            options={yesNoOptions}
            inline={true}
          />
          {isCoverageSelected('cgl') && (
            <TextInput
              label="CGL Limit"
              name="cglLimit"
              value={commlData.building?.coverages?.cglLimit || ''}
              onChange={(e) => updateCoverages('cglLimit', e.target.value)}
              placeholder="e.g. $1,000,000"
            />
          )}
        </div>
      </div>

      {/* Additional Coverages Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Additional Coverages" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <RadioGroup
            label="Contractor Equipment"
            name="contractorEquipment"
            value={getCoverageRadioValue('contractorEquipment')}
            onChange={(e) => handleCoverageRadioChange('contractorEquipment', e)}
            options={yesNoOptions}
            inline={true}
          />
          <RadioGroup
            label="Tool Floater"
            name="toolFloater"
            value={getCoverageRadioValue('toolFloater')}
            onChange={(e) => handleCoverageRadioChange('toolFloater', e)}
            options={yesNoOptions}
            inline={true}
          />
        </div>
      </div>

      {/* Location Coverages Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Location 1 Coverages" />

        <div style={styles.coverageRowContainer}>
          {/* Header Row */}
          <div
            style={{
              ...styles.coverageRow,
              backgroundColor: '#f5f7fa',
              borderBottom: '1px solid #d0d0d0',
              fontWeight: '600',
              fontSize: '0.85rem',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <div>Coverage</div>
            <div style={{ textAlign: 'center' }}>Include?</div>
            <div>Limit</div>
          </div>

          {locationCoverageRows.map((coverage, index) => (
            <div
              key={coverage.key}
              style={{
                ...styles.coverageRow,
                borderBottom: index < locationCoverageRows.length - 1 ? '1px solid #e8e8e8' : 'none',
              }}
            >
              {/* Coverage Label */}
              <div style={styles.coverageLabel}>
                {coverage.label}
              </div>

              {/* Yes/No Radio (Center) */}
              <div style={styles.radioCell}>
                <RadioGroup
                  name={`loc_${coverage.key}`}
                  value={getCoverageRadioValue(coverage.key)}
                  onChange={(e) => handleCoverageRadioChange(coverage.key, e)}
                  options={yesNoOptions}
                  inline={true}
                />
              </div>

              {/* Limit Input (Right, only if applicable and selected) */}
              <div style={styles.limitCell}>
                {coverage.hasLimit && isCoverageSelected(coverage.key) && (
                  <input
                    type="text"
                    placeholder="Limit"
                    value={commlData.building?.coverages?.[coverage.limitKey] || ''}
                    onChange={(e) => updateCoverages(coverage.limitKey, e.target.value)}
                    style={styles.limitInput}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button Group */}
      <div style={styles.buttonGroup}>
        <button
          style={getButtonStyle('secondary')}
          onClick={prevStep}
          onMouseEnter={() => setHoveredButton('back')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Back
        </button>
        <button
          style={getButtonStyle('primary')}
          onClick={handleNext}
          onMouseEnter={() => setHoveredButton('next')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommlQuoteFormPage4;
