/**
 * App.js - Root application component
 *
 * Manages the multi-step quote wizard using QuoteContext.
 * Renders the appropriate page based on currentStep and wraps
 * everything in the shared Layout (Header, StepIndicator, Footer).
 */
import React from 'react';
import { QuoteProvider, useQuote } from './context/QuoteContext';
import { Header, Footer, StepIndicator } from './components/Layout';

// Page imports
import LandingPage from './pages/LandingPage';
import QuoteFormPage1 from './pages/QuoteFormPage1';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import QuoteFormPage2 from './pages/QuoteFormPage2';
import InsurerSelectionPage from './pages/InsurerSelectionPage';
import QuoteComparisonPage from './pages/QuoteComparisonPage';
import PremiumBreakdownPage from './pages/PremiumBreakdownPage';

/**
 * Step labels displayed in the StepIndicator breadcrumb.
 * Index matches currentStep in QuoteContext.
 */
const STEP_LABELS = [
  'Start',
  'Quote Details',
  'Vehicle Details',
  'Driver & History',
  'Select Insurers',
  'Compare Quotes',
  'Premium Breakdown',
];

/**
 * Maps step index to the corresponding page component.
 */
const STEP_COMPONENTS = [
  LandingPage,           // Step 0
  QuoteFormPage1,        // Step 1
  VehicleDetailsPage,    // Step 2
  QuoteFormPage2,        // Step 3
  InsurerSelectionPage,  // Step 4
  QuoteComparisonPage,   // Step 5
  PremiumBreakdownPage,  // Step 6
];

/** Layout styles */
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg, #f5f7fa)',
  },
  mainContent: {
    flex: 1,
    paddingTop: '60px',   // Account for fixed header (60px height)
    paddingBottom: '60px', // Account for fixed footer
    display: 'flex',
    flexDirection: 'column',
  },
  stepIndicatorWrapper: {
    position: 'sticky',
    top: '60px',        // Sits right below the fixed header (60px height)
    zIndex: 90,
    backgroundColor: 'var(--color-white, #ffffff)',
    borderBottom: '1px solid var(--color-border, #d0d7de)',
    padding: '0px 24px',
  },
  pageWrapper: {
    flex: 1,
    maxWidth: '960px',
    width: '100%',
    margin: '0 auto',
    padding: '24px',
  },
};

/**
 * Inner app component that consumes QuoteContext.
 * Separated from App so it can use the useQuote hook.
 */
function AppContent() {
  const { currentStep } = useQuote();

  // Smooth-scroll to top whenever the step changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Get the component for the current step
  const CurrentPage = STEP_COMPONENTS[currentStep] || LandingPage;

  return (
    <div style={styles.appContainer}>
      <Header />

      <main style={styles.mainContent}>
        {/* Step indicator — hidden on landing page */}
        {currentStep > 0 && (
          <div style={styles.stepIndicatorWrapper}>
            <StepIndicator
              steps={STEP_LABELS}
              currentStep={currentStep}
            />
          </div>
        )}

        {/* Current page content */}
        <div style={styles.pageWrapper}>
          <CurrentPage />
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Root App component — wraps everything in the QuoteProvider context.
 */
function App() {
  return (
    <QuoteProvider>
      <AppContent />
    </QuoteProvider>
  );
}

export default App;
