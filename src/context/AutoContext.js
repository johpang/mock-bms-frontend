/**
 * Auto Quote Context
 * Provides auto insurance quote data state management and functions
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { initialQuoteData } from '../models/autoRequestSchema.js';
import { submitQuoteRequest } from '../services/autoQuoteService.js';
import { submitBindRequest } from '../services/bindService.js';
import config from '../config/index.js';
import mockResponses from '../data/autoMockResponses.js';

/**
 * Auto Quote context object
 * @type {React.Context}
 */
export const AutoContext = createContext();

/**
 * Auto Quote Provider component
 * Wraps the auto workflow with quote context and state management
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The provider component
 */
export function AutoProvider({ children, onGoHome }) {
  const [quoteData, setQuoteData] = useState(initialQuoteData);
  const [quoteResponses, setQuoteResponses] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInsurerIndex, setSelectedInsurerIndex] = useState(null);
  const [bindResponse, setBindResponse] = useState(null);
  const [bindError, setBindError] = useState(null);

  /**
   * Updates quote data for a specific section
   * Supports nested updates for customer, vehicle, etc.
   * @param {string} section - The section to update (e.g., 'customer', 'vehicle')
   * @param {Object} data - The data to merge into that section
   */
  const updateQuoteData = useCallback((section, data) => {
    setQuoteData((prevData) => {
      if (!section) {
        return { ...prevData, ...data };
      }
      if (Array.isArray(data)) {
        return { ...prevData, [section]: data };
      }
      if (typeof prevData[section] === 'object' && prevData[section] !== null && !Array.isArray(prevData[section])) {
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            ...data,
          },
        };
      }
      return {
        ...prevData,
        [section]: data,
      };
    });
  }, []);

  /**
   * Sets the list of selected insurers
   * @param {Array<string>} insurerList - Array of selected insurer names
   */
  const setSelectedInsurers = useCallback((insurerList) => {
    setQuoteData((prevData) => ({
      ...prevData,
      selectedInsurers: insurerList,
    }));
  }, []);

  /**
   * Submits the quote to the API
   * Updates quoteResponses on success, error on failure
   * @returns {Promise<void>}
   */
  const submitQuote = useCallback(async (overrides) => {
    setIsLoading(true);
    setError(null);
    setSelectedInsurerIndex(null);

    const payload = overrides ? { ...quoteData, ...overrides } : quoteData;
    const selectedIds = payload.selectedInsurers || [];
    const insurerMeta = overrides?._insurerMeta || [];

    // Build id -> display-name lookup
    const nameMap = {};
    insurerMeta.forEach(({ id, name }) => { nameMap[id] = name; });

    // Seed quoteResponses with loading placeholders
    const placeholders = selectedIds.map((id) => ({
      _status: 'loading',
      insurerId: id,
      insurerName: nameMap[id] || id,
    }));
    setQuoteResponses(placeholders);

    // Fire one request per insurer in parallel
    const settled = await Promise.allSettled(
      selectedIds.map(async (insurerId, index) => {
        if (config.mockMode) {
          await new Promise((r) => setTimeout(r, 400 + Math.random() * 1200));
          const mock = mockResponses[insurerId];
          if (!mock) throw new Error(`No mock data for ${insurerId}`);
          setQuoteResponses((prev) => {
            const next = [...prev];
            next[index] = { ...mock, _status: 'done' };
            return next;
          });
        } else {
          const singlePayload = { ...payload, selectedInsurers: [insurerId] };
          delete singlePayload._insurerMeta;
          const response = await submitQuoteRequest(singlePayload);
          const result = (response.results || response)?.[0] || response;
          setQuoteResponses((prev) => {
            const next = [...prev];
            next[index] = { ...result, _status: 'done' };
            return next;
          });
        }
      })
    );

    // Mark any failures
    settled.forEach((outcome, idx) => {
      if (outcome.status === 'rejected') {
        const errMsg = outcome.reason?.message || 'Quote request failed';
        setQuoteResponses((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], _status: 'error', errorMessage: errMsg };
          return next;
        });
      }
    });

    const anySucceeded = settled.some((o) => o.status === 'fulfilled');
    if (!anySucceeded) {
      setError('All quote requests failed. Please try again.');
    }

    setIsLoading(false);
  }, [quoteData]);

  /**
   * Submits a bind request for the currently selected quote.
   * @param {Object} bindData - Additional bind data (e.g. payment info)
   * @returns {Promise<void>}
   */
  const submitBind = useCallback(async (bindData = {}) => {
    setIsLoading(true);
    setBindError(null);
    try {
      const selectedResponse = quoteResponses?.[selectedInsurerIndex ?? 0];
      console.log('[AutoContext/submitBind] selectedResponse keys:', selectedResponse ? Object.keys(selectedResponse) : 'null');
      console.log('[AutoContext/submitBind] companysQuoteNumber on response:', selectedResponse?.companysQuoteNumber);
      const quoteNumber = selectedResponse?.referenceNumber || '';
      const companysQuoteNumber = selectedResponse?.companysQuoteNumber || '';

      const payload = {
        quoteNumber,
        companysQuoteNumber,
        insurerId: bindData.insurerId || 'aviva',
        quoteData,
        ...bindData,
      };

      // Client-side bind messages based on quote ID
      const bindMessages = [];
      if (quoteData.id === 'SC-004') {
        bindMessages.push(
          'Credit card payment selected. Insurer will contact the insured directly to collect credit card details.',
          'First payment must be processed within 30 days of the policy effective date to avoid cancellation.',
          'A confirmation of payment will be sent to the broker once the insurer has successfully collected payment.',
        );
      }

      if (config.mockMode) {
        await new Promise((r) => setTimeout(r, 600));
        setBindResponse({
          success: true,
          policyNumber: 'POL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          quoteNumber,
          bindTimestamp: new Date().toISOString(),
          status: 'BOUND',
          message: 'Policy has been successfully bound.',
          ...(bindMessages.length > 0 && { bindMessages }),
        });
      } else {
        const response = await submitBindRequest(payload);
        setBindResponse({
          ...response,
          ...(bindMessages.length > 0 && { bindMessages }),
        });
      }
    } catch (err) {
      setBindError(err.message || 'Failed to bind quote');
      console.error('Bind submission error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quoteResponses, selectedInsurerIndex]);

  /**
   * Navigates to a specific step
   * @param {number} stepNumber - The step to go to (0-indexed)
   */
  const goToStep = useCallback((stepNumber) => {
    setCurrentStep(stepNumber);
  }, []);

  /**
   * Moves to the next step
   */
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  /**
   * Moves to the previous step
   */
  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  /**
   * Loads a saved quote into the form.
   * If the quote has "Quoted" status, jumps directly to Select Insurers (step 4).
   * Otherwise jumps to step 1 (Quote Details).
   * @param {Object} savedQuote - A saved quote object from JSON
   */
  const loadQuote = useCallback((savedQuote) => {
    const { name, status, createdDate, ...formData } = savedQuote;
    setQuoteData({ ...initialQuoteData, ...formData });
    setQuoteResponses(null);
    setError(null);
    setSelectedInsurerIndex(null);
    setCurrentStep(status === 'Quoted' ? 4 : 1);
  }, []);

  /**
   * Resets the quote form to initial state
   * Clears responses and moves to first step
   */
  const resetQuote = useCallback(() => {
    setQuoteData(initialQuoteData);
    setQuoteResponses(null);
    setCurrentStep(0);
    setError(null);
    setSelectedInsurerIndex(null);
    setBindResponse(null);
    setBindError(null);
  }, []);

  const value = {
    quoteData,
    updateQuoteData,
    quoteResponses,
    setQuoteResponses,
    currentStep,
    isLoading,
    error,
    setSelectedInsurers,
    submitQuote,
    goToStep,
    nextStep,
    prevStep,
    loadQuote,
    resetQuote,
    selectedInsurerIndex,
    setSelectedInsurerIndex,
    bindResponse,
    bindError,
    submitBind,
    goHome: onGoHome,
  };

  return <AutoContext.Provider value={value}>{children}</AutoContext.Provider>;
}

/**
 * Custom hook to use Auto Quote Context
 * Must be used within an AutoProvider
 * @returns {Object} The auto quote context value
 * @throws {Error} If used outside of AutoProvider
 */
export function useAutoQuote() {
  const context = useContext(AutoContext);
  if (!context) {
    throw new Error('useAutoQuote must be used within an AutoProvider');
  }
  return context;
}
