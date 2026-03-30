import React from 'react';
import PropTypes from 'prop-types';

/**
 * Header Component
 *
 * Top navigation/header bar for the BMS insurance quoting app.
 * Fixed/sticky positioning at the top with dark navy background and corporate styling.
 * Displays app title on left, line of business on right.
 *
 * @component
 * @returns {React.ReactElement} The header element
 */
const Header = () => {
  const headerStyles = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#0a1e3d',
      borderBottom: '1px solid #2a5298',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '24px',
      paddingRight: '24px',
      boxSizing: 'border-box',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    leftContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffff',
      letterSpacing: '0.5px',
    },
    subtitle: {
      fontSize: '11px',
      color: '#5a6a7a',
      fontWeight: '400',
      letterSpacing: '0.3px',
    },
    rightContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    lineOfBusiness: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#ffffff',
      letterSpacing: '0.2px',
    },
  };

  return (
    <header style={headerStyles.header}>
      <div style={headerStyles.leftContainer}>
        <div style={headerStyles.logo}>BMS</div>
        <div style={headerStyles.subtitle}>Broker Management System</div>
      </div>
      <div style={headerStyles.rightContainer}>
        <div style={headerStyles.lineOfBusiness}>Personal Lines Automobile</div>
      </div>
    </header>
  );
};

Header.propTypes = {};

export default Header;
