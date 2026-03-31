import React, { useState } from 'react';
import { useHab } from '../../context/HabContext';
import { formatCurrency } from '../../utils/formatters';
import MockDisclaimer from '../../components/MockDisclaimer';

const HabBindPage = () => {
  const { habResponses, selectedInsurerIndex, submitBind, nextStep, prevStep, isLoading, bindError, habData } = useHab();
  const selectedResponse = habResponses?.[selectedInsurerIndex ?? 0];

  const [payment, setPayment] = useState({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '', billingAddress: '' });

  const colors = { navy: '#0a1e3d', accent: '#2a5298', white: '#ffffff', text: '#1a1a1a', lightGray: '#f5f5f5', border: '#d0d0d0', error: '#cf222e' };

  const styles = {
    pageContainer: { maxWidth: '900px', margin: '0 auto', padding: '40px 24px', minHeight: 'calc(100vh - 100px)', backgroundColor: colors.white },
    title: { fontSize: '28px', fontWeight: 700, color: colors.navy, marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: '#666', marginBottom: '32px' },
    sectionBox: { border: `1px solid ${colors.border}`, borderRadius: '4px', padding: '24px', marginBottom: '24px' },
    sectionTitle: { fontSize: '16px', fontWeight: 700, color: colors.navy, marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid ${colors.border}` },
    summaryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    summaryLabel: { fontSize: '12px', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '4px' },
    summaryValue: { fontSize: '15px', fontWeight: 600, color: colors.text },
    premiumHighlight: { fontSize: '28px', fontWeight: 700, color: colors.navy },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    fieldLabel: { display: 'block', fontSize: '13px', fontWeight: 600, color: colors.text, marginBottom: '6px' },
    input: { width: '100%', padding: '10px 12px', fontSize: '14px', border: `1px solid ${colors.border}`, borderRadius: '4px', outline: 'none', boxSizing: 'border-box' },
    errorMessage: { backgroundColor: '#fce8e6', border: `1px solid ${colors.error}`, color: colors.error, padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '14px', fontWeight: 500 },
    buttonContainer: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '40px' },
    button: (isPrimary, isDisabled) => ({
      padding: '12px 32px', fontSize: '15px', fontWeight: 600, borderRadius: '4px',
      cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
      backgroundColor: isPrimary ? colors.navy : 'transparent', color: isPrimary ? colors.white : colors.navy,
      border: isPrimary ? 'none' : `2px solid ${colors.navy}`, opacity: isDisabled ? 0.6 : 1,
    }),
  };

  const handleChange = (field) => (e) => setPayment((p) => ({ ...p, [field]: e.target.value }));
  const handleBind = async () => { await submitBind({ payment }); nextStep(); };
  const customerName = (habData.customer?.firstName || '') + ' ' + (habData.customer?.lastName || '');

  if (!selectedResponse) {
    return (
      <div style={styles.pageContainer}>
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: colors.lightGray, borderRadius: '4px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, marginBottom: '8px' }}>No Quote Selected</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Please go back and select a quote to bind.</div>
        </div>
        <div style={styles.buttonContainer}><button onClick={prevStep} style={styles.button(false, false)}>Back</button></div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <MockDisclaimer />
      <h1 style={styles.title}>Bind Policy</h1>
      <p style={styles.subtitle}>Review policy summary and enter payment details to proceed</p>
      {bindError && <div style={styles.errorMessage}>{bindError}</div>}

      <div style={styles.sectionBox}>
        <div style={styles.sectionTitle}>Policy Summary</div>
        <div style={styles.summaryGrid}>
          <div><span style={styles.summaryLabel}>Insurer</span><div style={styles.summaryValue}>{selectedResponse.insurerName}</div></div>
          <div><span style={styles.summaryLabel}>Quote Number</span><div style={styles.summaryValue}>{selectedResponse.referenceNumber}</div></div>
          <div><span style={styles.summaryLabel}>Named Insured</span><div style={styles.summaryValue}>{customerName.trim() || 'N/A'}</div></div>
          <div><span style={styles.summaryLabel}>Property</span><div style={styles.summaryValue}>{selectedResponse.propertyAddress || 'N/A'}</div></div>
          <div><span style={styles.summaryLabel}>Annual Premium</span><div style={styles.premiumHighlight}>{formatCurrency(selectedResponse.premiums?.annual)}</div></div>
          <div><span style={styles.summaryLabel}>Monthly Premium</span><div style={styles.summaryValue}>{formatCurrency(selectedResponse.premiums?.monthly)}/month</div></div>
        </div>
      </div>

      <div style={styles.sectionBox}>
        <div style={styles.sectionTitle}>Payment Information</div>
        <div style={styles.formGrid}>
          <div style={{ gridColumn: '1 / -1' }}><label style={styles.fieldLabel}>Cardholder Name</label><input style={styles.input} value={payment.cardholderName} onChange={handleChange('cardholderName')} placeholder="Full name on card" /></div>
          <div><label style={styles.fieldLabel}>Card Number</label><input style={styles.input} value={payment.cardNumber} onChange={handleChange('cardNumber')} placeholder="1234 5678 9012 3456" /></div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}><label style={styles.fieldLabel}>Expiry Date</label><input style={styles.input} value={payment.expiryDate} onChange={handleChange('expiryDate')} placeholder="MM/YY" /></div>
            <div style={{ flex: 1 }}><label style={styles.fieldLabel}>CVV</label><input style={styles.input} value={payment.cvv} onChange={handleChange('cvv')} placeholder="123" /></div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}><label style={styles.fieldLabel}>Billing Address</label><input style={styles.input} value={payment.billingAddress} onChange={handleChange('billingAddress')} placeholder="Full billing address" /></div>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={prevStep} style={styles.button(false, false)}>Back</button>
        <button onClick={handleBind} disabled={isLoading} style={styles.button(true, isLoading)}>
          {isLoading ? 'Binding...' : 'Bind Now'}
        </button>
      </div>
    </div>
  );
};

export default HabBindPage;
