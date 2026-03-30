import React from 'react';
import PropTypes from 'prop-types';

/**
 * StepIndicator Component
 *
 * Progress bar stepper component for multi-step workflows.
 * Displays a horizontal progress bar that fills left-to-right as the user progresses.
 * Shows current step label positioned below the bar, aligned with progress.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string[]} props.steps - Array of step label strings
 * @param {number} props.currentStep - Current step index (0-indexed)
 * @returns {React.ReactElement} The step indicator component
 */
const StepIndicator = ({
  steps = [
    'Start',
    'Quote Details',
    'Vehicle Details',
    'Driver & History',
    'Select Insurers',
    'Compare Quotes',
    'Premium Breakdown',
  ],
  currentStep = 0,
}) => {
  // Calculate fill percentage: (currentStep / (totalSteps - 1)) * 100
  const fillPercentage = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  const styles = {
    container: {
      padding: '0.5px 24px',
      backgroundColor: '#ffffff',
    },
    barWrapper: {
      position: 'relative',
      width: '100%',
    },
    barBackground: {
      width: '100%',
      height: '6px',
      backgroundColor: '#e0e0e0',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      backgroundColor: '#0a1e3d',
      borderRadius: '3px',
      width: `${fillPercentage}%`,
      transition: 'width 0.3s ease',
    },
    labelWrapper: {
      position: 'relative',
      marginTop: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#0a1e3d',
      whiteSpace: 'nowrap',
      position: 'absolute',
      // Transform to align center of label with the fill edge
      transform: 'translateX(-50%)',
      left: `${fillPercentage}%`,
      transition: 'left 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.barWrapper}>
        <div style={styles.barBackground}>
          <div style={styles.barFill} />
        </div>
        <div style={styles.labelWrapper}>
          <div style={styles.label}>
            {steps[currentStep]}
          </div>
        </div>
      </div>
    </div>
  );
};

StepIndicator.propTypes = {
  /**
   * Array of step labels to display
   */
  steps: PropTypes.arrayOf(PropTypes.string),
  /**
   * Zero-indexed number of the current step
   */
  currentStep: PropTypes.number,
};

StepIndicator.defaultProps = {
  steps: [
    'Start',
    'Quote Details',
    'Vehicle Details',
    'Driver & History',
    'Select Insurers',
    'Compare Quotes',
    'Premium Breakdown',
  ],
  currentStep: 0,
};

export default StepIndicator;
