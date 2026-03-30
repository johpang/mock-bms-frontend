import React from 'react';

/**
 * UnderwritingMessages Component
 * Displays underwriting messages as warning-style alert boxes
 *
 * @component
 * @param {Array<string>} messages - Array of underwriting message strings
 * @returns {React.ReactElement} The underwriting messages component
 */
const UnderwritingMessages = ({ messages }) => {
  const colors = {
    navy: '#0a1e3d',
    accent: '#2a5298',
    warning: '#d4a017',
    warningBg: '#fffbf0',
    text: '#1a1a1a',
  };

  const styles = {
    wrapper: {
      width: '100%',
    },
    title: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.navy,
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${colors.accent}`,
    },
    messagesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    messageBox: {
      display: 'flex',
      gap: '12px',
      padding: '12px 16px',
      backgroundColor: colors.warningBg,
      borderLeft: `4px solid ${colors.warning}`,
      borderRadius: '2px',
      borderTop: `1px solid ${colors.warning}`,
      borderRight: `1px solid ${colors.warning}`,
      borderBottom: `1px solid ${colors.warning}`,
    },
    messageBullet: {
      color: colors.warning,
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '20px',
      minWidth: '12px',
      flexShrink: 0,
    },
    messageText: {
      fontSize: '14px',
      color: colors.text,
      fontWeight: 500,
      lineHeight: '1.5',
    },
    emptyMessage: {
      padding: '24px',
      textAlign: 'center',
      color: '#666',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      border: `1px solid ${colors.warning}20`,
    },
  };

  if (!messages || messages.length === 0) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.title}>Underwriting Messages</div>
        <div style={styles.emptyMessage}>No underwriting messages</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>Underwriting Messages</div>
      <div style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div key={index} style={styles.messageBox}>
            <span style={styles.messageBullet}>-</span>
            <span style={styles.messageText}>{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnderwritingMessages;
