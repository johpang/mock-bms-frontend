/**
 * App.js - Root application component
 *
 * Top-level line selector (Auto / Habitational) that renders
 * the appropriate wizard. Each line has its own context, steps,
 * and page components.
 */
import React, { useState } from 'react';
import { AutoProvider, useAutoQuote } from './context/AutoContext';
import { HabProvider, useHab } from './context/HabContext';
import { Header, Footer, StepIndicator } from './components/Layout';

// ── Auto page imports ──
import LandingPage from './pages/LandingPage';
import QuoteFormPage1 from './pages/QuoteFormPage1';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import QuoteFormPage2 from './pages/QuoteFormPage2';
import InsurerSelectionPage from './pages/InsurerSelectionPage';
import QuoteComparisonPage from './pages/QuoteComparisonPage';
import PremiumBreakdownPage from './pages/PremiumBreakdownPage';
import BindPage from './pages/BindPage';
import BindSuccessPage from './pages/BindSuccessPage';

// ── Habitational page imports ──
import HabLandingPage from './pages/hab/HabLandingPage';
import HabQuoteFormPage1 from './pages/hab/HabQuoteFormPage1';
import HabQuoteFormPage2 from './pages/hab/HabQuoteFormPage2';
import HabQuoteFormPage3 from './pages/hab/HabQuoteFormPage3';
import HabCoveragePage from './pages/hab/HabCoveragePage';
import HabInsurerSelectionPage from './pages/hab/HabInsurerSelectionPage';
import HabQuoteComparisonPage from './pages/hab/HabQuoteComparisonPage';
import HabPremiumBreakdownPage from './pages/hab/HabPremiumBreakdownPage';
import HabBindPage from './pages/hab/HabBindPage';
import HabBindSuccessPage from './pages/hab/HabBindSuccessPage';

// ── Auto steps ──
const AUTO_LABELS = [
  'Start', 'Quote Details', 'Vehicle Details', 'Driver & History',
  'Select Insurers', 'Compare Quotes', 'Premium Breakdown',
  'Bind Policy', 'Confirmation',
];
const AUTO_COMPONENTS = [
  LandingPage, QuoteFormPage1, VehicleDetailsPage, QuoteFormPage2,
  InsurerSelectionPage, QuoteComparisonPage, PremiumBreakdownPage,
  BindPage, BindSuccessPage,
];

// ── Hab steps ──
const HAB_LABELS = [
  'Start', 'Quote Details', 'Risk & Building', 'Pool & Liability',
  'Coverages', 'Select Insurers', 'Compare Quotes', 'Premium Breakdown',
  'Bind Policy', 'Confirmation',
];
const HAB_COMPONENTS = [
  HabLandingPage, HabQuoteFormPage1, HabQuoteFormPage2, HabQuoteFormPage3,
  HabCoveragePage, HabInsurerSelectionPage, HabQuoteComparisonPage,
  HabPremiumBreakdownPage, HabBindPage, HabBindSuccessPage,
];

/** Layout styles */
const styles = {
  appContainer: {
    display: 'flex', flexDirection: 'column', minHeight: '100vh',
    backgroundColor: 'var(--color-bg, #f5f7fa)',
  },
  mainContent: {
    flex: 1, paddingTop: '60px', paddingBottom: '60px',
    display: 'flex', flexDirection: 'column',
  },
  stepIndicatorWrapper: {
    position: 'sticky', top: '60px', zIndex: 90,
    backgroundColor: 'var(--color-white, #ffffff)',
    borderBottom: '1px solid var(--color-border, #d0d7de)',
    padding: '0px 24px',
  },
  pageWrapper: {
    flex: 1, maxWidth: '960px', width: '100%',
    margin: '0 auto', padding: '24px',
  },
  // Line selector
  lineSelectorBar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '0', height: '60px',
    backgroundColor: '#0a1e3d',
  },
  lineTab: (isActive) => ({
    padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center',
    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
    backgroundColor: isActive ? '#162d50' : 'transparent',
    borderBottom: isActive ? '3px solid #4a90d9' : '3px solid transparent',
    transition: 'all 0.2s ease', letterSpacing: '0.3px',
    border: 'none', fontFamily: 'inherit',
  }),
  brandLeft: {
    position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)',
    color: '#ffffff', fontSize: '16px', fontWeight: 700, letterSpacing: '1px',
  },
};

// ── Auto wizard content ──
function AutoContent() {
  const { currentStep } = useAutoQuote();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const CurrentPage = AUTO_COMPONENTS[currentStep] || LandingPage;

  return (
    <main style={styles.mainContent}>
      {currentStep > 0 && (
        <div style={styles.stepIndicatorWrapper}>
          <StepIndicator steps={AUTO_LABELS} currentStep={currentStep} />
        </div>
      )}
      <div style={styles.pageWrapper}><CurrentPage /></div>
    </main>
  );
}

// ── Hab wizard content ──
function HabContent() {
  const { currentStep } = useHab();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const CurrentPage = HAB_COMPONENTS[currentStep] || HabLandingPage;

  return (
    <main style={styles.mainContent}>
      {currentStep > 0 && (
        <div style={styles.stepIndicatorWrapper}>
          <StepIndicator steps={HAB_LABELS} currentStep={currentStep} />
        </div>
      )}
      <div style={styles.pageWrapper}><CurrentPage /></div>
    </main>
  );
}

// ── Root App ──
function App() {
  const [activeLine, setActiveLine] = useState('auto');

  return (
    <div style={styles.appContainer}>
      {/* Top bar with line tabs */}
      <div style={styles.lineSelectorBar}>
        <span style={styles.brandLeft}>BMS</span>
        <button
          style={styles.lineTab(activeLine === 'auto')}
          onClick={() => setActiveLine('auto')}
          onMouseEnter={(e) => { if (activeLine !== 'auto') e.target.style.color = 'rgba(255,255,255,0.85)'; }}
          onMouseLeave={(e) => { if (activeLine !== 'auto') e.target.style.color = 'rgba(255,255,255,0.55)'; }}
        >
          Personal Lines Auto
        </button>
        <button
          style={styles.lineTab(activeLine === 'hab')}
          onClick={() => setActiveLine('hab')}
          onMouseEnter={(e) => { if (activeLine !== 'hab') e.target.style.color = 'rgba(255,255,255,0.85)'; }}
          onMouseLeave={(e) => { if (activeLine !== 'hab') e.target.style.color = 'rgba(255,255,255,0.55)'; }}
        >
          Habitational
        </button>
      </div>

      {activeLine === 'auto' ? (
        <AutoProvider>
          <AutoContent />
        </AutoProvider>
      ) : (
        <HabProvider>
          <HabContent />
        </HabProvider>
      )}

      <Footer />
    </div>
  );
}

export default App;
