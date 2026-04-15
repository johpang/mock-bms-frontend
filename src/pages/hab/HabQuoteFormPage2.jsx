/**
 * HabQuoteFormPage2 Component
 * Second page of the habitational insurance quote form wizard
 * Collects risk type, risk address, and building details
 *
 * @component
 * @returns {JSX.Element} The second form page
 */

import React, { useState } from 'react';
import {
  TextInput,
  SelectInput,
  SectionHeader,
  RadioGroup,
} from '../../components/FormControls';
import { useHab } from '../../context/HabContext';

const HabQuoteFormPage2 = () => {
  const { habData, updateHabData, nextStep, prevStep } = useHab();
  const [errors, setErrors] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Field options
  const riskTypeOptions = [
    { value: 'Homeowners', label: 'Homeowners' },
    { value: 'Condo', label: 'Condo' },
    { value: 'Tenant', label: 'Tenant' },
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

  const yesNoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const occupancyTypeOptions = [
    { value: 'Owner Occupied', label: 'Owner Occupied' },
    { value: 'Tenant Occupied', label: 'Tenant Occupied' },
    { value: 'Vacant', label: 'Vacant' },
  ];

  const structureTypeOptions = [
    { value: 'Detached', label: 'Detached' },
    { value: 'Semi-Detached', label: 'Semi-Detached' },
    { value: 'Row House', label: 'Row House' },
    { value: 'Condo', label: 'Condo' },
  ];

  const foundationTypeOptions = [
    { value: 'Full Basement', label: 'Full Basement' },
    { value: 'Crawl Space', label: 'Crawl Space' },
    { value: 'Slab', label: 'Slab' },
    { value: 'Concrete', label: 'Concrete' },
  ];

  const exteriorWallFinishOptions = [
    { value: 'Brick Veneer', label: 'Brick Veneer' },
    { value: 'Vinyl Siding', label: 'Vinyl Siding' },
    { value: 'Aluminum', label: 'Aluminum' },
    { value: 'Stucco', label: 'Stucco' },
    { value: 'Wood', label: 'Wood' },
  ];

  const garageTypeOptions = [
    { value: 'Attached', label: 'Attached' },
    { value: 'Detached', label: 'Detached' },
    { value: 'Built-In', label: 'Built-In' },
    { value: 'Carport', label: 'Carport' },
    { value: 'None', label: 'None' },
    { value: 'Underground Parking', label: 'Underground Parking' },
  ];

  const roofCoveringTypeOptions = [
    { value: 'Asphalt Shingles', label: 'Asphalt Shingles' },
    { value: 'Metal', label: 'Metal' },
    { value: 'Flat Membrane', label: 'Flat Membrane' },
    { value: 'Cedar Shakes', label: 'Cedar Shakes' },
    { value: 'Tile', label: 'Tile' },
  ];

  const electricalWiringTypeOptions = [
    { value: 'Copper', label: 'Copper' },
    { value: 'Aluminum', label: 'Aluminum' },
    { value: 'Knob and Tube', label: 'Knob and Tube' },
  ];

  const electricalPanelTypeOptions = [
    { value: 'Circuit Breakers', label: 'Circuit Breakers' },
    { value: 'Fuses', label: 'Fuses' },
  ];

  const serviceAmperageOptions = [
    { value: '60', label: '60' },
    { value: '100', label: '100' },
    { value: '200', label: '200' },
    { value: '400', label: '400' },
  ];

  const heatingTypeOptions = [
    { value: 'Forced Air Gas', label: 'Forced Air Gas' },
    { value: 'Forced Air Electric', label: 'Forced Air Electric' },
    { value: 'Hot Water', label: 'Hot Water' },
    { value: 'Electric Baseboard', label: 'Electric Baseboard' },
    { value: 'Radiant', label: 'Radiant' },
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

    // Risk Type
    if (!habData.riskType?.trim()) missingFields.push('Risk Type');

    // Risk Address
    if (!habData.riskAddress?.address?.trim()) missingFields.push('Risk Address');
    if (!habData.riskAddress?.city?.trim()) missingFields.push('Risk City');
    if (!habData.riskAddress?.province?.trim()) missingFields.push('Risk Province');
    if (!habData.riskAddress?.postalCode?.trim()) missingFields.push('Risk Postal Code');

    // Building Details
    if (!habData.building?.yearBuilt?.trim()) missingFields.push('Year Built');
    if (!habData.building?.numStoreys?.trim()) missingFields.push('Number of Storeys');
    if (!habData.building?.numFamilies?.trim()) missingFields.push('Number of Families');
    if (!habData.building?.numUnits?.trim()) missingFields.push('Number of Units');
    if (!habData.building?.totalLivingArea?.trim()) missingFields.push('Total Living Area');
    if (!habData.building?.smokers) missingFields.push('Smokers');
    if (!habData.building?.numMortgages?.trim()) missingFields.push('Number of Mortgages');
    if (!habData.building?.homeInsuranceYears?.trim()) missingFields.push('Home Insurance Years');

    // Replacement Cost
    if (!habData.replacementCost?.occupancyType) missingFields.push('Occupancy Type');
    if (!habData.replacementCost?.structureType) missingFields.push('Structure Type');
    if (!habData.replacementCost?.foundationType) missingFields.push('Foundation Type');
    if (!habData.replacementCost?.finishedBasementPercent?.trim()) missingFields.push('Finished Basement %');
    if (!habData.replacementCost?.exteriorWallFinish) missingFields.push('Exterior Wall Finish');
    if (!habData.replacementCost?.garageType) missingFields.push('Garage Type');

    // Upgrades
    // Building Improvements (YYYY format)
    if (!habData.upgrades?.heatingYear?.trim()) missingFields.push('Heating Year');
    if (!habData.upgrades?.plumbingYear?.trim()) missingFields.push('Plumbing Year');
    if (!habData.upgrades?.electricalYear?.trim()) missingFields.push('Electrical Year');
    if (!habData.upgrades?.roofYear?.trim()) missingFields.push('Roof Year');

    // Protection
    if (!habData.protection?.mainWaterValveShutOff?.trim()) missingFields.push('Water Shut Off Valve');
    if (!habData.protection?.fireProtection?.trim()) missingFields.push('Fire Protection');
    if (!habData.protection?.securitySystem) missingFields.push('Security System');
    if (!habData.protection?.distanceToHydrant?.trim()) missingFields.push('Distance to Hydrant');
    if (!habData.protection?.numSmokeDetectors?.trim()) missingFields.push('Number of Smoke Detectors');


    // Detached Outbuildings
    if (!habData.detachedOutbuildings?.trim()) missingFields.push('Detached Outbuildings');

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

      {/* Risk Type Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Risk Type" />
        <div style={{ marginBottom: '1.5rem' }}>
          <RadioGroup
            label="Select Risk Type"
            name="riskType"
            value={habData.riskType || ''}
            onChange={(e) => updateHabData(null, { riskType: e.target.value })}
            options={riskTypeOptions}
            inline={false}
            required
          />
        </div>
      </div>

      {/* Risk Address Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Risk Address" />
        <div style={{ ...styles.rowContainer, ...styles.fourColumnRow }}>
          <TextInput
            label="Address"
            name="riskAddress"
            value={habData.riskAddress?.address || ''}
            onChange={(e) => updateHabData('riskAddress', { address: e.target.value })}
            placeholder="Street address"
            required
          />
          <TextInput
            label="City"
            name="riskCity"
            value={habData.riskAddress?.city || ''}
            onChange={(e) => updateHabData('riskAddress', { city: e.target.value })}
            placeholder="City"
            required
          />
          <SelectInput
            label="Province"
            name="riskProvince"
            value={habData.riskAddress?.province || ''}
            onChange={(e) => updateHabData('riskAddress', { province: e.target.value })}
            options={provinceOptions}
            placeholder="Select province"
            required
          />
          <TextInput
            label="Postal Code"
            name="riskPostalCode"
            value={habData.riskAddress?.postalCode || ''}
            onChange={(e) => updateHabData('riskAddress', { postalCode: e.target.value })}
            placeholder="e.g. M5V 3A8"
            required
          />
        </div>
      </div>

      {/* Building Details Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Building Details" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="Year Built"
            name="yearBuilt"
            value={habData.building?.yearBuilt || ''}
            onChange={(e) => updateHabData('building', { yearBuilt: e.target.value })}
            placeholder="e.g. 1995"
            required
          />
          <TextInput
            label="No. of Storeys"
            name="numStoreys"
            value={habData.building?.numStoreys || ''}
            onChange={(e) => updateHabData('building', { numStoreys: e.target.value })}
            placeholder="e.g. 2"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="No. of Families"
            name="numFamilies"
            value={habData.building?.numFamilies || ''}
            onChange={(e) => updateHabData('building', { numFamilies: e.target.value })}
            placeholder="e.g. 1"
            required
          />
          <TextInput
            label="No. of Units"
            name="numUnits"
            value={habData.building?.numUnits || ''}
            onChange={(e) => updateHabData('building', { numUnits: e.target.value })}
            placeholder="e.g. 1"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="Total Living Area (Sqft.)"
            name="totalLivingArea"
            value={habData.building?.totalLivingArea || ''}
            onChange={(e) => updateHabData('building', { totalLivingArea: e.target.value })}
            placeholder="e.g. 2000"
            required
          />
          <div style={{ marginBottom: '1rem' }}>
            <RadioGroup
              label="Smokers"
              name="smokers"
              value={habData.building?.smokers || ''}
              onChange={(e) => updateHabData('building', { smokers: e.target.value })}
              options={yesNoOptions}
              inline={true}
              required
            />
          </div>
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <TextInput
            label="# of Mortgages"
            name="numMortgages"
            value={habData.building?.numMortgages || ''}
            onChange={(e) => updateHabData('building', { numMortgages: e.target.value })}
            placeholder="e.g. 1"
            required
          />
          <TextInput
            label="How long have you had home insurance? (years)"
            name="homeInsuranceYears"
            value={habData.building?.homeInsuranceYears || ''}
            onChange={(e) => updateHabData('building', { homeInsuranceYears: e.target.value })}
            placeholder="e.g. 5"
            required
          />
        </div>
      </div>

      {/* Replacement Cost Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Replacement Cost" />
        <div style={{ ...styles.rowContainer, ...styles.threeColumnRow }}>
          <SelectInput
            label="Occupancy Type"
            name="occupancyType"
            value={habData.replacementCost?.occupancyType || ''}
            onChange={(e) => updateHabData('replacementCost', { occupancyType: e.target.value })}
            options={occupancyTypeOptions}
            placeholder="Select occupancy type"
            required
          />
          <SelectInput
            label="Structure Type"
            name="structureType"
            value={habData.replacementCost?.structureType || ''}
            onChange={(e) => updateHabData('replacementCost', { structureType: e.target.value })}
            options={structureTypeOptions}
            placeholder="Select structure type"
            required
          />
          <SelectInput
            label="Foundation Type"
            name="foundationType"
            value={habData.replacementCost?.foundationType || ''}
            onChange={(e) => updateHabData('replacementCost', { foundationType: e.target.value })}
            options={foundationTypeOptions}
            placeholder="Select foundation type"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.threeColumnRow }}>
          <TextInput
            label="Finished Basement %"
            name="finishedBasementPercent"
            value={habData.replacementCost?.finishedBasementPercent || ''}
            onChange={(e) => updateHabData('replacementCost', { finishedBasementPercent: e.target.value })}
            placeholder="e.g. 50"
            required
          />
          <SelectInput
            label="Exterior Wall Finish"
            name="exteriorWallFinish"
            value={habData.replacementCost?.exteriorWallFinish || ''}
            onChange={(e) => updateHabData('replacementCost', { exteriorWallFinish: e.target.value })}
            options={exteriorWallFinishOptions}
            placeholder="Select finish type"
            required
          />
          <SelectInput
            label="Garage Type"
            name="garageType"
            value={habData.replacementCost?.garageType || ''}
            onChange={(e) => updateHabData('replacementCost', { garageType: e.target.value })}
            options={garageTypeOptions}
            placeholder="Select garage type"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.threeColumnRow }}>
          <TextInput
            label="Estimated Replacement Cost"
            name="estimatedReplacementCost"
            value={habData.replacementCost?.estimatedReplacementCost || ''}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
              updateHabData('replacementCost', { estimatedReplacementCost: val });
            }}
            placeholder="e.g. 500000"
          />
        </div>
      </div>

      {/* Building Improvements Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Building Improvements" />
        <div style={{ ...styles.rowContainer, ...styles.fourColumnRow }}>
          <TextInput
            label="Heating"
            name="heatingYear"
            value={habData.upgrades?.heatingYear || ''}
            onChange={(e) => updateHabData('upgrades', { heatingYear: e.target.value })}
            placeholder="YYYY"
          />
          <TextInput
            label="Plumbing"
            name="plumbingYear"
            value={habData.upgrades?.plumbingYear || ''}
            onChange={(e) => updateHabData('upgrades', { plumbingYear: e.target.value })}
            placeholder="YYYY"
          />
          <TextInput
            label="Electrical"
            name="electricalYear"
            value={habData.upgrades?.electricalYear || ''}
            onChange={(e) => updateHabData('upgrades', { electricalYear: e.target.value })}
            placeholder="YYYY"
          />
          <TextInput
            label="Roof"
            name="roofYear"
            value={habData.upgrades?.roofYear || ''}
            onChange={(e) => updateHabData('upgrades', { roofYear: e.target.value })}
            placeholder="YYYY"
          />
        </div>
      </div>

      {/* Protection Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Protection" />
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <RadioGroup
            label="Water Shut Off Valve"
            name="mainWaterValveShutOff"
            value={habData.protection?.mainWaterValveShutOff || ''}
            onChange={(e) => updateHabData('protection', { mainWaterValveShutOff: e.target.value })}
            options={yesNoOptions}
            inline={true}
          />
          <RadioGroup
            label="Fire Protection"
            name="fireProtection"
            value={habData.protection?.fireProtection || ''}
            onChange={(e) => updateHabData('protection', { fireProtection: e.target.value })}
            options={[
              { value: 'Unprotected', label: 'Unprotected' },
              { value: 'Semi-protected', label: 'Semi-protected' },
              { value: 'Protected', label: 'Protected' },
            ]}
            inline={true}
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.twoColumnRow }}>
          <div style={{ marginBottom: '1rem' }}>
            <RadioGroup
              label="Security System"
              name="securitySystem"
              value={habData.protection?.securitySystem || ''}
              onChange={(e) => updateHabData('protection', { securitySystem: e.target.value })}
              options={yesNoOptions}
              inline={true}
              required
            />
          </div>
          <TextInput
            label="Distance to Hydrant (m)"
            name="distanceToHydrant"
            value={habData.protection?.distanceToHydrant || ''}
            onChange={(e) => updateHabData('protection', { distanceToHydrant: e.target.value })}
            placeholder="e.g. 100"
            required
          />
        </div>
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <TextInput
            label="Number of Smoke Detectors"
            name="numSmokeDetectors"
            value={habData.protection?.numSmokeDetectors || ''}
            onChange={(e) => updateHabData('protection', { numSmokeDetectors: e.target.value })}
            placeholder="e.g. 3"
            required
          />
        </div>
      </div>

      {/* Detached Outbuildings Section */}
      <div style={styles.sectionContainer}>
        <SectionHeader title="Detached Outbuildings" />
        <div style={{ ...styles.rowContainer, ...styles.fullWidthRow }}>
          <TextInput
            label="Detached Outbuildings"
            name="detachedOutbuildings"
            value={habData.detachedOutbuildings || ''}
            onChange={(e) => updateHabData(null, { detachedOutbuildings: e.target.value })}
            placeholder="e.g. Shed, Garage"
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

export default HabQuoteFormPage2;
