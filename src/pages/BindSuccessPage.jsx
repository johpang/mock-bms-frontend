import React from 'react';
import { useAutoQuote } from '../context/AutoContext';
import { formatCurrency, formatDate, linkifyText } from '../utils/formatters';
import MockDisclaimer from '../components/MockDisclaimer';

/**
 * BindSuccessPage Component
 * Screen 8 - Confirmation that the policy has been successfully bound
 */
const BindSuccessPage = () => {
  const { bindResponse, quoteResponses, selectedInsurerIndex, goHome, quoteData } = useAutoQuote();

  const selectedResponse = quoteResponses?.[selectedInsurerIndex ?? 0];

  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    white: '#ffffff',
    text: '#1a1a1a',
    lightGray: '#f5f5f5',
    border: '#d0d0d0',
    success: '#1a7f37',
    successBg: '#dafbe1',
    successBorder: '#aceebb',
  };

  const styles = {
    pageContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 24px',
      minHeight: 'calc(100vh - 100px)',
      backgroundColor: colors.white,
    },
    successBanner: {
      backgroundColor: colors.successBg,
      border: `2px solid ${colors.successBorder}`,
      borderRadius: '4px',
      padding: '32px',
      textAlign: 'center',
      marginBottom: '32px',
    },
    checkmark: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: colors.success,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
    },
    checkmarkSvg: {
      width: '32px',
      height: '32px',
      fill: 'none',
      stroke: colors.white,
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    successTitle: {
      fontSize: '28px',
      fontWeight: 700,
      color: colors.success,
      marginBottom: '8px',
    },
    successSubtitle: {
      fontSize: '15px',
      color: colors.text,
    },
    detailsBox: {
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      padding: '24px',
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: colors.navy,
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.border}`,
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    detailLabel: {
      fontSize: '12px',
      color: '#666',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      marginBottom: '4px',
    },
    detailValue: {
      fontSize: '15px',
      fontWeight: 600,
      color: colors.text,
    },
    policyNumber: {
      fontSize: '24px',
      fontWeight: 700,
      color: colors.navy,
      letterSpacing: '1px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginTop: '40px',
    },
    button: {
      padding: '12px 32px',
      fontSize: '15px',
      fontWeight: 600,
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: colors.navy,
      color: colors.white,
      border: 'none',
    },
  };

  const customerName =
    (quoteData.customer?.firstName || '') + ' ' + (quoteData.customer?.lastName || '');

  return (
    <div style={styles.pageContainer}>
      <MockDisclaimer />

      {/* Success Banner */}
      <div style={styles.successBanner}>
        <div style={styles.checkmark}>
          <svg style={styles.checkmarkSvg} viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style={styles.successTitle}>Policy Bound Successfully</div>
        <div style={styles.successSubtitle}>
          {bindResponse?.message || 'The policy has been bound and is now active.'}
        </div>
      </div>

      {/* Policy Details */}
      <div style={styles.detailsBox}>
        <div style={styles.sectionTitle}>Policy Details</div>
        <div style={styles.detailsGrid}>
          <div>
            <div style={styles.detailLabel}>Policy Number</div>
            <div style={styles.policyNumber}>
              {bindResponse?.policyNumber || 'N/A'}
            </div>
          </div>
          <div>
            <div style={styles.detailLabel}>Quote Number</div>
            <div style={styles.detailValue}>
              {bindResponse?.quoteNumber || selectedResponse?.referenceNumber || 'N/A'}
            </div>
          </div>
          <div>
            <div style={styles.detailLabel}>Insurer</div>
            <div style={styles.detailValue}>{selectedResponse?.insurerName || 'N/A'}</div>
          </div>
          <div>
            <div style={styles.detailLabel}>Named Insured</div>
            <div style={styles.detailValue}>{customerName.trim() || 'N/A'}</div>
          </div>
          <div>
            <div style={styles.detailLabel}>Annual Premium</div>
            <div style={styles.detailValue}>
              {formatCurrency(selectedResponse?.premiums?.annual)}
            </div>
          </div>
          <div>
            <div style={styles.detailLabel}>Bind Date</div>
            <div style={styles.detailValue}>
              {bindResponse?.bindTimestamp
                ? new Date(bindResponse.bindTimestamp).toLocaleDateString('en-CA')
                : new Date().toLocaleDateString('en-CA')}
            </div>
          </div>
          <div>
            <div style={styles.detailLabel}>Status</div>
            <div style={{ ...styles.detailValue, color: colors.success }}>
              {bindResponse?.status || 'BOUND'}
            </div>
          </div>
          <div>
            <div style={styles.detailLabel}>Effective Date</div>
            <div style={styles.detailValue}>{formatDate(quoteData.policyEffectiveDate) || selectedResponse?.effectiveDate || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Bind Messages */}
      {bindResponse?.bindMessages?.length > 0 && (
        <div style={{
          border: `1px solid #d4a017`,
          borderRadius: '4px',
          padding: '24px',
          marginBottom: '24px',
          backgroundColor: '#fffbf0',
        }}>
          <div style={{
            fontSize: '16px', fontWeight: 700, color: colors.navy,
            marginBottom: '16px', paddingBottom: '8px',
            borderBottom: `1px solid #d4a017`,
          }}>
            Bind Messages
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bindResponse.bindMessages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', gap: '12px', padding: '12px 16px',
                backgroundColor: '#ffffff', borderLeft: '4px solid #d4a017',
                borderRadius: '2px', border: '1px solid #d4a017',
                borderLeftWidth: '4px',
              }}>
                <span style={{ color: '#d4a017', fontWeight: 700, fontSize: '16px', lineHeight: '20px', minWidth: '12px', flexShrink: 0 }}>!</span>
                <span style={{ fontSize: '14px', color: colors.text, fontWeight: 500, lineHeight: '1.5' }}>{linkifyText(msg)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button
          onClick={goHome}
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(42, 82, 152, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BindSuccessPage;
