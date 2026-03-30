/**
 * Validation Utilities
 * Provides validation functions for form fields and steps
 */

/**
 * Validates that a required field has a value
 * @param {string} value - The value to validate
 * @param {string} fieldName - The name of the field for error messages
 * @returns {Object} Validation result { isValid, error }
 */
export function validateRequired(value, fieldName) {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true, error: null };
}

/**
 * Validates Canadian postal code format (X1X 1X1)
 * @param {string} value - The postal code to validate
 * @returns {Object} Validation result { isValid, error }
 */
export function validatePostalCode(value) {
  const postalCodeRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
  if (!value || !postalCodeRegex.test(value.toUpperCase())) {
    return {
      isValid: false,
      error: 'Invalid postal code format (use X1X 1X1)',
    };
  }
  return { isValid: true, error: null };
}

/**
 * Validates Canadian phone number format
 * Accepts formats: (XXX) XXX-XXXX, XXX-XXX-XXXX, XXXXXXXXXX
 * @param {string} value - The phone number to validate
 * @returns {Object} Validation result { isValid, error }
 */
export function validatePhone(value) {
  const phoneRegex = /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  if (!value || !phoneRegex.test(value.replace(/\s/g, ''))) {
    return {
      isValid: false,
      error: 'Invalid phone number format',
    };
  }
  return { isValid: true, error: null };
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param {string} value - The date to validate
 * @returns {Object} Validation result { isValid, error }
 */
export function validateDate(value) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!value || !dateRegex.test(value)) {
    return {
      isValid: false,
      error: 'Invalid date format (use YYYY-MM-DD)',
    };
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date',
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates all fields for Step 1 (Producer and Customer Info)
 * @param {Object} data - The quote data object
 * @returns {Object} Validation result { isValid, errors: {} }
 */
export function validateStep1(data) {
  const errors = {};

  // Producer fields
  const producerCodeValidation = validateRequired(data.producerCode, 'Producer Code');
  if (!producerCodeValidation.isValid) {
    errors.producerCode = producerCodeValidation.error;
  }

  // Customer fields
  const firstNameValidation = validateRequired(data.customer?.firstName, 'First Name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error;
  }

  const lastNameValidation = validateRequired(data.customer?.lastName, 'Last Name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error;
  }

  const dobValidation = validateDate(data.customer?.dob);
  if (!dobValidation.isValid) {
    errors.dob = dobValidation.error;
  }

  const addressValidation = validateRequired(data.customer?.address, 'Address');
  if (!addressValidation.isValid) {
    errors.address = addressValidation.error;
  }

  const postalCodeValidation = validatePostalCode(data.customer?.postalCode);
  if (!postalCodeValidation.isValid) {
    errors.postalCode = postalCodeValidation.error;
  }

  const cityValidation = validateRequired(data.customer?.city, 'City');
  if (!cityValidation.isValid) {
    errors.city = cityValidation.error;
  }

  const phoneValidation = validatePhone(data.customer?.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates all fields for Step 2 (Vehicle and Coverage Info)
 * @param {Object} data - The quote data object
 * @returns {Object} Validation result { isValid, errors: {} }
 */
export function validateStep2(data) {
  const errors = {};

  // Vehicle fields
  const yearValidation = validateRequired(data.vehicle?.year, 'Vehicle Year');
  if (!yearValidation.isValid) {
    errors.year = yearValidation.error;
  }

  const makeValidation = validateRequired(data.vehicle?.make, 'Vehicle Make');
  if (!makeValidation.isValid) {
    errors.make = makeValidation.error;
  }

  const modelValidation = validateRequired(data.vehicle?.model, 'Vehicle Model');
  if (!modelValidation.isValid) {
    errors.model = modelValidation.error;
  }

  const primaryUseValidation = validateRequired(data.vehicle?.primaryUse, 'Primary Use');
  if (!primaryUseValidation.isValid) {
    errors.primaryUse = primaryUseValidation.error;
  }

  // Coverage fields
  const deductibleValidation = validateRequired(data.deductible, 'Deductible');
  if (!deductibleValidation.isValid) {
    errors.deductible = deductibleValidation.error;
  }

  // Garaging location
  const garagingPostalCodeValidation = validatePostalCode(data.garagingLocation?.postalCode);
  if (!garagingPostalCodeValidation.isValid) {
    errors.garagingPostalCode = garagingPostalCodeValidation.error;
  }

  const garagingCityValidation = validateRequired(data.garagingLocation?.city, 'Garaging City');
  if (!garagingCityValidation.isValid) {
    errors.garagingCity = garagingCityValidation.error;
  }

  // Policy date
  const policyDateValidation = validateDate(data.policyEffectiveDate);
  if (!policyDateValidation.isValid) {
    errors.policyEffectiveDate = policyDateValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
