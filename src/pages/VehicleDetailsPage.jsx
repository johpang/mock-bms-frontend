import React, { useState, useEffect } from 'react';
import { TextInput, SelectInput, CheckboxInput, SectionHeader } from '../components/FormControls';
import { useAutoQuote } from '../context/AutoContext';

const VehicleDetailsPage = () => {
  const { quoteData, updateQuoteData, nextStep, prevStep } = useAutoQuote();
  const [errors, setErrors] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(0);

  // Initialize vehicles array on mount
  useEffect(() => {
    if (!quoteData.vehicles || quoteData.vehicles.length === 0) {
      const initialVehicle = {
        year: '',
        make: '',
        model: '',
        ownership: '',
        antiTheft: '',
        primaryUse: '',
        distanceDriven: {
          inTrip: '',
          annually: '',
          businessKm: '',
        },
      };
      updateQuoteData('vehicles', [initialVehicle]);
      setExpandedIndex(0);
    }
  }, []);

  const handleVehicleChange = (index, field) => (e) => {
    const updatedVehicles = [...quoteData.vehicles];
    updatedVehicles[index][field] = e.target.value;
    updateQuoteData('vehicles', updatedVehicles);
  };

  const handleDistanceChange = (index, field) => (e) => {
    const updatedVehicles = [...quoteData.vehicles];
    updatedVehicles[index].distanceDriven[field] = e.target.value;
    updateQuoteData('vehicles', updatedVehicles);
  };

  const handleCoverageCheckbox = (field) => (e) => {
    updateQuoteData(null, { [field]: e.target.checked });
  };

  const handleCurrencyInput = (field) => (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    updateQuoteData(null, { [field]: raw });
  };

  const addVehicle = () => {
    const newVehicle = {
      year: '',
      make: '',
      model: '',
      ownership: '',
      antiTheft: '',
      primaryUse: '',
      distanceDriven: {
        inTrip: '',
        annually: '',
        businessKm: '',
      },
    };
    const updatedVehicles = [...quoteData.vehicles, newVehicle];
    updateQuoteData('vehicles', updatedVehicles);
    setExpandedIndex(updatedVehicles.length - 1);
  };

  const removeVehicle = (index) => {
    if (quoteData.vehicles.length > 1) {
      const updatedVehicles = quoteData.vehicles.filter((_, i) => i !== index);
      updateQuoteData('vehicles', updatedVehicles);
      if (expandedIndex >= updatedVehicles.length) {
        setExpandedIndex(updatedVehicles.length - 1);
      }
    }
  };

  const validateForm = () => {
    const newErrors = [];

    // Validate each vehicle
    quoteData.vehicles.forEach((vehicle, index) => {
      const vehicleLabel = `Vehicle ${index + 1}`;

      if (!vehicle.year) newErrors.push(`${vehicleLabel}: Year is required`);
      if (!vehicle.make) newErrors.push(`${vehicleLabel}: Make is required`);
      if (!vehicle.model) newErrors.push(`${vehicleLabel}: Model is required`);
      if (vehicle.antiTheft === '' || vehicle.antiTheft === undefined) {
        newErrors.push(`${vehicleLabel}: Anti-theft device selection is required`);
      }
      if (!vehicle.primaryUse) newErrors.push(`${vehicleLabel}: Primary use is required`);

      // Distance Driven validation
      if (!vehicle.distanceDriven?.inTrip) newErrors.push(`${vehicleLabel}: In-trip distance is required`);
      if (!vehicle.distanceDriven?.annually) newErrors.push(`${vehicleLabel}: Annual distance is required`);
      if (!vehicle.distanceDriven?.businessKm) newErrors.push(`${vehicleLabel}: Business km is required`);
    });

    // Coverage deductible validation
    if (quoteData.comprehensiveCoverage && !quoteData.comprehensiveDeductible) {
      newErrors.push('Comprehensive deductible is required');
    }
    if (quoteData.collisionCoverage && !quoteData.collisionDeductible) {
      newErrors.push('Collision deductible is required');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getVehicleTitle = (vehicle, index) => {
    if (vehicle.year && vehicle.make && vehicle.model) {
      return `Vehicle ${index + 1}: ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    }
    return `Vehicle ${index + 1}: New Vehicle`;
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* Error Messages */}
      {errors.length > 0 && (
        <div
          style={{
            backgroundColor: '#ffebee',
            border: '2px solid #c62828',
            borderRadius: '4px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ color: '#c62828', fontWeight: 'bold', marginBottom: '8px' }}>
            Please fix the following errors:
          </div>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#c62828' }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Vehicle Details Section */}
      <SectionHeader title="Vehicle Details" />

      {/* Vehicle Accordions */}
      <div style={{ marginBottom: '24px' }}>
        {quoteData.vehicles && quoteData.vehicles.map((vehicle, index) => (
          <div key={index}>
            {/* Accordion Header */}
            <div
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              style={{
                backgroundColor: '#0a1e3d',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '2px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
              }}
            >
              <span>{getVehicleTitle(vehicle, index)}</span>
              <span style={{ fontSize: '18px' }}>
                {expandedIndex === index ? '▲' : '▼'}
              </span>
            </div>

            {/* Accordion Body */}
            {expandedIndex === index && (
              <div
                style={{
                  border: '1px solid #e0e0e0',
                  borderLeft: '3px solid #e0e0e0',
                  borderRight: '3px solid #e0e0e0',
                  borderBottom: '3px solid #e0e0e0',
                  padding: '16px',
                  marginBottom: '16px',
                  borderRadius: '0 0 4px 4px',
                }}
              >
                {/* Row 1: Year, Make, Model */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <TextInput
                    label="Vehicle Year"
                    value={vehicle.year || ''}
                    onChange={handleVehicleChange(index, 'year')}
                    placeholder="e.g., 2020"
                  />
                  <TextInput
                    label="Vehicle Make"
                    value={vehicle.make || ''}
                    onChange={handleVehicleChange(index, 'make')}
                    placeholder="e.g., Honda"
                  />
                  <TextInput
                    label="Vehicle Model"
                    value={vehicle.model || ''}
                    onChange={handleVehicleChange(index, 'model')}
                    placeholder="e.g., Civic"
                  />
                </div>

                {/* Row 2: Ownership, Anti-theft, Primary Use */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <SelectInput
                    label="Ownership"
                    value={vehicle.ownership || ''}
                    onChange={handleVehicleChange(index, 'ownership')}
                    options={[
                      { label: 'Select an option', value: '' },
                      { label: 'Owned', value: 'Owned' },
                      { label: 'Leased', value: 'Leased' },
                      { label: 'Financed', value: 'Financed' },
                    ]}
                  />
                  <SelectInput
                    label="Anti-theft Device Installed?"
                    value={vehicle.antiTheft || ''}
                    onChange={handleVehicleChange(index, 'antiTheft')}
                    options={[
                      { label: 'Select an option', value: '' },
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]}
                  />
                  <SelectInput
                    label="Primary Use?"
                    value={vehicle.primaryUse || ''}
                    onChange={handleVehicleChange(index, 'primaryUse')}
                    options={[
                      { label: 'Select an option', value: '' },
                      { label: 'Pleasure', value: 'pleasure' },
                      { label: 'Commute', value: 'commute' },
                      { label: 'Business', value: 'business' },
                    ]}
                  />
                </div>

                {/* Row 3: Distance Driven Sub-header and fields */}
                <div style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                  Distance Driven
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <TextInput
                    label="In-trip (km)"
                    type="number"
                    value={vehicle.distanceDriven?.inTrip || ''}
                    onChange={handleDistanceChange(index, 'inTrip')}
                    placeholder="0"
                  />
                  <TextInput
                    label="Annually (km)"
                    type="number"
                    value={vehicle.distanceDriven?.annually || ''}
                    onChange={handleDistanceChange(index, 'annually')}
                    placeholder="0"
                  />
                  <TextInput
                    label="Business km"
                    type="number"
                    value={vehicle.distanceDriven?.businessKm || ''}
                    onChange={handleDistanceChange(index, 'businessKm')}
                    placeholder="0"
                  />
                </div>

                {/* Remove Vehicle Button */}
                {quoteData.vehicles.length > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button
                      onClick={() => removeVehicle(index)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        backgroundColor: 'transparent',
                        color: '#c62828',
                        border: '2px solid #c62828',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'backgroundColor 0.2s',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#ffebee')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                    >
                      Remove Vehicle
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Vehicle Button */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={addVehicle}
          style={{
            padding: '10px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            color: '#0a1e3d',
            border: '2px solid #0a1e3d',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'backgroundColor 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
        >
          + Add Vehicle
        </button>
      </div>

      {/* Coverage Section */}
      <SectionHeader title="Coverage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Comprehensive Coverage */}
        <div style={{ border: '1px solid #e0e0e0', padding: '16px', borderRadius: '4px' }}>
          <div style={{ marginBottom: '12px' }}>
            <CheckboxInput
              label="Comprehensive Coverage"
              checked={quoteData.comprehensiveCoverage || false}
              onChange={handleCoverageCheckbox('comprehensiveCoverage')}
            />
          </div>
          {quoteData.comprehensiveCoverage && (
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                Deductible
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '16px' }}>$</span>
                <input
                  type="text"
                  value={quoteData.comprehensiveDeductible || ''}
                  onChange={handleCurrencyInput('comprehensiveDeductible')}
                  placeholder="1000"
                  style={{
                    width: '100%',
                    padding: '8px 8px 8px 24px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Collision Coverage */}
        <div style={{ border: '1px solid #e0e0e0', padding: '16px', borderRadius: '4px' }}>
          <div style={{ marginBottom: '12px' }}>
            <CheckboxInput
              label="Collision Coverage"
              checked={quoteData.collisionCoverage || false}
              onChange={handleCoverageCheckbox('collisionCoverage')}
            />
          </div>
          {quoteData.collisionCoverage && (
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                Deductible
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '16px' }}>$</span>
                <input
                  type="text"
                  value={quoteData.collisionDeductible || ''}
                  onChange={handleCurrencyInput('collisionDeductible')}
                  placeholder="1000"
                  style={{
                    width: '100%',
                    padding: '8px 8px 8px 24px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <button
          onClick={prevStep}
          style={{
            padding: '10px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            color: '#0a1e3d',
            border: '2px solid #0a1e3d',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'backgroundColor 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: '10px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#0a1e3d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'backgroundColor 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#1a3a6b')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#0a1e3d')}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
