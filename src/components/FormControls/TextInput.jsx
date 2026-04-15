import React from 'react';

/**
 * TextInput Component
 * A reusable labeled text input with optional error message
 *
 * @param {string} label - Label text displayed above the input
 * @param {string} name - Name attribute for the input
 * @param {string} value - Current value of the input
 * @param {function} onChange - Callback when input value changes
 * @param {string} [type='text'] - HTML input type
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether the field is required
 * @param {boolean} disabled - Whether the input is disabled
 * @param {string} error - Error message to display
 * @param {string} className - Additional CSS classes
 */
const TextInput = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  disabled,
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
    input: {
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
    },
    inputFocus: {
      borderColor: 'var(--color-border-focus)',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(26, 59, 102, 0.1)',
    },
    inputDisabled: {
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text-light)',
      cursor: 'not-allowed',
      opacity: '0.6',
    },
    inputError: {
      borderColor: '#dc2626',
    },
    errorMessage: {
      marginTop: '0.375rem',
      fontSize: '0.85rem',
      color: '#dc2626',
      fontFamily: 'var(--font-family)',
    },
  };

  const handleFocus = (e) => {
    Object.assign(e.target.style, styles.inputFocus);
  };

  const handleBlur = (e) => {
    e.target.style.boxShadow = '';
  };

  const inputStyle = {
    ...styles.input,
    ...(disabled && styles.inputDisabled),
    ...(error && styles.inputError),
  };

  return (
    <div style={styles.container} className={className}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {error && <div style={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default TextInput;
