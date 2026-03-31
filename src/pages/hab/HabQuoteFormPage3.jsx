/**
 * HabQuoteFormPage3 Component
 * Third page of the habitational insurance quote form wizard
 * Collects swimming pool and liability exposure details
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
import { useHab } from '../../context/HabContext';

const HabQuoteFormPage3 = () => {
  const { habData, updateHabData, nextStep, prevStep } = useHab();
  const [errors, setErrors] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);

  const poolTypeOptions = [
    { value: 'In-Ground Indoor', label: 'In-Ground Indoor' },
    { value: 'In-Ground Outdoor', label: 'In-Ground Outdoor' },
    { value: 'Above-Ground Indoor', label: 'Above-Ground Indoor' },
    { value: 'Above-Ground Outdoor', label: 'Above-Ground Outdoor' },
  ];

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
    threeColumnRow: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    twoColumnRow: {
      gridTemplateColumns: 'repeat(2, 1fr)',
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

    // Swimming Pool (conditional)
    if (habData.swimmingPool?.hasPool === 'Yes') {
      if (!habData.swimmingPool?.year?.trim()) missingFields.push('Swimming Pool Year');
      if (!habData.swimmingPool?.poolType) missingFields.push('Pool Type');
      if (!habData.swimmingPool?.poolFenced) missingFields.push('Pool Fenced');
    }

    // Liability Exposures
    if (!habData.liabilityExposures?.multipleLocations) missingFields.push('Multiple Locations Question');
    if (!habData.liabilityExposures?.weeksRented?.trim()) missingFields.push('Weeks Rented');
    if (!habData.liabilityExposures?.roomsRented?.trim()) missingFields.push('Rooms Rented');
    if (!habData.liabilityExposures?.daycareChildren?.trim()) missingFields.push('Daycare Children');
    if (!habData.liabilityExposures?.ownsTrampoline) missingFields.push('Trampoline Question');
    if (!habData.liabilityExposures?.ownsGardenTractor) missingFields.push('Garden Tractor Question');
    if (!habData.liabilityExposures?.ownsGolfCart) missingFields.push('Golf Cart Question');
    if (!habData.liabilityExposures?.saddleDraftAnimals?.trim()) missingFields.push('Saddle/Draft Animals');
    if (!habData.liabilityExposures?.ownsUnlicensedRVs) missingFields.push('Unlicensed RVs Question');
    if (!habData.liabilityExposures?.renewableEnergy) missingFields.push('Renewable Energy Question');
    if (!habData.liabilityExposures?.ownsWatercraft) missingFields.push('Watercraft Question');

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

      {/* Swimming Pool Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Swimming Pool" />
        <div style={{ marginBottom: '1rem' }}>
          <RadioGroup
            label="Do you have a swimming pool?"
            name="hasPool"
            value={habData.swimmingPool?.hasPool || ''}
            onChange={(e) => updateHabData('swimmingPool', { hasPool: e.target.value })}
            options={yesNoOptions}
            inline={true}
          />
        </div>
        {habData.swimmingPool?.hasPool === 'Yes' && (
          <div style={{ ...styles.rowContainer, ...styles.threeColumnRow }}>
            <TextInput
              label="Year"
              name="poolYear"
              value={habData.swimmingPool?.year || ''}
              onChange={(e) => updateHabData('swimmingPool', { year: e.target.value })}
              placeholder="e.g. 2015"
            />
            <SelectInput
              label="Pool Type"
              name="poolType"
              value={habData.swimmingPool?.poolType || ''}
              onChange={(e) => updateHabData('swimmingPool', { poolType: e.target.value })}
              options={poolTypeOptions}
              placeholder="Select pool type"
            />
            <div style={{ marginBottom: '1rem' }}>
              <RadioGroup
                label="Pool Fenced"
                name="poolFenced"
                value={habData.swimmingPool?.poolFenced || ''}
                onChange={(e) => updateHabData('swimmingPool', { poolFenced: e.target.value })}
                options={yesNoOptions}
                inline={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Liability Exposures Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Liability Exposures" />
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="1. Do you own or rent more than one location?"
            name="multipleLocations"
            value={habData.liabilityExposures?.multipleLocations || ''}
            onChange={(e) => updateHabData('liabilityExposures', { multipleLocations: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <TextInput
            label="2. Number of weeks location rented to others"
            name="weeksRented"
            value={habData.liabilityExposures?.weeksRented || ''}
            onChange={(e) => updateHabData('liabilityExposures', { weeksRented: e.target.value })}
            placeholder="e.g. 0"
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <TextInput
            label="3. Number of rooms rented to others"
            name="roomsRented"
            value={habData.liabilityExposures?.roomsRented || ''}
            onChange={(e) => updateHabData('liabilityExposures', { roomsRented: e.target.value })}
            placeholder="e.g. 0"
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <TextInput
            label="4. Daycare operation – Number of children"
            name="daycareChildren"
            value={habData.liabilityExposures?.daycareChildren || ''}
            onChange={(e) => updateHabData('liabilityExposures', { daycareChildren: e.target.value })}
            placeholder="e.g. 0"
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="5. Do you own a trampoline?"
            name="ownsTrampoline"
            value={habData.liabilityExposures?.ownsTrampoline || ''}
            onChange={(e) => updateHabData('liabilityExposures', { ownsTrampoline: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="6. Do you have a garden tractor?"
            name="ownsGardenTractor"
            value={habData.liabilityExposures?.ownsGardenTractor || ''}
            onChange={(e) => updateHabData('liabilityExposures', { ownsGardenTractor: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="7. Do you have a golf cart?"
            name="ownsGolfCart"
            value={habData.liabilityExposures?.ownsGolfCart || ''}
            onChange={(e) => updateHabData('liabilityExposures', { ownsGolfCart: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <TextInput
            label="8. Number of Saddle/Draft Animals"
            name="saddleDraftAnimals"
            value={habData.liabilityExposures?.saddleDraftAnimals || ''}
            onChange={(e) => updateHabData('liabilityExposures', { saddleDraftAnimals: e.target.value })}
            placeholder="e.g. 0"
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="9. Do you own any unlicensed recreational vehicles?"
            name="ownsUnlicensedRVs"
            value={habData.liabilityExposures?.ownsUnlicensedRVs || ''}
            onChange={(e) => updateHabData('liabilityExposures', { ownsUnlicensedRVs: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="10. Renewable energy installation on premises?"
            name="renewableEnergy"
            value={habData.liabilityExposures?.renewableEnergy || ''}
            onChange={(e) => updateHabData('liabilityExposures', { renewableEnergy: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="11. Do you own a watercraft?"
            name="ownsWatercraft"
            value={habData.liabilityExposures?.ownsWatercraft || ''}
            onChange={(e) => updateHabData('liabilityExposures', { ownsWatercraft: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
        </div>
      </div>

      {/* Navigation Buttons */}
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

export default HabQuoteFormPage3;
