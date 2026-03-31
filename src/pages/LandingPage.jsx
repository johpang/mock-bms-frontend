/**
 * LandingPage Component
 * Welcome screen showing existing saved quotes in a table
 * and a button to start a new quote from scratch.
 *
 * @component
 * @returns {JSX.Element} The landing page with quotes table and new-quote button
 */

import React from 'react';
import { useAutoQuote } from '../context/AutoContext';
import savedQuotes from '../data/autoQuotes';

const LandingPage = () => {
  const { nextStep, loadQuote } = useAutoQuote();

  const handleLoadQuote = (quote) => {
    loadQuote(quote);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    },
    header: {
      maxWidth: '1000px',
      margin: '0 auto 2rem auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleBlock: {},
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#0a1e3d',
      margin: '0 0 0.25rem 0',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#666',
      margin: 0,
    },
    newQuoteBtn: {
      padding: '0.75rem 1.5rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#0a1e3d',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      fontFamily: 'inherit',
    },
    tableCard: {
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
    },
    tableHeader: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tableTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#0a1e3d',
      margin: 0,
    },
    quoteCount: {
      fontSize: '0.85rem',
      color: '#888',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '0.75rem 1.5rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#888',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '1px solid #e9ecef',
      backgroundColor: '#fafbfc',
    },
    td: {
      padding: '0.85rem 1.5rem',
      fontSize: '0.9rem',
      color: '#333',
      borderBottom: '1px solid #f0f0f0',
    },
    tr: {
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
    },
    idCell: {
      fontWeight: '600',
      color: '#0a1e3d',
    },
    statusBadge: (status) => ({
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '600',
      backgroundColor: status === 'Quoted' ? '#e8f5e9' : '#fff3e0',
      color: status === 'Quoted' ? '#2e7d32' : '#e65100',
    }),
    openBtn: {
      padding: '0.35rem 0.8rem',
      fontSize: '0.8rem',
      fontWeight: '500',
      color: '#0a1e3d',
      backgroundColor: 'transparent',
      border: '1.5px solid #0a1e3d',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      fontFamily: 'inherit',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#999',
    },
  };

  const [hoveredRow, setHoveredRow] = React.useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>Personal Lines Automobile</h1>
          <p style={styles.subtitle}>Quote Workflow Dashboard</p>
        </div>
        <button
          style={styles.newQuoteBtn}
          onClick={nextStep}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#081a32')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#0a1e3d')}
        >
          + New Quote
        </button>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>Saved Quotes</h2>
          <span style={styles.quoteCount}>{savedQuotes.length} quote{savedQuotes.length !== 1 ? 's' : ''}</span>
        </div>
        {savedQuotes.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No saved quotes yet. Click "+ New Quote" to get started.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {savedQuotes.map((quote, idx) => {
                const vehicle = quote.vehicles?.[0];
                const vehicleLabel = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : '—';
                const customerLabel = `${quote.customer?.firstName || ''} ${quote.customer?.lastName || ''}`.trim() || '—';
                return (
                  <tr
                    key={quote.id}
                    style={{
                      ...styles.tr,
                      backgroundColor: hoveredRow === idx ? '#f5f7fa' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => handleLoadQuote(quote)}
                  >
                    <td style={{ ...styles.td, ...styles.idCell }}>{quote.id}</td>
                    <td style={styles.td}>{quote.name}</td>
                    <td style={styles.td}>{customerLabel}</td>
                    <td style={styles.td}>{vehicleLabel}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(quote.status)}>{quote.status}</span>
                    </td>
                    <td style={styles.td}>{quote.createdDate}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.openBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadQuote(quote);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#0a1e3d';
                          e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#0a1e3d';
                        }}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
