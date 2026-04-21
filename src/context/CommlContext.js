/**
 * Commercial Lines Quote Context
 * Provides commercial quote data state management and functions.
 * Mirrors HabContext pattern but with commercial-specific data model.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { initialCommlQuoteData } from '../models/commlRequestSchema.js';
import { submitCommlQuoteRequest } from '../services/commlQuoteService.js';
import { submitCommlBindRequest } from '../services/commlBindService.js';
import config from '../config/index.js';
import commlMockResponses from '../data/commlMockResponses.js';

export const CommlContext = createContext();

export function CommlProvider({ children, onGoHome }) {
  const [commlData, setCommlData] = useState(initialCommlQuoteData);
  const [commlResponses, setCommlResponses] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInsurerIndex, setSelectedInsurerIndex] = useState(null);
  const [bindResponse, setBindResponse] = useState(null);
  const [bindError, setBindError] = useState(null);

  const updateCommlData = useCallback((section, data) => {
    setCommlData((prev) => {
      if (!section) return { ...prev, ...data };
      if (Array.isArray(data)) return { ...prev, [section]: data };
      if (typeof prev[section] === 'object' && prev[section] !== null && !Array.isArray(prev[section])) {
        return { ...prev, [section]: { ...prev[section], ...data } };
      }
      return { ...prev, [section]: data };
    });
  }, []);

  const setSelectedInsurers = useCallback((insurerList) => {
    setCommlData((prev) => ({ ...prev, selectedInsurers: insurerList }));
  }, []);

  const submitQuote = useCallback(async (overrides) => {
    setIsLoading(true);
    setError(null);
    setSelectedInsurerIndex(null);

    const payload = overrides ? { ...commlData, ...overrides } : commlData;
    const selectedIds = payload.selectedInsurers || [];
    const insurerMeta = overrides?._insurerMeta || [];

    const nameMap = {};
    insurerMeta.forEach(({ id, name }) => { nameMap[id] = name; });

    const placeholders = selectedIds.map((id) => ({
      _status: 'loading',
      insurerId: id,
      insurerName: nameMap[id] || id,
    }));
    setCommlResponses(placeholders);

    const settled = await Promise.allSettled(
      selectedIds.map(async (insurerId, index) => {
        if (config.mockMode) {
          await new Promise((r) => setTimeout(r, 400 + Math.random() * 1200));
          const mock = commlMockResponses[insurerId];
          if (!mock) throw new Error(`No mock data for ${insurerId}`);
          setCommlResponses((prev) => {
            const next = [...prev];
            next[index] = { ...mock, _status: 'done' };
            return next;
          });
        } else {
          const singlePayload = { ...payload, selectedInsurers: [insurerId] };
          delete singlePayload._insurerMeta;
          const response = await submitCommlQuoteRequest(singlePayload);
          const result = (response.results || response)?.[0] || response;
          setCommlResponses((prev) => {
            const next = [...prev];
            next[index] = { ...result, _status: 'done' };
            return next;
          });
        }
      })
    );

    settled.forEach((outcome, idx) => {
      if (outcome.status === 'rejected') {
        const errMsg = outcome.reason?.message || 'Quote request failed';
        setCommlResponses((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], _status: 'error', errorMessage: errMsg };
          return next;
        });
      }
    });

    if (!settled.some((o) => o.status === 'fulfilled')) {
      setError('All quote requests failed. Please try again.');
    }

    setIsLoading(false);
  }, [commlData]);

  const submitBind = useCallback(async (bindData = {}) => {
    setIsLoading(true);
    setBindError(null);
    try {
      const selectedResponse = commlResponses?.[selectedInsurerIndex ?? 0];
      const quoteNumber = selectedResponse?.referenceNumber || '';
      const companysQuoteNumber = selectedResponse?.companysQuoteNumber || '';
      const payload = {
        quoteNumber,
        companysQuoteNumber,
        insurerId: bindData.insurerId || 'aviva',
        quoteData: commlData,
        ...bindData,
      };

      // Client-side bind messages when Credit Card is selected on the bind page.
      const bindMessages = [];
      if (bindData.payment?.method === 'creditCard') {
        bindMessages.push(
          'Policy has been successfully bound. Please use the provided link https://www.moneris.com to complete your credit card payment.',
        );
      }

      if (config.mockMode) {
        await new Promise((r) => setTimeout(r, 600));
        setBindResponse({
          success: true,
          policyNumber: 'CPOL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          quoteNumber,
          bindTimestamp: new Date().toISOString(),
          status: 'BOUND',
          message: 'Commercial policy has been successfully bound.',
          ...(bindMessages.length > 0 && { bindMessages }),
        });
      } else {
        const response = await submitCommlBindRequest(payload);
        setBindResponse({
          ...response,
          ...(bindMessages.length > 0 && { bindMessages }),
        });
      }
    } catch (err) {
      setBindError(err.message || 'Failed to bind quote');
    } finally {
      setIsLoading(false);
    }
  }, [commlResponses, selectedInsurerIndex]);

  const goToStep = useCallback((stepNumber) => setCurrentStep(stepNumber), []);
  const nextStep = useCallback(() => setCurrentStep((p) => p + 1), []);
  const prevStep = useCallback(() => setCurrentStep((p) => Math.max(p - 1, 0)), []);

  const loadQuote = useCallback((savedQuote) => {
    const { name, status, createdDate, ...formData } = savedQuote;
    setCommlData({ ...initialCommlQuoteData, ...formData });
    setCommlResponses(null);
    setError(null);
    setSelectedInsurerIndex(null);
    setBindResponse(null);
    setBindError(null);
    // Quoted transactions skip to Select Insurers (step 5); drafts start at Quote Details
    setCurrentStep(status === 'Quoted' ? 5 : 1);
  }, []);

  const resetQuote = useCallback(() => {
    setCommlData(initialCommlQuoteData);
    setCommlResponses(null);
    setCurrentStep(0);
    setError(null);
    setSelectedInsurerIndex(null);
    setBindResponse(null);
    setBindError(null);
  }, []);

  const value = {
    commlData,
    updateCommlData,
    commlResponses,
    setCommlResponses,
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
    goHome: onGoHome,
  };

  return <CommlContext.Provider value={value}>{children}</CommlContext.Provider>;
}

export function useComml() {
  const context = useContext(CommlContext);
  if (!context) throw new Error('useComml must be used within a CommlProvider');
  return context;
}
