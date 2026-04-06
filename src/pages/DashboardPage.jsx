/**
 * DashboardPage Component
 * Unified home screen showing both Personal Lines Auto and Habitational
 * saved quotes in separate sections, each with their own "New Quote" button.
 */

import React from 'react';
import savedAutoQuotes from '../data/autoQuotes';
import savedHabQuotes from '../data/habQuotes';
import savedCommlQuotes from '../data/commlQuotes';

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
  },
  pageHeader: {
    maxWidth: '1000px',
    margin: '0 auto 2rem auto',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#0a1e3d',
    margin: '0 0 0.25rem 0',
  },
  pageSubtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  section: {
    maxWidth: '1000px',
    margin: '0 auto 2.5rem auto',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0a1e3d',
    margin: 0,
  },
  newQuoteBtn: {
    padding: '0.6rem 1.25rem',
    fontSize: '0.85rem',
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
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  tableSubHeader: {
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    padding: '2rem',
    color: '#999',
    fontSize: '0.9rem',
  },
};

/**
 * Renders a quote table for a given line of business.
 */
function QuoteTable({ quotes, columns, onOpen, hoveredRow, setHoveredRow, rowOffset }) {
  if (quotes.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>No saved quotes yet. Click "+ New Quote" to get started.</p>
      </div>
    );
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={styles.th}>{col.label}</th>
          ))}
          <th style={styles.th}></th>
        </tr>
      </thead>
      <tbody>
        {quotes.map((quote, idx) => {
          const globalIdx = rowOffset + idx;
          return (
            <tr
              key={quote.id}
              style={{
                ...styles.tr,
                backgroundColor: hoveredRow === globalIdx ? '#f5f7fa' : 'transparent',
              }}
              onMouseEnter={() => setHoveredRow(globalIdx)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => onOpen(quote)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    ...styles.td,
                    ...(col.key === 'id' ? styles.idCell : {}),
                  }}
                >
                  {col.key === 'status' ? (
                    <span style={styles.statusBadge(quote.status)}>{quote.status}</span>
                  ) : (
                    col.render ? col.render(quote) : quote[col.key] || '—'
                  )}
                </td>
              ))}
              <td style={styles.td}>
                <button
                  style={styles.openBtn}
                  onClick={(e) => { e.stopPropagation(); onOpen(quote); }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#0a1e3d'; e.target.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#0a1e3d'; }}
                >
                  Open
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const autoColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Description' },
  { key: 'customer', label: 'Customer', render: (q) => `${q.customer?.firstName || ''} ${q.customer?.lastName || ''}`.trim() || '—' },
  { key: 'vehicle', label: 'Vehicle', render: (q) => { const v = q.vehicles?.[0]; return v ? `${v.year} ${v.make} ${v.model}` : '—'; } },
  { key: 'status', label: 'Status' },
  { key: 'createdDate', label: 'Created' },
];

const habColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Description' },
  { key: 'customer', label: 'Customer', render: (q) => `${q.customer?.firstName || ''} ${q.customer?.lastName || ''}`.trim() || '—' },
  { key: 'riskType', label: 'Risk Type' },
  { key: 'status', label: 'Status' },
  { key: 'createdDate', label: 'Created' },
];

const commlColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Description' },
  { key: 'businessName', label: 'Business', render: (q) => q.account?.commercialName || q.account?.dbaName || '—' },
  { key: 'ibcCode', label: 'IBC Code', render: (q) => q.business?.operations?.[0]?.ibcCode || '—' },
  { key: 'status', label: 'Status' },
  { key: 'createdDate', label: 'Created' },
];

const DashboardPage = ({ onNewAutoQuote, onOpenAutoQuote, onNewHabQuote, onOpenHabQuote, onNewCommlQuote, onOpenCommlQuote }) => {
  const [hoveredRow, setHoveredRow] = React.useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Broker Management System</h1>
        <p style={styles.pageSubtitle}>Quote Workflow Dashboard</p>
      </div>

      {/* Personal Lines Auto section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Personal Lines Automobile</h2>
          <button
            style={styles.newQuoteBtn}
            onClick={onNewAutoQuote}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#081a32')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#0a1e3d')}
          >
            + New Quote
          </button>
        </div>
        <div style={styles.tableCard}>
          <div style={styles.tableSubHeader}>
            <span style={styles.quoteCount}>
              {savedAutoQuotes.length} quote{savedAutoQuotes.length !== 1 ? 's' : ''}
            </span>
          </div>
          <QuoteTable
            quotes={savedAutoQuotes}
            columns={autoColumns}
            onOpen={onOpenAutoQuote}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            rowOffset={0}
          />
        </div>
      </div>

      {/* Habitational section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Habitational</h2>
          <button
            style={styles.newQuoteBtn}
            onClick={onNewHabQuote}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#081a32')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#0a1e3d')}
          >
            + New Quote
          </button>
        </div>
        <div style={styles.tableCard}>
          <div style={styles.tableSubHeader}>
            <span style={styles.quoteCount}>
              {savedHabQuotes.length} quote{savedHabQuotes.length !== 1 ? 's' : ''}
            </span>
          </div>
          <QuoteTable
            quotes={savedHabQuotes}
            columns={habColumns}
            onOpen={onOpenHabQuote}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            rowOffset={1000}
          />
        </div>
      </div>

      {/* Small Commercial Lines section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Small Commercial Lines</h2>
          <button
            style={styles.newQuoteBtn}
            onClick={onNewCommlQuote}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#081a32')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#0a1e3d')}
          >
            + New Quote
          </button>
        </div>
        <div style={styles.tableCard}>
          <div style={styles.tableSubHeader}>
            <span style={styles.quoteCount}>
              {savedCommlQuotes.length} quote{savedCommlQuotes.length !== 1 ? 's' : ''}
            </span>
          </div>
          <QuoteTable
            quotes={savedCommlQuotes}
            columns={commlColumns}
            onOpen={onOpenCommlQuote}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            rowOffset={2000}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
