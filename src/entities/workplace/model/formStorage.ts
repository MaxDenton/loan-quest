import { FormData, INITIAL_FORM_DATA, FormStep } from '@/shared/types';
import { CONFIG } from '@/shared/config';

const STORAGE_KEY = 'loan_application_form_data';

export const saveFormDataToStorage = (formData: FormData): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  } catch (error) {
    console.warn('Failed to save form data to sessionStorage:', error);
  }
};

export const loadFormDataFromStorage = (): FormData => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as FormData;
    }
  } catch (error) {
    console.warn('Failed to load form data from sessionStorage:', error);
  }
  return INITIAL_FORM_DATA;
};

export const clearFormDataFromStorage = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear form data from sessionStorage:', error);
  }
};

const SUBMISSION_FLAG_KEY = 'loan_application_submitted';

export const markAsSubmitted = (): void => {
  try {
    sessionStorage.setItem(SUBMISSION_FLAG_KEY, 'true');
  } catch (error) {
    console.warn('Failed to save submission flag:', error);
  }
};

export const clearSubmissionFlag = (): void => {
  try {
    sessionStorage.removeItem(SUBMISSION_FLAG_KEY);
  } catch (error) {
    console.warn('Failed to clear submission flag:', error);
  }
};

export const isSubmitted = (): boolean => {
  try {
    return sessionStorage.getItem(SUBMISSION_FLAG_KEY) === 'true';
  } catch {
    return false;
  }
};

export const canAccessStep = (formData: FormData, targetStep: FormStep): boolean => {
  switch (targetStep) {
    case CONFIG.STEPS.PERSONAL:
      return true;

    case CONFIG.STEPS.ADDRESS:
      return !!(
        formData.personal.phone &&
        formData.personal.firstName &&
        formData.personal.lastName &&
        formData.personal.gender
      );

    case CONFIG.STEPS.LOAN:
      return !!(
        formData.personal.phone &&
        formData.personal.firstName &&
        formData.personal.lastName &&
        formData.personal.gender &&
        formData.address.workplace &&
        formData.address.residenceAddress
      );

    case CONFIG.STEPS.CONFIRMATION:
      return !!(
        formData.personal.phone &&
        formData.personal.firstName &&
        formData.personal.lastName &&
        formData.personal.gender &&
        formData.address.workplace &&
        formData.address.residenceAddress &&
        formData.loan.amount &&
        formData.loan.term
      );

    case CONFIG.STEPS.DONE:
      return isSubmitted();

    default:
      return false;
  }
};

export const getRedirectStep = (formData: FormData): string => {
  if (isSubmitted()) {
    return '/done';
  }

  if (!formData.personal.phone || !formData.personal.firstName || !formData.personal.lastName) {
    return '/step/1';
  }

  if (!formData.address.workplace || !formData.address.residenceAddress) {
    return '/step/2';
  }

  if (!formData.loan.amount || !formData.loan.term) {
    return '/step/3';
  }

  return '/step/3';
};
