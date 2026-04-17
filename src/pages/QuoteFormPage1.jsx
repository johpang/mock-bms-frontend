/**
 * QuoteFormPage1 Component
 * First page of the quote form wizard
 * Collects quote information, customer details, address, and policy effective date
 * Vehicle details are handled on a separate page
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
} from '../components/FormControls';
import { useAutoQuote } from '../context/AutoContext';

const QuoteFormPage1 = () => {
  const { quoteData, updateQuoteData, nextStep, prevStep } = useAutoQuote();
  const [errors, setErrors] = React.useState([]);
  const [hoveredButton, setHoveredButton] = React.useState(null);

  // Field options
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

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
    if (!quoteData.producerCode?.trim()) missingFields.push('Producer Code');
    if (!quoteData.bmsQuoteNumber?.trim()) missingFields.push('BMS Quote Number');
    // Customer Details fields
    if (!quoteData.customer?.firstName?.trim()) missingFields.push('First Name');
    if (!quoteData.customer?.lastName?.trim()) missingFields.push('Last Name');
    if (!quoteData.customer?.dob?.trim()) missingFields.push('Date of Birth');
    if (!quoteData.customer?.gender?.trim()) missingFields.push('Gender');

    // Address fields
    if (!quoteData.customer?.address?.trim()) missingFields.push('Address');
    if (!quoteData.customer?.postalCode?.trim()) missingFields.push('Postal Code');
    if (!quoteData.customer?.city?.trim()) missingFields.push('City');
    if (!quoteData.customer?.province?.trim()) missingFields.push('Province');
    if (!quoteData.customer?.phone?.trim()) missingFields.push('Phone Number');

    // Policy Effective Date field
    if (!quoteData.policyEffectiveDate?.trim()) {
      missingFields.push('Policy Effective Date');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const effectiveDate = new Date(quoteData.policyEffectiveDate + 'T00:00:00');
      if (effectiveDate < today) {
        missingFields.push('Policy Effective Date cannot be backdated');
      }
    }

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
            value={quoteData.producerCode || ''}
            onChange={(e) => updateQuoteData(null, { producerCode: e.target.value })}
            placeholder=""
            required
          />
          <TextInput
            label="BMS Quote Number"
            name="bmsQuoteNumber"
            value={quoteData.bmsQuoteNumber || ''}
            onChange={(e) => updateQuoteData(null, { bmsQuoteNumber: e.target.value })}
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
            value={quoteData.customer?.firstName || ''}
            onChange={(e) => updateQuoteData('customer', { firstName: e.target.value })}
            placeholder="First name"
            required
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={quoteData.customer?.lastName || ''}
            onChange={(e) => updateQuoteData('customer', { lastName: e.target.value })}
            placeholder="Last name"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <DateInput
            label="Date of Birth"
            name="dob"
            value={quoteData.customer?.dob || ''}
            onChange={(e) => updateQuoteData('customer', { dob: e.target.value })}
            required
          />
          <SelectInput
            label="Gender"
            name="gender"
            value={quoteData.customer?.gender || ''}
            onChange={(e) => updateQuoteData('customer', { gender: e.target.value })}
            options={genderOptions}
            placeholder="Select gender"
            required
          />
        </div>
      </div>

      {/* Address Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Address" />
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <TextInput
            label="Address"
            name="address"
            value={quoteData.customer?.address || ''}
            onChange={(e) => updateQuoteData('customer', { address: e.target.value })}
            placeholder="Street address"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.fourColumnRow }}>
          <TextInput
            label="Postal Code"
            name="postalCode"
            value={quoteData.customer?.postalCode || ''}
            onChange={(e) => updateQuoteData('customer', { postalCode: e.target.value })}
            placeholder="e.g. M5V 3A8"
            required
          />
          <TextInput
            label="City"
            name="city"
            value={quoteData.customer?.city || ''}
            onChange={(e) => updateQuoteData('customer', { city: e.target.value })}
            placeholder="City"
            required
          />
          <SelectInput
            label="Province"
            name="province"
            value={quoteData.customer?.province || ''}
            onChange={(e) => updateQuoteData('customer', { province: e.target.value })}
            options={provinceOptions}
            placeholder="Select province"
            required
          />
          <TextInput
            label="Phone Number"
            name="phone"
            value={quoteData.customer?.phone || ''}
            onChange={(e) => updateQuoteData('customer', { phone: e.target.value })}
            placeholder="(123) 456-7890"
            type="tel"
            required
          />
        </div>
      </div>

      {/* Policy Effective Date Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Policy Effective Date" />
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <DateInput
            label="Policy Effective Date"
            name="policyEffectiveDate"
            value={quoteData.policyEffectiveDate || ''}
            onChange={(e) => updateQuoteData(null, { policyEffectiveDate: e.target.value })}
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

export default QuoteFormPage1;
