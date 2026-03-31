/**
 * MockDisclaimer Component
 * Large, prominent disclaimer banner shown when the app is running in mock mode.
 * Displayed on insurer selection and all subsequent quote result screens.
 */

import React from 'react';
import config from '../config/index.js';

const styles = {
  banner: {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '6px',
    padding: '16px 24px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  icon: {
    fontSize: '24px',
    lineHeight: 1,
    flexShrink: 0,
    marginTop: '2px',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#664d03',
    marginBottom: '4px',
  },
  body: {
    fontSize: '14px',
    color: '#664d03',
    lineHeight: 1.5,
    margin: 0,
  },
};

const MockDisclaimer = () => {
  if (!config.mockMode) return null;

  return (
    <div style={styles.banner}>
      <span style={styles.icon} role="img" aria-label="warning">&#9888;</span>
      <div style={styles.textBlock}>
        <div style={styles.title}>DEMO MODE — Mocked Responses</div>
        <p style={styles.body}>
          This application is running without a live backend. All insurer quotes,
          premiums, coverages, and underwriting messages shown from this point
          forward are entirely fictional and hardcoded for demonstration purposes
          only. They do not reflect real insurer pricing or decisions.
        </p>
      </div>
    </div>
  );
};

export default MockDisclaimer;
