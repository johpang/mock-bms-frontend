/**
 * Quote Context
 * Provides quote data state management and functions to the entire app
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { initialQuoteData } from '../models/quoteRequestSchema.js';
import { submitQuoteRequest } from '../services/quoteService.js';

/**
 * Quote context object
 * @type {React.Context}
 */
export const QuoteContext = createContext();

/**
 * Quote Provider component
 * Wraps the app with quote context and state management
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The provider component
 */
export function QuoteProvider({ children }) {
  const [quoteData, setQuoteData] = useState(initialQuoteData);
  const [quoteResponses, setQuoteResponses] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInsurerIndex, setSelectedInsurerIndex] = useState(null);

  /**
   * Updates quote data for a specific section
   * Supports nested updates for customer, vehicle, etc.
   * @param {string} section - The section to update (e.g., 'customer', 'vehicle')
   * @param {Object} data - The data to merge into that section
   */
  const updateQuoteData = useCallback((section, data) => {
    setQuoteData((prevData) => {
      // If section is null/undefined, spread data directly into top level
      if (!section) {
        return { ...prevData, ...data };
      }
      // If data is an array (e.g. vehicles, drivers), replace the whole section
      if (Array.isArray(data)) {
        return { ...prevData, [section]: data };
      }
      // If section points to a nested object, merge into it
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
    try {
      // Allow callers to pass overrides (e.g. selectedInsurers) that aren't
      // yet reflected in React state due to the async setState batching.
      const payload = overrides ? { ...quoteData, ...overrides } : quoteData;
      const response = await submitQuoteRequest(payload);
      // API returns { success, quoteId, timestamp, results }, extract the results array
      setQuoteResponses(response.results || response);
    } catch (err) {
      setError(err.message || 'Failed to submit quote');
      console.error('Quote submission error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quoteData]);

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
   * Loads a saved quote into the form and jumps to step 1 (Quote Details)
   * Merges saved data over the initial schema so any missing fields get defaults
   * @param {Object} savedQuote - A saved quote object from JSON
   */
  const loadQuote = useCallback((savedQuote) => {
    // Strip non-form metadata before merging
    const { id, name, status, createdDate, ...formData } = savedQuote;
    setQuoteData({ ...initialQuoteData, ...formData });
    setQuoteResponses(null);
    setError(null);
    setSelectedInsurerIndex(null);
    setCurrentStep(1); // Jump straight to Quote Details
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
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

/**
 * Custom hook to use Quote Context
 * Must be used within a QuoteProvider
 * @returns {Object} The quote context value
 * @throws {Error} If used outside of QuoteProvider
 */
export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}
