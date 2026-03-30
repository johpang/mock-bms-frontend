import React from 'react';

/**
 * SectionHeader Component
 * A visual section divider with a title, used to separate form sections
 * Features a dark navy background with white text
 *
 * @param {string} title - The section title text
 * @param {string} className - Additional CSS classes
 */
const SectionHeader = ({ title, className }) => {
  const styles = {
    header: {
      backgroundColor: 'var(--color-navy, #0a1e3d)',
      color: 'var(--color-white)',
      padding: '0.875rem 1rem',
      fontSize: '1rem',
      fontWeight: '600',
      fontFamily: 'var(--font-family)',
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: '1.5rem',
      marginTop: '1.5rem',
      letterSpacing: '0.3px',
    },
  };

  return (
    <div style={styles.header} className={className}>
      {title}
    </div>
  );
};

export default SectionHeader;
