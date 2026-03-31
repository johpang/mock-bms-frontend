/**
 * QuoteFormPage2 Component
 * Second page of the quote form wizard
 * Collects garaging location, multiple drivers (via accordions), licensing details,
 * insurance cancellation history, and policy start date
 *
 * @component
 * @returns {JSX.Element} The second form page
 */

import React, { useState, useEffect } from 'react';
import {
  TextInput,
  SelectInput,
  DateInput,
  RadioGroup,
  SectionHeader,
} from '../components/FormControls';
import { useAutoQuote } from '../context/AutoContext';

const QuoteFormPage2 = () => {
  const { quoteData, updateQuoteData, nextStep, prevStep } = useAutoQuote();
  const [errors, setErrors] = useState({});
  const [hoveredButton, setHoveredButton] = useState(null);
  const [expandedDriverIndex, setExpandedDriverIndex] = useState(0);

  // Initialize drivers array on mount if needed
  useEffect(() => {
    if (!quoteData.drivers || quoteData.drivers.length === 0) {
      updateQuoteData('drivers', [{ firstName: '', lastName: '', relationship: '', gender: '', maritalStatus: '' }]);
    }
  }, []);

  // Handlers for garaging location
  const handleGaragingChange = (field) => (e) => {
    updateQuoteData('garagingLocation', { [field]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[`garagingLocation.${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`garagingLocation.${field}`];
      setErrors(newErrors);
    }
  };

  // Handlers for driver information
  const handleDriverChange = (driverIndex, field) => (e) => {
    const updatedDrivers = [...quoteData.drivers];
    updatedDrivers[driverIndex] = {
      ...updatedDrivers[driverIndex],
      [field]: e.target.value,
    };
    updateQuoteData('drivers', updatedDrivers);
    // Clear error for this field when user starts typing
    if (errors[`drivers.${driverIndex}.${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`drivers.${driverIndex}.${field}`];
      setErrors(newErrors);
    }
  };

  // Add a new driver
  const handleAddDriver = () => {
    const newDriver = { firstName: '', lastName: '', relationship: '', gender: '', maritalStatus: '' };
    const updatedDrivers = [...quoteData.drivers, newDriver];
    updateQuoteData('drivers', updatedDrivers);
    // Expand the newly added driver
    setExpandedDriverIndex(updatedDrivers.length - 1);
  };

  // Remove a driver
  const handleRemoveDriver = (driverIndex) => {
    if (quoteData.drivers.length > 1) {
      const updatedDrivers = quoteData.drivers.filter((_, idx) => idx !== driverIndex);
      updateQuoteData('drivers', updatedDrivers);
      // Adjust expanded index if needed
      if (expandedDriverIndex >= updatedDrivers.length) {
        setExpandedDriverIndex(updatedDrivers.length - 1);
      }
    }
  };

  // Handlers for licensing information
  const handleLicensingChange = (field) => (e) => {
    updateQuoteData('licensing', { [field]: e.target.value });
    if (errors[`licensing.${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`licensing.${field}`];
      setErrors(newErrors);
    }
  };

  // Handlers for cancellations
  const handleCancellationsChange = (field) => (e) => {
    updateQuoteData('cancellations', { [field]: e.target.value });
    if (errors[`cancellations.${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`cancellations.${field}`];
      setErrors(newErrors);
    }
  };

  // Handler for policy start date
  const handlePolicyStartDate = (e) => {
    updateQuoteData('policyStartDate', e.target.value);
    if (errors['policyStartDate']) {
      const newErrors = { ...errors };
      delete newErrors['policyStartDate'];
      setErrors(newErrors);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Garaging location validation
    if (!quoteData.garagingLocation?.postalCode?.trim()) {
      newErrors['garagingLocation.postalCode'] = 'Postal Code is required';
    }
    if (!quoteData.garagingLocation?.city?.trim()) {
      newErrors['garagingLocation.city'] = 'City is required';
    }

    // Driver information validation - validate all drivers
    if (quoteData.drivers && quoteData.drivers.length > 0) {
      quoteData.drivers.forEach((driver, index) => {
        if (!driver.firstName?.trim()) {
          newErrors[`drivers.${index}.firstName`] = `Driver ${index + 1}: First Name is required`;
        }
        if (!driver.lastName?.trim()) {
          newErrors[`drivers.${index}.lastName`] = `Driver ${index + 1}: Last Name is required`;
        }
        if (!driver.relationship) {
          newErrors[`drivers.${index}.relationship`] = `Driver ${index + 1}: Relationship is required`;
        }
        if (!driver.gender) {
          newErrors[`drivers.${index}.gender`] = `Driver ${index + 1}: Gender is required`;
        }
        if (!driver.maritalStatus) {
          newErrors[`drivers.${index}.maritalStatus`] = `Driver ${index + 1}: Marital Status is required`;
        }
      });
    }

    // Licensing validation
    if (!quoteData.licensing?.type) {
      newErrors['licensing.type'] = 'License Type is required';
    }
    if (!quoteData.licensing?.g2Date) {
      newErrors['licensing.g2Date'] = 'G2 Licence Date is required';
    }
    if (!quoteData.licensing?.gDate) {
      newErrors['licensing.gDate'] = 'G Licence Date is required';
    }
    if (!quoteData.licensing?.province) {
      newErrors['licensing.province'] = 'Province is required';
    }

    // Cancellations validation
    if (!quoteData.cancellations?.cancelled) {
      newErrors['cancellations.cancelled'] = 'This field is required';
    }
    if (!quoteData.cancellations?.withoutCoverage) {
      newErrors['cancellations.withoutCoverage'] = 'This field is required';
    }
    if (!quoteData.cancellations?.suspended) {
      newErrors['cancellations.suspended'] = 'This field is required';
    }
    if (!quoteData.cancellations?.accidents) {
      newErrors['cancellations.accidents'] = 'This field is required';
    }
    if (!quoteData.cancellations?.tickets) {
      newErrors['cancellations.tickets'] = 'This field is required';
    }

    // Policy start date validation
    if (!quoteData.policyStartDate) {
      newErrors['policyStartDate'] = 'Policy Start Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const styles = {
    pageContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
    },
    errorBox: {
      backgroundColor: '#fee',
      border: '2px solid #cc0000',
      color: '#cc0000',
      padding: '1rem',
      borderRadius: '6px',
      marginBottom: '2rem',
      fontSize: '0.95rem',
      fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    },
    errorList: {
      margin: '0',
      paddingLeft: '1.5rem',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '2rem',
    },
    formGridThreeCol: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '2rem',
      marginBottom: '2rem',
    },
    fullWidth: {
      gridColumn: '1 / -1',
    },
    driverAccordionHeader: {
      backgroundColor: '#0a1e3d',
      color: '#ffffff',
      padding: '12px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2px',
      fontWeight: '600',
      fontSize: '1rem',
      fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    },
    driverAccordionBody: {
      border: '1px solid #e0e0e0',
      borderLeft: '1px solid #e0e0e0',
      borderRight: '1px solid #e0e0e0',
      borderBottom: '1px solid #e0e0e0',
      padding: '16px',
      marginBottom: '16px',
    },
    driverAccordionContainer: {
      marginBottom: '2rem',
    },
    addDriverButton: {
      backgroundColor: 'transparent',
      color: '#0a1e3d',
      border: '2px solid #0a1e3d',
      padding: '0.875rem 1.75rem',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
      marginBottom: '2rem',
    },
    removeDriverButton: {
      backgroundColor: 'transparent',
      color: '#cc0000',
      border: '1px solid #cc0000',
      padding: '0.5rem 1rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
      marginTop: '1rem',
      float: 'right',
    },
    removeDriverButtonDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
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
    chevron: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderTop: '2px solid #ffffff',
      borderRight: '2px solid #ffffff',
      transform: 'rotate(45deg)',
      transition: 'transform 0.2s ease',
    },
  };

  const provinceOptions = [
    { value: 'ON', label: 'ON' },
    { value: 'QC', label: 'QC' },
    { value: 'BC', label: 'BC' },
    { value: 'AB', label: 'AB' },
    { value: 'MB', label: 'MB' },
    { value: 'SK', label: 'SK' },
    { value: 'NS', label: 'NS' },
    { value: 'NB', label: 'NB' },
    { value: 'PE', label: 'PE' },
    { value: 'NL', label: 'NL' },
    { value: 'NT', label: 'NT' },
    { value: 'YT', label: 'YT' },
    { value: 'NU', label: 'NU' },
  ];

  const relationshipOptions = [
    { value: 'Insured', label: 'Insured' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Child', label: 'Child' },
    { value: 'Other', label: 'Other' },
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married/Common Law', label: 'Married/Common Law' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
  ];

  const licenseTypeOptions = [
    { value: 'G', label: 'G' },
    { value: 'G2', label: 'G2' },
    { value: 'G1', label: 'G1' },
    { value: 'Other', label: 'Other' },
  ];

  const yesNoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

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

  const getChevronStyle = (isExpanded) => {
    return {
      ...styles.chevron,
      transform: isExpanded ? 'rotate(135deg)' : 'rotate(45deg)',
    };
  };

  const getDriverDisplayName = (driver, index) => {
    const firstName = driver.firstName?.trim() || '';
    const lastName = driver.lastName?.trim() || '';
    if (firstName || lastName) {
      return `Driver ${index + 1}: ${firstName} ${lastName}`.trim();
    }
    return `Driver ${index + 1}: New Driver`;
  };

  return (
    <div style={styles.pageContainer}>
      {/* Error Display */}
      {Object.keys(errors).length > 0 && (
        <div style={styles.errorBox}>
          <strong>Please fix the following errors:</strong>
          <ul style={styles.errorList}>
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Garaging Location Section */}
      <SectionHeader title="Garaging Location" />
      <div style={styles.formGrid}>
        <TextInput
          label="Postal Code"
          name="garagingPostalCode"
          value={quoteData.garagingLocation?.postalCode || ''}
          onChange={handleGaragingChange('postalCode')}
          placeholder="e.g. M5V 3A8"
          error={errors['garagingLocation.postalCode']}
        />
        <TextInput
          label="City"
          name="garagingCity"
          value={quoteData.garagingLocation?.city || ''}
          onChange={handleGaragingChange('city')}
          placeholder="City"
          error={errors['garagingLocation.city']}
        />
      </div>

      {/* Driver Information Section with Accordions */}
      <SectionHeader title="Driver Information" />
      <div style={styles.driverAccordionContainer}>
        {quoteData.drivers && quoteData.drivers.map((driver, index) => (
          <div key={index}>
            {/* Accordion Header */}
            <div
              style={styles.driverAccordionHeader}
              onClick={() => setExpandedDriverIndex(expandedDriverIndex === index ? -1 : index)}
            >
              <span>{getDriverDisplayName(driver, index)}</span>
              <span style={getChevronStyle(expandedDriverIndex === index)}></span>
            </div>

            {/* Accordion Body */}
            {expandedDriverIndex === index && (
              <div style={styles.driverAccordionBody}>
                <div style={styles.formGrid}>
                  <TextInput
                    label="First Name"
                    name={`driverFirstName${index}`}
                    value={driver.firstName || ''}
                    onChange={handleDriverChange(index, 'firstName')}
                    placeholder="First name"
                    error={errors[`drivers.${index}.firstName`]}
                  />
                  <TextInput
                    label="Last Name"
                    name={`driverLastName${index}`}
                    value={driver.lastName || ''}
                    onChange={handleDriverChange(index, 'lastName')}
                    placeholder="Last name"
                    error={errors[`drivers.${index}.lastName`]}
                  />
                </div>
                <div style={styles.formGridThreeCol}>
                  <SelectInput
                    label="Relationship to Applicant"
                    name={`relationship${index}`}
                    value={driver.relationship || ''}
                    onChange={handleDriverChange(index, 'relationship')}
                    options={relationshipOptions}
                    placeholder="Select relationship"
                    error={errors[`drivers.${index}.relationship`]}
                  />
                  <SelectInput
                    label="Gender"
                    name={`driverGender${index}`}
                    value={driver.gender || ''}
                    onChange={handleDriverChange(index, 'gender')}
                    options={genderOptions}
                    placeholder="Select gender"
                    error={errors[`drivers.${index}.gender`]}
                  />
                  <SelectInput
                    label="Marital Status"
                    name={`maritalStatus${index}`}
                    value={driver.maritalStatus || ''}
                    onChange={handleDriverChange(index, 'maritalStatus')}
                    options={maritalStatusOptions}
                    placeholder="Select marital status"
                    error={errors[`drivers.${index}.maritalStatus`]}
                  />
                </div>

                {/* Remove Driver Button */}
                <button
                  style={{
                    ...styles.removeDriverButton,
                    ...(quoteData.drivers.length === 1 ? styles.removeDriverButtonDisabled : {}),
                  }}
                  onClick={() => handleRemoveDriver(index)}
                  disabled={quoteData.drivers.length === 1}
                >
                  Remove Driver
                </button>
                <div style={{ clear: 'both' }}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Driver Button */}
      <button
        style={styles.addDriverButton}
        onClick={handleAddDriver}
        onMouseEnter={() => setHoveredButton('addDriver')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        + Add Driver
      </button>

      {/* Licensing Section */}
      <SectionHeader title="Licensing" />
      <div style={styles.formGrid}>
        <div style={styles.fullWidth}>
          <SelectInput
            label="What type of licence do you currently hold?"
            name="licenseType"
            value={quoteData.licensing?.type || ''}
            onChange={handleLicensingChange('type')}
            options={licenseTypeOptions}
            placeholder="Select licence type"
            error={errors['licensing.type']}
          />
        </div>
      </div>
      <div style={styles.formGrid}>
        <DateInput
          label="G2 Licence Date"
          name="g2Date"
          value={quoteData.licensing?.g2Date || ''}
          onChange={handleLicensingChange('g2Date')}
          error={errors['licensing.g2Date']}
        />
        <DateInput
          label="G Licence Date"
          name="gDate"
          value={quoteData.licensing?.gDate || ''}
          onChange={handleLicensingChange('gDate')}
          error={errors['licensing.gDate']}
        />
      </div>
      <div style={styles.formGrid}>
        <SelectInput
          label="Province"
          name="province"
          value={quoteData.licensing?.province || ''}
          onChange={handleLicensingChange('province')}
          options={provinceOptions}
          placeholder="Select province"
          error={errors['licensing.province']}
        />
      </div>

      {/* Insurance Cancellations Section */}
      <SectionHeader title="Insurance Cancellations" />
      <div style={{ marginBottom: '2rem' }}>
        <p
          style={{
            fontSize: '0.95rem',
            color: '#555555',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
          }}
        >
          In the past 3 years have you ever had:
        </p>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="An insurance company cancel your policy?"
            name="cancelled"
            value={quoteData.cancellations?.cancelled || ''}
            onChange={handleCancellationsChange('cancelled')}
            options={yesNoOptions}
            inline={true}
            error={errors['cancellations.cancelled']}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="Any time without insurance coverage?"
            name="withoutCoverage"
            value={quoteData.cancellations?.withoutCoverage || ''}
            onChange={handleCancellationsChange('withoutCoverage')}
            options={yesNoOptions}
            inline={true}
            error={errors['cancellations.withoutCoverage']}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="Have you had any licence suspension in the past 6 years?"
            name="suspended"
            value={quoteData.cancellations?.suspended || ''}
            onChange={handleCancellationsChange('suspended')}
            options={yesNoOptions}
            inline={true}
            error={errors['cancellations.suspended']}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="Have you had any at-fault accidents in the last 5 years?"
            name="accidents"
            value={quoteData.cancellations?.accidents || ''}
            onChange={handleCancellationsChange('accidents')}
            options={yesNoOptions}
            inline={true}
            error={errors['cancellations.accidents']}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="Have you had any traffic tickets in the last 3 years?"
            name="tickets"
            value={quoteData.cancellations?.tickets || ''}
            onChange={handleCancellationsChange('tickets')}
            options={yesNoOptions}
            inline={true}
            error={errors['cancellations.tickets']}
          />
        </div>
      </div>

      {/* Policy Start Date Section */}
      <SectionHeader title="Policy Start Date" />
      <div style={styles.formGrid}>
        <DateInput
          label="Please tell us when you would like your policy to start?"
          name="policyStartDate"
          value={quoteData.policyStartDate || ''}
          onChange={handlePolicyStartDate}
          error={errors['policyStartDate']}
        />
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

export default QuoteFormPage2;
