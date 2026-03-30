import React from 'react';

/**
 * SelectInput Component
 * A reusable labeled select dropdown with optional error message
 *
 * @param {string} label - Label text displayed above the select
 * @param {string} name - Name attribute for the select
 * @param {string} value - Current selected value
 * @param {function} onChange - Callback when selection changes
 * @param {Array<{value: string, label: string}>} options - Array of option objects
 * @param {boolean} required - Whether the field is required
 * @param {boolean} disabled - Whether the select is disabled
 * @param {string} placeholder - Placeholder text for default option
 * @param {string} error - Error message to display
 * @param {string} className - Additional CSS classes
 */
const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required,
  disabled,
  placeholder = 'Select an option',
  error,
  className,
}) => {
  const styles = {
    container: {
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-family)',
    },
    required: {
      color: 'var(--color-accent)',
      marginLeft: '0.25rem',
    },
    select: {
      width: '100%',
      padding: '0.75rem 0.875rem',
      fontSize: '0.95rem',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius)',
      fontFamily: 'var(--font-family)',
      backgroundColor: 'var(--color-white)',
      color: 'var(--color-text)',
      transition: `border-color var(--transition-speed), box-shadow var(--transition-speed)`,
      boxSizing: 'border-box',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230a1e3d' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.75rem center',
      paddingRight: '2.5rem',
    },
    selectFocus: {
      borderColor: 'var(--color-border-focus)',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(26, 59, 102, 0.1)',
    },
    selectDisabled: {
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text-light)',
      cursor: 'not-allowed',
      opacity: '0.6',
    },
    selectError: {
      borderColor: '#dc2626',
    },
    option: {
      padding: '0.5rem',
      color: 'var(--color-text)',
    },
    errorMessage: {
      marginTop: '0.375rem',
      fontSize: '0.85rem',
      color: '#dc2626',
      fontFamily: 'var(--font-family)',
    },
  };

  const handleFocus = (e) => {
    Object.assign(e.target.style, styles.selectFocus);
  };

  const handleBlur = (e) => {
    e.target.style.boxShadow = '';
  };

  const selectStyle = {
    ...styles.select,
    ...(disabled && styles.selectDisabled),
    ...(error && styles.selectError),
  };

  return (
    <div style={styles.container} className={className}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={selectStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <option value="" disabled style={styles.option}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} style={styles.option}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div style={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default SelectInput;
