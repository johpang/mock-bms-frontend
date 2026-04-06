/**
 * CommlQuoteFormPage3 Component
 * Third page of the commercial insurance quote form wizard
 * Collects protection features and building improvements
 *
 * @component
 * @returns {JSX.Element} The third form page
 */

import React, { useState } from 'react';
import {
  TextInput,
  SelectInput,
  SectionHeader,
  RadioGroup,
} from '../../components/FormControls';
import { useComml } from '../../context/CommlContext';

const CommlQuoteFormPage3 = () => {
  const { commlData, updateCommlData, nextStep, prevStep } = useComml();
  const [errors, setErrors] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Field options
  const alarmOptions = [
    { value: 'LocalAlarm', label: 'Local Alarm' },
    { value: 'None', label: 'None' },
  ];

  const fireProtectionOptions = [
    { value: 'Unprotected', label: 'Unprotected' },
    { value: 'Semi-protected', label: 'Semi-protected' },
    { value: 'Protected', label: 'Protected' },
  ];

  const sprinkleredOptions = [
    { value: '1', label: 'Yes' },
    { value: '0', label: 'No' },
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
    threeColumnRow: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    twoColumnRow: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    fourColumnRow: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    fullWidthRow: {
      gridTemplateColumns: '1fr',
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

  // Helper functions for nested updates
  const updateProtection = (field, value) => {
    const current = commlData.building?.protection || {};
    updateCommlData('building', { protection: { ...current, [field]: value } });
  };

  const updateImprovements = (field, value) => {
    const current = commlData.building?.improvements || {};
    updateCommlData('building', { improvements: { ...current, [field]: value } });
  };

  // Validation function
  const validateForm = () => {
    const missingFields = [];

    // Protection fields
    if (commlData.building?.protection?.fireProtection === undefined || commlData.building?.protection?.fireProtection === '') {
      missingFields.push('Fire Protection');
    }
    if (commlData.building?.protection?.sprinklered === undefined || commlData.building?.protection?.sprinklered === '') {
      missingFields.push('Fully Sprinklered');
    }

    // Building Improvements (YYYY format)
    if (!commlData.building?.improvements?.heating?.trim()) missingFields.push('Heating Year');
    if (!commlData.building?.improvements?.plumbing?.trim()) missingFields.push('Plumbing Year');
    if (!commlData.building?.improvements?.electrical?.trim()) missingFields.push('Electrical Year');
    if (!commlData.building?.improvements?.roof?.trim()) missingFields.push('Roof Year');

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
        Commercial Lines — Protection & Improvements
      </h1>

      {/* Protection Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Protection" />

        {/* Row 1: Burglar Alarm, Fire Alarm */}
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <SelectInput
            label="Burglar Alarm System"
            name="burglarAlarm"
            value={commlData.building?.protection?.burglarAlarm || ''}
            onChange={(e) => updateProtection('burglarAlarm', e.target.value)}
            options={alarmOptions}
            placeholder="Select alarm type"
          />
          <SelectInput
            label="Fire Alarm System"
            name="fireAlarm"
            value={commlData.building?.protection?.fireAlarm || ''}
            onChange={(e) => updateProtection('fireAlarm', e.target.value)}
            options={alarmOptions}
            placeholder="Select alarm type"
          />
        </div>

        {/* Row 2: Fire Protection */}
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <RadioGroup
            label="Fire Protection"
            name="fireProtection"
            value={commlData.building?.protection?.fireProtection || ''}
            onChange={(e) => updateProtection('fireProtection', e.target.value)}
            options={fireProtectionOptions}
            inline={true}
          />
        </div>

        {/* Row 3: Fully Sprinklered */}
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <RadioGroup
            label="Fully Sprinklered"
            name="sprinklered"
            value={commlData.building?.protection?.sprinklered?.toString() || ''}
            onChange={(e) => updateProtection('sprinklered', e.target.value)}
            options={sprinkleredOptions}
            inline={true}
          />
        </div>
      </div>

      {/* Building Improvements Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Building Improvements" />

        {/* Row 1: Heating, Plumbing, Electrical, Roof */}
        <div style={{ ...styles.rowContainer, ...styles.fourColumnRow }}>
          <TextInput
            label="Heating"
            name="heating"
            type="text"
            value={commlData.building?.improvements?.heating || ''}
            onChange={(e) => updateImprovements('heating', e.target.value)}
            placeholder="YYYY"
          />
          <TextInput
            label="Plumbing"
            name="plumbing"
            type="text"
            value={commlData.building?.improvements?.plumbing || ''}
            onChange={(e) => updateImprovements('plumbing', e.target.value)}
            placeholder="YYYY"
          />
          <TextInput
            label="Electrical"
            name="electrical"
            type="text"
            value={commlData.building?.improvements?.electrical || ''}
            onChange={(e) => updateImprovements('electrical', e.target.value)}
            placeholder="YYYY"
          />
          <TextInput
            label="Roof"
            name="roof"
            type="text"
            value={commlData.building?.improvements?.roof || ''}
            onChange={(e) => updateImprovements('roof', e.target.value)}
            placeholder="YYYY"
          />
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

export default CommlQuoteFormPage3;
