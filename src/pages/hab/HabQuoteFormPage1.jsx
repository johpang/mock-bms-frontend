/**
 * HabQuoteFormPage1 Component
 * First page of the habitational insurance quote form wizard
 * Collects quote information, customer details, policy period, applicant info, and loss history
 *
 * @component
 * @returns {JSX.Element} The first form page
 */

import React from 'react';
import {
  TextInput,
  SelectInput,
  DateInput,
  SectionHeader,
  RadioGroup,
} from '../../components/FormControls';
import { useHab } from '../../context/HabContext';

const HabQuoteFormPage1 = () => {
  const { habData, updateHabData, nextStep, prevStep } = useHab();
  const [errors, setErrors] = React.useState([]);
  const [hoveredButton, setHoveredButton] = React.useState(null);

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

  const yesNoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const amPmOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
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

  // Validation function
  const validateForm = () => {
    const missingFields = [];

    // Quote Information fields
    if (!habData.producerCode?.trim()) missingFields.push('Producer Code');
    if (!habData.bmsQuoteNumber?.trim()) missingFields.push('BMS Quote Number');

    // Customer Details fields
    if (!habData.customer?.firstName?.trim()) missingFields.push('Customer First Name');
    if (!habData.customer?.lastName?.trim()) missingFields.push('Customer Last Name');
    if (!habData.customer?.address?.trim()) missingFields.push('Address');
    if (!habData.customer?.postalCode?.trim()) missingFields.push('Postal Code');
    if (!habData.customer?.city?.trim()) missingFields.push('City');
    if (!habData.customer?.province?.trim()) missingFields.push('Province');
    if (!habData.customer?.phone?.trim()) missingFields.push('Phone Number');

    // Policy Period fields
    if (!habData.effectiveDate?.trim()) {
      missingFields.push('Effective Date');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const effectiveDate = new Date(habData.effectiveDate + 'T00:00:00');
      if (effectiveDate < today) {
        missingFields.push('Effective Date cannot be backdated');
      }
    }
    if (!habData.expiryDate?.trim()) missingFields.push('Expiry Date');

    // Applicant fields
    if (!habData.applicant?.name?.trim()) missingFields.push('Applicant Name');
    if (!habData.applicant?.dateOfBirth?.trim()) missingFields.push('Applicant Date of Birth');

    // Loss History fields
    if (!habData.lossHistory?.hasLossesOrClaims) missingFields.push('Losses or Claims History');
    if (habData.lossHistory?.hasLossesOrClaims === 'Yes' && !habData.lossHistory?.claimDate) missingFields.push('Date of Claim');
    if (!habData.lossHistory?.insuranceCancellationHistory) missingFields.push('Insurance Cancellation History');

    return missingFields;
  };

  // Handle Next button with validation
  const handleNextClick = () => {
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      setErrors(missingFields);
      // Scroll to top to show errors
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

      {/* Quote Information Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Quote Information" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="Producer Code"
            name="producerCode"
            value={habData.producerCode || ''}
            onChange={(e) => updateHabData(null, { producerCode: e.target.value })}
            placeholder=""
            required
          />
          <TextInput
            label="BMS Quote Number"
            name="bmsQuoteNumber"
            value={habData.bmsQuoteNumber || ''}
            onChange={(e) => updateHabData(null, { bmsQuoteNumber: e.target.value })}
            placeholder="e.g. SMT0B4176"
            required
          />
        </div>
      </div>

      {/* Customer Details Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Customer Details" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="First Name"
            name="firstName"
            value={habData.customer?.firstName || ''}
            onChange={(e) => updateHabData('customer', { firstName: e.target.value })}
            placeholder="First name"
            required
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={habData.customer?.lastName || ''}
            onChange={(e) => updateHabData('customer', { lastName: e.target.value })}
            placeholder="Last name"
            required
          />
        </div>
      </div>

      {/* Address Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Risk 1" />
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <TextInput
            label="Address"
            name="address"
            value={habData.customer?.address || ''}
            onChange={(e) => updateHabData('customer', { address: e.target.value })}
            placeholder="Street address"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.fourColumnRow }}>
          <TextInput
            label="Postal Code"
            name="postalCode"
            value={habData.customer?.postalCode || ''}
            onChange={(e) => updateHabData('customer', { postalCode: e.target.value })}
            placeholder="e.g. M5V 3A8"
            required
          />
          <TextInput
            label="City"
            name="city"
            value={habData.customer?.city || ''}
            onChange={(e) => updateHabData('customer', { city: e.target.value })}
            placeholder="City"
            required
          />
          <SelectInput
            label="Province"
            name="province"
            value={habData.customer?.province || ''}
            onChange={(e) => updateHabData('customer', { province: e.target.value })}
            options={provinceOptions}
            placeholder="Select province"
            required
          />
          <TextInput
            label="Phone Number"
            name="phone"
            value={habData.customer?.phone || ''}
            onChange={(e) => updateHabData('customer', { phone: e.target.value })}
            placeholder="(123) 456-7890"
            type="tel"
            required
          />
        </div>
      </div>

      {/* Policy Period Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Policy Period" />
        <div style={{ ...styles.rowContainer, ...styles.fourColumnRow }}>
          <DateInput
            label="Effective Date"
            name="effectiveDate"
            value={habData.effectiveDate || ''}
            onChange={(e) => updateHabData(null, { effectiveDate: e.target.value })}
            required
          />
          <DateInput
            label="Expiry Date"
            name="expiryDate"
            value={habData.expiryDate || ''}
            onChange={(e) => updateHabData(null, { expiryDate: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Applicant Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Applicant Data" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="Name"
            name="applicantName"
            value={habData.applicant?.name || ''}
            onChange={(e) => updateHabData('applicant', { name: e.target.value })}
            placeholder="Applicant name"
            required
          />
          <DateInput
            label="Date of Birth"
            name="applicantDOB"
            value={habData.applicant?.dateOfBirth || ''}
            onChange={(e) => updateHabData('applicant', { dateOfBirth: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Loss History Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Loss History" />
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="Have there been any losses or claims by the applicant in the past 5 years?"
            name="hasLossesOrClaims"
            value={habData.lossHistory?.hasLossesOrClaims || ''}
            onChange={(e) => updateHabData('lossHistory', { hasLossesOrClaims: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
          {habData.lossHistory?.hasLossesOrClaims === 'Yes' && (
            <div style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
              <DateInput
                label="Date of Claim"
                name="claimDate"
                value={habData.lossHistory?.claimDate || ''}
                onChange={(e) => updateHabData('lossHistory', { claimDate: e.target.value })}
              />
            </div>
          )}
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="In the past 5 years, has any insurance company declined, refused, or indicated intent not to renew any habitational insurance policy?"
            name="insuranceCancellationHistory"
            value={habData.lossHistory?.insuranceCancellationHistory || ''}
            onChange={(e) => updateHabData('lossHistory', { insuranceCancellationHistory: e.target.value })}
            options={yesNoOptions}
            inline={true}
            required
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={styles.buttonGroup}>
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

export default HabQuoteFormPage1;
