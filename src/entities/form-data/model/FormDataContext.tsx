import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
  createContext,
} from 'react';
import { FormData, FormStep, INITIAL_FORM_DATA } from '@/shared/types';
import { CONFIG } from '@/shared/config';
import {
  saveFormDataToStorage,
  loadFormDataFromStorage,
  clearFormDataFromStorage,
} from '@/entities/workplace';

interface FormDataContextValue {
  formData: Readonly<FormData>;
  updateFormData: <K extends keyof FormData>(section: K, data: Partial<FormData[K]>) => void;
  currentStep: FormStep;
  setStep: (step: FormStep) => void;
  resetForm: () => void;
}

const FormDataContext = createContext<FormDataContextValue | null>(null);

interface FormDataProviderProps {
  children: React.ReactNode;
}

export const FormDataProvider: React.FC<FormDataProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(() => loadFormDataFromStorage());
  const [currentStep, setCurrentStep] = useState<FormStep>(CONFIG.STEPS.PERSONAL);

  useEffect(() => {
    saveFormDataToStorage(formData);
  }, [formData]);

  const updateFormData = useCallback(<K extends keyof FormData>(
    section: K,
    data: Partial<FormData[K]>
  ) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  }, []);

  const setStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
  }, []);

  const resetForm = useCallback(() => {
    clearFormDataFromStorage();
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(CONFIG.STEPS.PERSONAL);
  }, []);

  const value = useMemo<FormDataContextValue>(() => ({
    formData,
    updateFormData,
    currentStep,
    setStep,
    resetForm,
  }), [formData, currentStep, updateFormData, setStep, resetForm]);

  return (
    <FormDataContext.Provider value={value}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = (): FormDataContextValue => {
  const context = useContext(FormDataContext);
  
  if (!context) {
    throw new Error('useFormData must be used within FormDataProvider');
  }
  
  return context;
};
