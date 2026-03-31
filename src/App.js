/**
 * App.js - Root application component
 *
 * Unified dashboard showing both Auto and Habitational saved quotes.
 * Clicking into a quote or starting a new one launches the respective
 * wizard. Each line has its own context, steps, and page components.
 * Clicking "BMS" in the top bar returns to the dashboard.
 */
import React, { useState, useCallback } from 'react';
import { AutoProvider, useAutoQuote } from './context/AutoContext';
import { HabProvider, useHab } from './context/HabContext';
import { Footer, StepIndicator } from './components/Layout';

// Dashboard
import DashboardPage from './pages/DashboardPage';

// Auto page imports
import QuoteFormPage1 from './pages/QuoteFormPage1';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import QuoteFormPage2 from './pages/QuoteFormPage2';
import InsurerSelectionPage from './pages/InsurerSelectionPage';
import QuoteComparisonPage from './pages/QuoteComparisonPage';
import PremiumBreakdownPage from './pages/PremiumBreakdownPage';
import BindPage from './pages/BindPage';
import BindSuccessPage from './pages/BindSuccessPage';

// Habitational page imports
import HabQuoteFormPage1 from './pages/hab/HabQuoteFormPage1';
import HabQuoteFormPage2 from './pages/hab/HabQuoteFormPage2';
import HabQuoteFormPage3 from './pages/hab/HabQuoteFormPage3';
import HabCoveragePage from './pages/hab/HabCoveragePage';
import HabInsurerSelectionPage from './pages/hab/HabInsurerSelectionPage';
import HabQuoteComparisonPage from './pages/hab/HabQuoteComparisonPage';
import HabPremiumBreakdownPage from './pages/hab/HabPremiumBreakdownPage';
import HabBindPage from './pages/hab/HabBindPage';
import HabBindSuccessPage from './pages/hab/HabBindSuccessPage';

// Auto steps (step 1 = Quote Details, no landing page)
const AUTO_LABELS = [
  'Quote Details', 'Vehicle Details', 'Driver & History',
  'Select Insurers', 'Compare Quotes', 'Premium Breakdown',
  'Bind Policy', 'Confirmation',
];
const AUTO_COMPONENTS = [
  QuoteFormPage1, VehicleDetailsPage, QuoteFormPage2,
  InsurerSelectionPage, QuoteComparisonPage, PremiumBreakdownPage,
  BindPage, BindSuccessPage,
];

// Hab steps (step 1 = Quote Details, no landing page)
const HAB_LABELS = [
  'Quote Details', 'Risk & Building', 'Pool & Liability',
  'Coverages', 'Select Insurers', 'Compare Quotes', 'Premium Breakdown',
  'Bind Policy', 'Confirmation',
];
const HAB_COMPONENTS = [
  HabQuoteFormPage1, HabQuoteFormPage2, HabQuoteFormPage3,
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
  dashboardWrapper: {
    flex: 1, paddingTop: '60px', paddingBottom: '60px',
  },
  topBar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    display: 'flex', alignItems: 'center',
    height: '60px',
    backgroundColor: '#0a1e3d',
    padding: '0 24px',
  },
  brandLink: {
    color: '#ffffff', fontSize: '16px', fontWeight: 700, letterSpacing: '1px',
    cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit',
    padding: 0,
  },
  lineLabel: {
    color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 500,
    marginLeft: '24px', letterSpacing: '0.3px',
  },
};

// -- Auto wizard content (rendered inside AutoProvider) --
function AutoContent({ onGoHome }) {
  const { currentStep } = useAutoQuote();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // currentStep is 1-based from context; map to 0-based component index
  const componentIndex = currentStep - 1;
  const CurrentPage = AUTO_COMPONENTS[componentIndex] || AUTO_COMPONENTS[0];

  return (
    <>
      <div style={styles.topBar}>
        <button style={styles.brandLink} onClick={onGoHome}>BMS</button>
        <span style={styles.lineLabel}>Personal Lines Auto</span>
      </div>
      <main style={styles.mainContent}>
        <div style={styles.stepIndicatorWrapper}>
          <StepIndicator steps={AUTO_LABELS} currentStep={componentIndex} />
        </div>
        <div style={styles.pageWrapper}><CurrentPage /></div>
      </main>
    </>
  );
}

// -- Hab wizard content (rendered inside HabProvider) --
function HabContent({ onGoHome }) {
  const { currentStep } = useHab();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const componentIndex = currentStep - 1;
  const CurrentPage = HAB_COMPONENTS[componentIndex] || HAB_COMPONENTS[0];

  return (
    <>
      <div style={styles.topBar}>
        <button style={styles.brandLink} onClick={onGoHome}>BMS</button>
        <span style={styles.lineLabel}>Habitational</span>
      </div>
      <main style={styles.mainContent}>
        <div style={styles.stepIndicatorWrapper}>
          <StepIndicator steps={HAB_LABELS} currentStep={componentIndex} />
        </div>
        <div style={styles.pageWrapper}><CurrentPage /></div>
      </main>
    </>
  );
}

// -- Root App --
function App() {
  // null = dashboard, 'auto' = auto wizard, 'hab' = hab wizard
  const [activeLine, setActiveLine] = useState(null);
  // Pending action to run after provider mounts
  const [pendingAction, setPendingAction] = useState(null);

  const goHome = useCallback(() => {
    setActiveLine(null);
    setPendingAction(null);
  }, []);

  const handleNewAutoQuote = useCallback(() => {
    setPendingAction({ type: 'new' });
    setActiveLine('auto');
  }, []);

  const handleOpenAutoQuote = useCallback((quote) => {
    setPendingAction({ type: 'load', quote });
    setActiveLine('auto');
  }, []);

  const handleNewHabQuote = useCallback(() => {
    setPendingAction({ type: 'new' });
    setActiveLine('hab');
  }, []);

  const handleOpenHabQuote = useCallback((quote) => {
    setPendingAction({ type: 'load', quote });
    setActiveLine('hab');
  }, []);

  if (activeLine === 'auto') {
    return (
      <div style={styles.appContainer}>
        <AutoProvider>
          <AutoWizardBridge pendingAction={pendingAction} onActionConsumed={() => setPendingAction(null)} />
          <AutoContent onGoHome={goHome} />
        </AutoProvider>
        <Footer />
      </div>
    );
  }

  if (activeLine === 'hab') {
    return (
      <div style={styles.appContainer}>
        <HabProvider>
          <HabWizardBridge pendingAction={pendingAction} onActionConsumed={() => setPendingAction(null)} />
          <HabContent onGoHome={goHome} />
        </HabProvider>
        <Footer />
      </div>
    );
  }

  // Dashboard
  return (
    <div style={styles.appContainer}>
      <div style={styles.topBar}>
        <button style={styles.brandLink} onClick={goHome}>BMS</button>
      </div>
      <div style={styles.dashboardWrapper}>
        <DashboardPage
          onNewAutoQuote={handleNewAutoQuote}
          onOpenAutoQuote={handleOpenAutoQuote}
          onNewHabQuote={handleNewHabQuote}
          onOpenHabQuote={handleOpenHabQuote}
        />
      </div>
      <Footer />
    </div>
  );
}

/**
 * Bridge component that runs inside AutoProvider to execute the pending action
 * (new quote or load quote) on mount.
 */
function AutoWizardBridge({ pendingAction, onActionConsumed }) {
  const { goToStep, loadQuote } = useAutoQuote();

  React.useEffect(() => {
    if (!pendingAction) return;
    if (pendingAction.type === 'new') {
      goToStep(1); // Step 1 = Quote Details
    } else if (pendingAction.type === 'load') {
      loadQuote(pendingAction.quote);
    }
    onActionConsumed();
  }, []); // Run once on mount

  return null;
}

/**
 * Bridge component that runs inside HabProvider to execute the pending action
 * (new quote or load quote) on mount.
 */
function HabWizardBridge({ pendingAction, onActionConsumed }) {
  const { goToStep, loadQuote } = useHab();

  React.useEffect(() => {
    if (!pendingAction) return;
    if (pendingAction.type === 'new') {
      goToStep(1); // Step 1 = Quote Details
    } else if (pendingAction.type === 'load') {
      loadQuote(pendingAction.quote);
    }
    onActionConsumed();
  }, []); // Run once on mount

  return null;
}

export default App;
