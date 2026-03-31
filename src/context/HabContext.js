/**
 * Habitational Quote Context
 * Provides hab quote data state management and functions.
 * Mirrors QuoteContext pattern but with hab-specific data model.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { initialHabQuoteData } from '../models/habRequestSchema.js';
import { submitHabQuoteRequest } from '../services/habQuoteService.js';
import { submitBindRequest } from '../services/bindService.js';
import config from '../config/index.js';
import habMockResponses from '../data/habMockResponses.js';

export const HabContext = createContext();

export function HabProvider({ children }) {
  const [habData, setHabData] = useState(initialHabQuoteData);
  const [habResponses, setHabResponses] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInsurerIndex, setSelectedInsurerIndex] = useState(null);
  const [bindResponse, setBindResponse] = useState(null);
  const [bindError, setBindError] = useState(null);

  const updateHabData = useCallback((section, data) => {
    setHabData((prev) => {
      if (!section) return { ...prev, ...data };
      if (Array.isArray(data)) return { ...prev, [section]: data };
      if (typeof prev[section] === 'object' && prev[section] !== null && !Array.isArray(prev[section])) {
        return { ...prev, [section]: { ...prev[section], ...data } };
      }
      return { ...prev, [section]: data };
    });
  }, []);

  const setSelectedInsurers = useCallback((insurerList) => {
    setHabData((prev) => ({ ...prev, selectedInsurers: insurerList }));
  }, []);

  const submitQuote = useCallback(async (overrides) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = overrides ? { ...habData, ...overrides } : habData;
      const selectedIds = payload.selectedInsurers || [];

      if (config.mockMode) {
        await new Promise((r) => setTimeout(r, 800));
        const results = selectedIds
          .filter((id) => habMockResponses[id])
          .map((id) => ({ ...habMockResponses[id] }));
        setHabResponses(results);
      } else {
        const response = await submitHabQuoteRequest(payload);
        setHabResponses(response.results || response);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit quote');
      console.error('Hab quote submission error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [habData]);

  const submitBind = useCallback(async (bindData = {}) => {
    setIsLoading(true);
    setBindError(null);
    try {
      const selectedResponse = habResponses?.[selectedInsurerIndex ?? 0];
      const quoteNumber = selectedResponse?.referenceNumber || '';
      const payload = { quoteNumber, ...bindData };

      if (config.mockMode) {
        await new Promise((r) => setTimeout(r, 600));
        setBindResponse({
          success: true,
          policyNumber: 'POL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          quoteNumber,
          bindTimestamp: new Date().toISOString(),
          status: 'BOUND',
          message: 'Policy has been successfully bound.',
        });
      } else {
        const response = await submitBindRequest(payload);
        setBindResponse(response);
      }
    } catch (err) {
      setBindError(err.message || 'Failed to bind quote');
    } finally {
      setIsLoading(false);
    }
  }, [habResponses, selectedInsurerIndex]);

  const goToStep = useCallback((stepNumber) => setCurrentStep(stepNumber), []);
  const nextStep = useCallback(() => setCurrentStep((p) => p + 1), []);
  const prevStep = useCallback(() => setCurrentStep((p) => Math.max(p - 1, 0)), []);

  const loadQuote = useCallback((savedQuote) => {
    const { id, name, status, createdDate, ...formData } = savedQuote;
    setHabData({ ...initialHabQuoteData, ...formData });
    setHabResponses(null);
    setError(null);
    setSelectedInsurerIndex(null);
    setBindResponse(null);
    setBindError(null);
    // Quoted transactions skip to Select Insurers (step 5); drafts start at Quote Details
    setCurrentStep(status === 'Quoted' ? 5 : 1);
  }, []);

  const resetQuote = useCallback(() => {
    setHabData(initialHabQuoteData);
    setHabResponses(null);
    setCurrentStep(0);
    setError(null);
    setSelectedInsurerIndex(null);
    setBindResponse(null);
    setBindError(null);
  }, []);

  const value = {
    habData,
    updateHabData,
    habResponses,
    setHabResponses,
    currentStep,
    isLoading,
    error,
    setSelectedInsurers,
    submitQuote,
    submitBind,
    goToStep,
    nextStep,
    prevStep,
    loadQuote,
    resetQuote,
    selectedInsurerIndex,
    setSelectedInsurerIndex,
    bindResponse,
    bindError,
  };

  return <HabContext.Provider value={value}>{children}</HabContext.Provider>;
}

export function useHab() {
  const context = useContext(HabContext);
  if (!context) throw new Error('useHab must be used within a HabProvider');
  return context;
}
