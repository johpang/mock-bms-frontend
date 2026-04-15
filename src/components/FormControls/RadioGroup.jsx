import React from 'react';

/**
 * RadioGroup Component
 * A group of radio buttons with a shared label and optional error message
 * Commonly used for Yes/No questions or single-choice options
 *
 * @param {string} label - Label text displayed above the radio group
 * @param {string} name - Name attribute for all radio buttons in the group
 * @param {string} value - Currently selected radio value
 * @param {function} onChange - Callback when selection changes
 * @param {Array<{value: string, label: string}>} options - Array of radio option objects
 * @param {boolean} required - Whether the field is required
 * @param {boolean} [inline=true] - Whether to display radio buttons inline or stacked
 * @param {string} error - Error message to display
 * @param {string} className - Additional CSS classes
 */
const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required,
  inline = true,
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
      marginBottom: '0.75rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-family)',
    },
    required: {
      color: 'var(--color-accent)',
      marginLeft: '0.25rem',
    },
    radioGroup: {
      display: 'flex',
      flexDirection: inline ? 'row' : 'column',
      gap: inline ? '1.5rem' : '0.75rem',
      alignItems: inline ? 'center' : 'flex-start',
    },
    radioWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
    },
    radio: {
      width: '1.2rem',
      height: '1.2rem',
      cursor: 'pointer',
      accentColor: 'var(--color-accent)',
      flexShrink: 0,
    },
    radioLabel: {
      fontSize: '0.95rem',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-family)',
      cursor: 'pointer',
      userSelect: 'none',
    },
    errorMessage: {
      marginTop: '0.5rem',
      fontSize: '0.85rem',
      color: '#dc2626',
      fontFamily: 'var(--font-family)',
    },
  };

  return (
    <div style={styles.container} className={className}>
      {label && (
        <label style={styles.label}>
          {label}
        </label>
      )}
      <div style={styles.radioGroup}>
        {options.map((option) => (
          <label key={option.value} style={styles.radioWrapper}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
              style={styles.radio}
            />
            <span style={styles.radioLabel}>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <div style={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default RadioGroup;
