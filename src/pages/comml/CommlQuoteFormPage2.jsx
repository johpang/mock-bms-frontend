/**
 * CommlQuoteFormPage2 Component
 * Second page of the commercial insurance quote form wizard
 * Collects additional questions and location details
 *
 * @component
 * @returns {JSX.Element} The second form page
 */

import React from 'react';
import {
  TextInput,
  SelectInput,
  SectionHeader,
  RadioGroup,
} from '../../components/FormControls';
import { useComml } from '../../context/CommlContext';

const CommlQuoteFormPage2 = () => {
  const { commlData, updateCommlData, nextStep, prevStep } = useComml();
  const [errors, setErrors] = React.useState([]);
  const [hoveredButton, setHoveredButton] = React.useState(null);

  // Field options
  const yesNoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const buildingTypeOptions = [
    { value: 'Frame', label: 'Frame' },
    { value: 'JoisedMasonry', label: 'Joisted Masonry' },
    { value: 'NonCombustible', label: 'Non-Combustible' },
    { value: 'MasonryNonCombustible', label: 'Masonry Non-Combustible' },
    { value: 'FireResistive', label: 'Fire Resistive' },
  ];

  const foundationTypeOptions = [
    { value: 'FullBasement', label: 'Full Basement' },
    { value: 'CrawlSpace', label: 'Crawl Space' },
    { value: 'Slab', label: 'Slab' },
    { value: 'Concrete', label: 'Concrete' },
  ];

  // Styles
  const styles = {
    pageContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
    },
    pageTitle: {
      fontSize: '1.75rem',
      fontWeight: '600',
      marginBottom: '2rem',
      color: '#0a1e3d',
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
    fiveColumnRow: {
      gridTemplateColumns: 'repeat(5, 1fr)',
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

  // Validation function
  const validateForm = () => {
    const missingFields = [];
    // Page 2 is optional, no required fields for now
    return missingFields;
  };

  // Handle Next button with validation
  const handleNextClick = () => {
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      setErrors(missingFields);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors([]);
      nextStep();
    }
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
      <h1 style={styles.pageTitle}>Commercial Lines — Questions & Location</h1>

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

      {/* Additional Questions Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Additional Questions" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <RadioGroup
            label="Any underground work?"
            name="undergroundWork"
            value={commlData.questions?.undergroundWork || ''}
            onChange={(e) => updateCommlData('questions', { undergroundWork: e.target.value })}
            options={yesNoOptions}
          />
          <TextInput
            label="Square footage occupied by the Insured?"
            name="sqftOccupied"
            value={commlData.questions?.sqftOccupied || ''}
            onChange={(e) => updateCommlData('questions', { sqftOccupied: e.target.value })}
            placeholder="e.g. 5000"
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <RadioGroup
            label="Has risk's insurance been cancelled or non-renewed in the last 5 years?"
            name="insuranceCancelled"
            value={commlData.questions?.insuranceCancelled || ''}
            onChange={(e) => updateCommlData('questions', { insuranceCancelled: e.target.value })}
            options={yesNoOptions}
          />
          <RadioGroup
            label="Claims in the last 5 years?"
            name="claimsLast5Years"
            value={commlData.questions?.claimsLast5Years || ''}
            onChange={(e) => updateCommlData('questions', { claimsLast5Years: e.target.value })}
            options={yesNoOptions}
          />
        </div>
      </div>

      {/* Location Details Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Location Details" />
        <div style={{ ...styles.rowContainer, ...styles.fiveColumnRow }}>
          <TextInput
            label="Year Built"
            name="yearBuilt"
            value={commlData.location?.yearBuilt || ''}
            onChange={(e) => updateCommlData('location', { yearBuilt: e.target.value })}
            placeholder="e.g. 2010"
          />
          <SelectInput
            label="Building Type"
            name="buildingType"
            value={commlData.location?.buildingType || ''}
            onChange={(e) => updateCommlData('location', { buildingType: e.target.value })}
            options={buildingTypeOptions}
            placeholder="Select type"
          />
          <SelectInput
            label="Foundation Type"
            name="foundationType"
            value={commlData.location?.foundationType || ''}
            onChange={(e) => updateCommlData('location', { foundationType: e.target.value })}
            options={foundationTypeOptions}
            placeholder="Select type"
          />
          <TextInput
            label="# of Stories"
            name="numStories"
            value={commlData.location?.numStories || ''}
            onChange={(e) => updateCommlData('location', { numStories: e.target.value })}
            placeholder="e.g. 2"
          />
          <TextInput
            label="# of Units"
            name="numUnits"
            value={commlData.location?.numUnits || ''}
            onChange={(e) => updateCommlData('location', { numUnits: e.target.value })}
            placeholder="e.g. 1"
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.threeColumnRow }}>
          <TextInput
            label="Area occupied by Insured (sqft)"
            name="areaOccupied"
            value={commlData.location?.areaOccupied || ''}
            onChange={(e) => updateCommlData('location', { areaOccupied: e.target.value })}
            placeholder="e.g. 5000"
          />
          <TextInput
            label="% Vacant"
            name="pctVacant"
            value={commlData.location?.pctVacant || ''}
            onChange={(e) => updateCommlData('location', { pctVacant: e.target.value })}
            placeholder="e.g. 10"
          />
          <TextInput
            label="# of Employees"
            name="numEmployees"
            value={commlData.location?.numEmployees || ''}
            onChange={(e) => updateCommlData('location', { numEmployees: e.target.value })}
            placeholder="e.g. 5"
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
          onClick={handleNextClick}
          onMouseEnter={() => setHoveredButton('next')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommlQuoteFormPage2;
