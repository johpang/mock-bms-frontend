import React from 'react';
import PropTypes from 'prop-types';

/**
 * Footer Component
 *
 * Bottom footer bar for the BMS insurance quoting app.
 * Fixed positioning at the bottom with dark navy background.
 * Displays API gateway and demo information in centered, light text.
 *
 * @component
 * @returns {React.ReactElement} The footer element
 */
const Footer = () => {
  const footerStyles = {
    footer: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40px',
      backgroundColor: '#0a1e3d',
      borderTop: '1px solid #2a5298',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      zIndex: 1000,
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)',
    },
    footerText: {
      fontSize: '12px',
      color: '#5a6a7a',
      fontWeight: '400',
      letterSpacing: '0.3px',
    },
  };

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.footerText}>
        API Gateway Demo — BMS Mock-up
      </div>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;
