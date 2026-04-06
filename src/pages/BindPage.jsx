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

  const [paymentMethod, setPaymentMethod] = useState('');
  const [eftDetails, setEftDetails] = useState({
    bankName: '',
    transitNumber: '',
    accountNumber: '',
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

  const handleEftChange = (field) => (e) => {
    setEftDetails((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBind = async () => {
    const paymentInfo = { method: paymentMethod };
    if (paymentMethod === 'eft') paymentInfo.eft = eftDetails;
    await submitBind({ payment: paymentInfo });
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

      {/* Payment Method */}
      <div style={styles.sectionBox}>
        <div style={styles.sectionTitle}>Payment Method</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { value: 'eft', label: 'Pre-Authorized Debit (EFT)' },
            { value: 'creditCard', label: 'Credit Card' },
            { value: 'brokerCollected', label: 'Broker Collected' },
          ].map((opt) => (
            <label
              key={opt.value}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '4px', cursor: 'pointer',
                border: `1px solid ${paymentMethod === opt.value ? colors.accent : colors.border}`,
                backgroundColor: paymentMethod === opt.value ? '#f0f4ff' : colors.white,
                transition: 'all 0.15s ease',
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={paymentMethod === opt.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ accentColor: colors.navy }}
              />
              <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{opt.label}</span>
            </label>
          ))}
        </div>

        {paymentMethod === 'eft' && (
          <div style={{ ...styles.formGrid, marginTop: '20px' }}>
            <div style={styles.formGridFull}>
              <label style={styles.fieldLabel}>Bank / Financial Institution</label>
              <input
                style={styles.input}
                value={eftDetails.bankName}
                onChange={handleEftChange('bankName')}
                placeholder="e.g. TD Canada Trust"
              />
            </div>
            <div>
              <label style={styles.fieldLabel}>Transit Number</label>
              <input
                style={styles.input}
                value={eftDetails.transitNumber}
                onChange={handleEftChange('transitNumber')}
                placeholder="5 digits"
              />
            </div>
            <div>
              <label style={styles.fieldLabel}>Account Number</label>
              <input
                style={styles.input}
                value={eftDetails.accountNumber}
                onChange={handleEftChange('accountNumber')}
                placeholder="7-12 digits"
              />
            </div>
          </div>
        )}
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
