import React from 'react';

/**
 * CheckboxInput Component
 * A single labeled checkbox with optional description text
 *
 * @param {string} label - Label text displayed next to the checkbox
 * @param {string} name - Name attribute for the checkbox
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {function} onChange - Callback when checkbox state changes
 * @param {boolean} disabled - Whether the checkbox is disabled
 * @param {string} className - Additional CSS classes
 */
const CheckboxInput = ({
  label,
  name,
  checked,
  onChange,
  disabled,
  className,
}) => {
  const styles = {
    container: {
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
    checkbox: {
      width: '1.2rem',
      height: '1.2rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      accentColor: 'var(--color-accent)',
      flexShrink: 0,
      opacity: disabled ? 0.6 : 1,
    },
    label: {
      fontSize: '0.95rem',
      color: disabled ? 'var(--color-text-light)' : 'var(--color-text)',
      fontFamily: 'var(--font-family)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
    },
  };

  const containerStyle = {
    ...styles.container,
    ...(disabled && { opacity: 0.6 }),
  };

  return (
    <label style={containerStyle} className={className}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={styles.checkbox}
      />
      {label && <span style={styles.label}>{label}</span>}
    </label>
  );
};

export default CheckboxInput;
