/**
 * CommlQuoteFormPage1 Component
 * First page of the commercial insurance quote form wizard
 * Collects quote details, account information, policy information, business information, and business operations
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
import { useComml } from '../../context/CommlContext';

const CommlQuoteFormPage1 = () => {
  const { commlData, updateCommlData, nextStep, prevStep } = useComml();
  const [errors, setErrors] = React.useState([]);
  const [hoveredButton, setHoveredButton] = React.useState(null);

  // Field options
  const billingOptions = [
    {
      value: 'directBilling',
      label: 'Direct Billing Account',
    },
    { value: 'brokerBilled', label: 'Broker Billed' },
    { value: 'insuredBilled', label: 'Insured Billed' },
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

  const ibcOptions = [
    /* Demo sample — not a complete IBC code list */
    { value: '1521', label: '1521 – Landscaping Services' },
    { value: '1522', label: '1522 – Fences – Construction of' },
    { value: '1541', label: '1541 – General Contractors – Industrial Buildings' },
    { value: '1731', label: '1731 – Electrical Work' },
    { value: '1751', label: '1751 – Carpentry Work' },
    { value: '1761', label: '1761 – Roofing & Sheet Metal Work' },
    { value: '1771', label: '1771 – Concrete Work' },
    { value: '5812', label: '5812 – Eating Places (Restaurants)' },
    { value: '7215', label: '7215 – Pet Grooming Services' },
    { value: '7349', label: '7349 – Janitorial & Cleaning Services' },
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

  // IBC code handlers
  const handleIbcChange = (e) => {
    const ops = [...(commlData.business?.operations || [{ ibcCode: '', revenuePct: '100' }])];
    ops[0] = { ...ops[0], ibcCode: e.target.value };
    updateCommlData('business', { operations: ops });
  };

  const handleRevenuePctChange = (e) => {
    const ops = [...(commlData.business?.operations || [{ ibcCode: '', revenuePct: '100' }])];
    ops[0] = { ...ops[0], revenuePct: e.target.value };
    updateCommlData('business', { operations: ops });
  };

  // Validation function
  const validateForm = () => {
    const missingFields = [];

    // Quote Information fields
    if (!commlData.producerCode?.trim()) missingFields.push('Producer Code');
    if (!commlData.bmsQuoteNumber?.trim()) missingFields.push('BMS Quote Number');
    if (!commlData.billingMethod?.trim()) missingFields.push('Billing Method');

    // Account Information fields
    if (!commlData.account?.address?.trim()) missingFields.push('Street Address');
    if (!commlData.account?.postalCode?.trim()) missingFields.push('Postal Code');
    if (!commlData.account?.city?.trim()) missingFields.push('City');
    if (!commlData.account?.province?.trim()) missingFields.push('Province');

    // Policy Information fields
    if (!commlData.policyEffectiveDate?.trim()) missingFields.push('Policy Effective Date');
    if (!commlData.policyExpiryDate?.trim()) missingFields.push('Policy Expiry Date');

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
      <h1 style={styles.pageTitle}>Commercial Lines — Quote Details</h1>

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
        <div style={{ ...styles.rowContainer, ...styles.threeColumnRow }}>
          <TextInput
            label="Producer Code"
            name="producerCode"
            value={commlData.producerCode || ''}
            onChange={(e) => updateCommlData(null, { producerCode: e.target.value })}
            placeholder="e.g. CM04"
            required
          />
          <TextInput
            label="BMS Quote Number"
            name="bmsQuoteNumber"
            value={commlData.bmsQuoteNumber || ''}
            onChange={(e) => updateCommlData(null, { bmsQuoteNumber: e.target.value })}
            placeholder="e.g. SMT0B4176"
            required
          />
          <SelectInput
            label="Billing Method"
            name="billingMethod"
            value={commlData.billingMethod || ''}
            onChange={(e) => updateCommlData(null, { billingMethod: e.target.value })}
            options={billingOptions}
            placeholder="Select billing method"
            required
          />
        </div>
      </div>

      {/* Account Information Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Account Information" />
        {/* Commercial name and DBA are used for CSIO XML but are not shown in standard mockup screens. */}
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="Commercial Name"
            name="commercialName"
            value={commlData.account?.commercialName || ''}
            onChange={(e) => updateCommlData('account', { commercialName: e.target.value })}
            placeholder="Commercial name"
          />
          <TextInput
            label="DBA / Operating As"
            name="dbaName"
            value={commlData.account?.dbaName || ''}
            onChange={(e) => updateCommlData('account', { dbaName: e.target.value })}
            placeholder="DBA / Operating As"
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <TextInput
            label="Street Address"
            name="address"
            value={commlData.account?.address || ''}
            onChange={(e) => updateCommlData('account', { address: e.target.value })}
            placeholder="Street address"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.fourColumnRow }}>
          <TextInput
            label="Postal Code"
            name="postalCode"
            value={commlData.account?.postalCode || ''}
            onChange={(e) => updateCommlData('account', { postalCode: e.target.value })}
            placeholder="e.g. M5V 3A8"
            required
          />
          <TextInput
            label="City"
            name="city"
            value={commlData.account?.city || ''}
            onChange={(e) => updateCommlData('account', { city: e.target.value })}
            placeholder="City"
            required
          />
          <SelectInput
            label="Province"
            name="province"
            value={commlData.account?.province || ''}
            onChange={(e) => updateCommlData('account', { province: e.target.value })}
            options={provinceOptions}
            placeholder="Select province"
            required
          />
          <TextInput
            label="Country"
            name="country"
            value={commlData.account?.country || 'CA'}
            disabled
            placeholder="CA"
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="Email Address"
            name="email"
            value={commlData.account?.email || ''}
            onChange={(e) => updateCommlData('account', { email: e.target.value })}
            placeholder="Email address"
          />
          <TextInput
            label="Website"
            name="website"
            value={commlData.account?.website || ''}
            onChange={(e) => updateCommlData('account', { website: e.target.value })}
            placeholder="Website"
          />
        </div>
      </div>

      {/* Policy Information Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Policy Information" />
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <RadioGroup
            label="Language"
            name="language"
            value={commlData.language || ''}
            onChange={(e) => updateCommlData(null, { language: e.target.value })}
            options={[
              { value: 'en', label: 'English' },
              { value: 'fr', label: 'French' },
            ]}
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <DateInput
            label="Policy Effective Date"
            name="policyEffectiveDate"
            value={commlData.policyEffectiveDate || ''}
            onChange={(e) => updateCommlData(null, { policyEffectiveDate: e.target.value })}
            required
          />
          <DateInput
            label="Policy Expiry Date"
            name="policyExpiryDate"
            value={commlData.policyExpiryDate || ''}
            onChange={(e) => updateCommlData(null, { policyExpiryDate: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Business Information Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Business Information" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <DateInput
            label="Business Start Date"
            name="startDate"
            value={commlData.business?.startDate || ''}
            onChange={(e) => updateCommlData('business', { startDate: e.target.value })}
          />
          <TextInput
            label="Related Prior Experience - years"
            name="yearsExperience"
            value={commlData.business?.yearsExperience || ''}
            onChange={(e) => updateCommlData('business', { yearsExperience: e.target.value })}
            placeholder="e.g. 5"
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="Annual Revenue"
            name="annualRevenue"
            value={commlData.business?.annualRevenue || ''}
            onChange={(e) => updateCommlData('business', { annualRevenue: e.target.value })}
            placeholder="e.g. $500,000"
          />
          <TextInput
            label="Total Revenue"
            name="totalRevenue"
            value={commlData.business?.totalRevenue || ''}
            onChange={(e) => updateCommlData('business', { totalRevenue: e.target.value })}
            placeholder="e.g. $500,000"
          />
        </div>
      </div>

      {/* Business Operations Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Business Operations" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <SelectInput
            label="Business Type (IBC Industry Code)"
            name="ibcCode"
            value={commlData.business?.operations?.[0]?.ibcCode || ''}
            onChange={handleIbcChange}
            options={ibcOptions}
            placeholder="Select industry code"
          />
          <TextInput
            label="% of Total Revenue"
            name="revenuePct"
            value={commlData.business?.operations?.[0]?.revenuePct || '100'}
            onChange={handleRevenuePctChange}
            placeholder="e.g. 100"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={styles.buttonGroup}>
        <button
          disabled
          style={{
            ...getButtonStyle('secondary'),
            opacity: 0.5,
            cursor: 'not-allowed',
          }}
        >
          Back
        </button>
        <button
          style={getButtonStyle('primary')}
          onMouseEnter={() => setHoveredButton('next')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommlQuoteFormPage1;
