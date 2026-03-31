import React, { useState } from 'react';
import { useAutoQuote } from '../context/AutoContext';
import { formatCurrency } from '../utils/formatters';
import MockDisclaimer from '../components/MockDisclaimer';

/**
 * BindPage Component
 * Screen 7 - Policy summary + payment information form before binding
 */
const BindPage = () => {
  const {
    quoteResponses,
    selectedInsurerIndex,
    submitBind,
    nextStep,
    prevStep,
    isLoading,
    bindError,
    quoteData,
  } = useAutoQuote();

  const selectedResponse = quoteResponses?.[selectedInsurerIndex ?? 0];

  const [payment, setPayment] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
  });

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    error: '#cf222e',
    success: '#1a7f37',
  };

  const styles = {
    pageContainer: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 24px',
      minHeight: 'calc(100vh - 100px)',
      backgroundColor: colors.white,
    },
    title: {
      fontSize: '28px',
      fontWeight: 700,
      color: colors.navy,
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '32px',
    },
    sectionBox: {
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      padding: '24px',
      marginBottom: '24px',
      backgroundColor: colors.white,
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: colors.navy,
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.border}`,
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    summaryItem: {
      display: 'flex',
      flexDirection: 'column',
    },
    summaryLabel: {
      fontSize: '12px',
      color: '#666',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      marginBottom: '4px',
    },
    summaryValue: {
      fontSize: '15px',
      fontWeight: 600,
      color: colors.text,
    },
    premiumHighlight: {
      fontSize: '28px',
      fontWeight: 700,
      color: colors.navy,
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    formGridFull: {
      gridColumn: '1 / -1',
    },
    fieldLabel: {
      display: 'block',
      fontSize: '13px',
      fontWeight: 600,
      color: colors.text,
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
    },
    errorMessage: {
      backgroundColor: '#fce8e6',
      border: `1px solid ${colors.error}`,
      color: colors.error,
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '24px',
      fontSize: '14px',
      fontWeight: 500,
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '40px',
    },
    button: (isPrimary, isDisabled) => ({
      padding: '12px 32px',
      fontSize: '15px',
      fontWeight: 600,
      borderRadius: '4px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: isPrimary ? colors.navy : 'transparent',
      color: isPrimary ? colors.white : colors.navy,
      border: isPrimary ? 'none' : `2px solid ${colors.navy}`,
      opacity: isDisabled ? 0.6 : 1,
    }),
    loadingSpinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: `3px solid ${colors.lightGray}`,
      borderTop: `3px solid ${colors.accent}`,
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
    },
  };

  const handleChange = (field) => (e) => {
    setPayment((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBind = async () => {
    await submitBind({ payment });
    // If no error thrown, move to success page
    nextStep();
  };

  const customerName =
    (quoteData.customer?.firstName || '') + ' ' + (quoteData.customer?.lastName || '');

  if (!selectedResponse) {
    return (
      <div style={styles.pageContainer}>
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: colors.lightGray, borderRadius: '4px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, marginBottom: '8px' }}>
            No Quote Selected
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Please go back and select a quote to bind.
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button onClick={prevStep} style={styles.button(false, false)}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <MockDisclaimer />
      <h1 style={styles.title}>Bind Policy</h1>
      <p style={styles.subtitle}>Review policy summary and enter payment details to proceed</p>

      {bindError && <div style={styles.errorMessage}>{bindError}</div>}

      {/* Policy Summary */}
      <div style={styles.sectionBox}>
        <div style={styles.sectionTitle}>Policy Summary</div>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Insurer</span>
            <span style={styles.summaryValue}>{selectedResponse.insurerName}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Quote Number</span>
            <span style={styles.summaryValue}>{selectedResponse.referenceNumber}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Named Insured</span>
            <span style={styles.summaryValue}>{customerName.trim() || 'N/A'}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Effective Date</span>
            <span style={styles.summaryValue}>{selectedResponse.effectiveDate}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Annual Premium</span>
            <span style={styles.premiumHighlight}>
              {formatCurrency(selectedResponse.premiums?.annual)}
            </span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Monthly Premium</span>
            <span style={styles.summaryValue}>
              {formatCurrency(selectedResponse.premiums?.monthly)}/month
            </span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div style={styles.sectionBox}>
        <div style={styles.sectionTitle}>Payment Information</div>
        <div style={styles.formGrid}>
          <div style={styles.formGridFull}>
            <label style={styles.fieldLabel}>Cardholder Name</label>
            <input
              style={styles.input}
              value={payment.cardholderName}
              onChange={handleChange('cardholderName')}
              placeholder="Full name on card"
            />
          </div>
          <div>
            <label style={styles.fieldLabel}>Card Number</label>
            <input
              style={styles.input}
              value={payment.cardNumber}
              onChange={handleChange('cardNumber')}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={styles.fieldLabel}>Expiry Date</label>
              <input
                style={styles.input}
                value={payment.expiryDate}
                onChange={handleChange('expiryDate')}
                placeholder="MM/YY"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.fieldLabel}>CVV</label>
              <input
                style={styles.input}
                value={payment.cvv}
                onChange={handleChange('cvv')}
                placeholder="123"
              />
            </div>
          </div>
          <div style={styles.formGridFull}>
            <label style={styles.fieldLabel}>Billing Address</label>
            <input
              style={styles.input}
              value={payment.billingAddress}
              onChange={handleChange('billingAddress')}
              placeholder="Full billing address"
            />
          </div>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={prevStep}
          style={styles.button(false, false)}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#f0f0f0'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
        >
          Back
        </button>
        <button
          onClick={handleBind}
          disabled={isLoading}
          style={styles.button(true, isLoading)}
          onMouseEnter={(e) => {
            if (!isLoading) e.target.style.boxShadow = '0 4px 12px rgba(42, 82, 152, 0.25)';
          }}
          onMouseLeave={(e) => { e.target.style.boxShadow = 'none'; }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={styles.loadingSpinner} /> Binding...
            </span>
          ) : (
            'Bind Now'
          )}
        </button>
      </div>
    </div>
  );
};

export default BindPage;
