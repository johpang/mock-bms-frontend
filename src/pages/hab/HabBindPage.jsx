import React, { useState } from 'react';
import { useHab } from '../../context/HabContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import MockDisclaimer from '../../components/MockDisclaimer';

const HabBindPage = () => {
  const { habResponses, selectedInsurerIndex, submitBind, nextStep, prevStep, isLoading, bindError, habData } = useHab();
  const selectedResponse = habResponses?.[selectedInsurerIndex ?? 0];

  const [billingInfo, setBillingInfo] = useState('direct');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payFrequency, setPayFrequency] = useState('');
  const [eftDetails, setEftDetails] = useState({ bankName: '', transitNumber: '', accountNumber: '' });
  const [validationErrors, setValidationErrors] = useState([]);

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

  const handleEftChange = (field) => (e) => setEftDetails((p) => ({ ...p, [field]: e.target.value }));

  const validateForm = () => {
    const errors = [];
    if (!paymentMethod) errors.push('Please select a billing type');
    if (paymentMethod === 'eft') {
      if (!payFrequency) errors.push('Payment Frequency is required');
      if (!eftDetails.bankName.trim()) errors.push('Bank / Financial Institution is required');
      if (!eftDetails.transitNumber.trim()) errors.push('Transit Number is required');
      if (!eftDetails.accountNumber.trim()) errors.push('Account Number is required');
    }
    return errors;
  };

  const handleBind = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setValidationErrors([]);
    const paymentInfo = { method: paymentMethod };
    if (paymentMethod === 'eft') paymentInfo.eft = eftDetails;
    await submitBind({ payment: paymentInfo });
    nextStep();
  };
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
      {validationErrors.length > 0 && (
        <div style={styles.errorMessage}>
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>Please fix the following errors:</div>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div style={styles.sectionBox}>
        <div style={styles.sectionTitle}>Policy Summary</div>
        <div style={styles.summaryGrid}>
          <div><span style={styles.summaryLabel}>Insurer</span><div style={styles.summaryValue}>{selectedResponse.insurerName}</div></div>
          <div><span style={styles.summaryLabel}>Quote Number</span><div style={styles.summaryValue}>{selectedResponse.referenceNumber}</div></div>
          <div><span style={styles.summaryLabel}>Named Insured</span><div style={styles.summaryValue}>{customerName.trim() || 'N/A'}</div></div>
          <div><span style={styles.summaryLabel}>Property</span><div style={styles.summaryValue}>{selectedResponse.propertyAddress || 'N/A'}</div></div>
          <div><span style={styles.summaryLabel}>Effective Date</span><div style={styles.summaryValue}>{formatDate(habData.effectiveDate) || selectedResponse.effectiveDate || 'N/A'}</div></div>
          <div><span style={styles.summaryLabel}>Annual Premium</span><div style={styles.premiumHighlight}>{formatCurrency(selectedResponse.premiums?.annual)}</div></div>
          <div><span style={styles.summaryLabel}>Monthly Premium</span><div style={styles.summaryValue}>{formatCurrency(selectedResponse.premiums?.monthly)}/month</div></div>
        </div>
      </div>

      <div style={styles.sectionBox}>
        <div style={styles.sectionTitle}>Billing Information</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="radio" name="billingInfo" value="direct" checked={billingInfo === 'direct'} onChange={(e) => setBillingInfo(e.target.value)} style={{ width: '18px', height: '18px', accentColor: colors.navy }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>Direct Billed</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed', opacity: 0.5 }}>
            <input type="radio" name="billingInfo" value="agency" disabled style={{ width: '18px', height: '18px' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>Agency Billed</span>
          </label>
        </div>

        <div style={styles.sectionTitle}>Billing Type</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '4px', cursor: 'pointer', border: `1px solid ${paymentMethod === 'eft' ? colors.accent : colors.border}`, backgroundColor: paymentMethod === 'eft' ? '#f0f4ff' : colors.white, transition: 'all 0.15s ease' }}>
            <input type="radio" name="paymentMethod" value="eft" checked={paymentMethod === 'eft'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: colors.navy }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Pre-Authorized (EFT)</span>
          </label>
          {paymentMethod === 'eft' && (
            <div style={{ marginLeft: '28px', marginBottom: '4px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.fieldLabel}>Payment Frequency</label>
                <select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)} style={{ ...styles.input, cursor: 'pointer' }}>
                  <option value="" disabled>Please Select</option>
                  <option value="1-pay">1-Pay</option>
                  <option value="3-pay">3-Pay</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div style={styles.formGrid}>
                <div style={{ gridColumn: '1 / -1' }}><label style={styles.fieldLabel}>Bank / Financial Institution</label><input style={styles.input} value={eftDetails.bankName} onChange={handleEftChange('bankName')} placeholder="e.g. TD Canada Trust" /></div>
                <div><label style={styles.fieldLabel}>Transit Number</label><input style={styles.input} value={eftDetails.transitNumber} onChange={handleEftChange('transitNumber')} placeholder="5 digits" /></div>
                <div><label style={styles.fieldLabel}>Account Number</label><input style={styles.input} value={eftDetails.accountNumber} onChange={handleEftChange('accountNumber')} placeholder="7-12 digits" /></div>
              </div>
            </div>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '4px', cursor: 'pointer', border: `1px solid ${paymentMethod === 'creditCard' ? colors.accent : colors.border}`, backgroundColor: paymentMethod === 'creditCard' ? '#f0f4ff' : colors.white, transition: 'all 0.15s ease' }}>
            <input type="radio" name="paymentMethod" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: colors.navy }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Credit Card</span>
          </label>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={prevStep} style={styles.button(false, false)}>Back</button>
        <button onClick={handleBind} disabled={isLoading} style={styles.button(true, isLoading)}>
          {isLoading ? 'Binding...' : 'Bind Quote'}
        </button>
      </div>
    </div>
  );
};

export default HabBindPage;
