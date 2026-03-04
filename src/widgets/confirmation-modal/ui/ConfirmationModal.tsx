import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useFormData } from '@/entities/form-data';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { CONFIG } from '@/shared/config';
import { markAsSubmitted } from '@/entities/workplace';

export const ConfirmationModal: React.FC = () => {
  const { formData, setStep } = useFormData();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      markAsSubmitted();
      setStep(CONFIG.STEPS.DONE);
      navigate('/done');
    }, CONFIG.ANIMATION.MODAL_FADE);
  }, [setStep, navigate]);

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    setIsVisible(true);

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, CONFIG.ANIMATION.MODAL_FADE);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      previousActiveElement.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const { firstName, lastName } = formData.personal;
  const { amount, term } = formData.loan;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div
        className={`relative bg-background rounded-lg shadow-lg max-w-md w-full mx-4 p-6 transform transition-transform duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
            aria-hidden="true"
          >
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 id="modal-title" className="text-2xl font-semibold mb-2">
            Заявка одобрена!
          </h3>

          <p id="modal-description" className="text-muted-foreground mb-6">
            Поздравляем, {lastName} {firstName}. Вам одобрена ${amount} на {term} дней.
          </p>

          <Button
            ref={closeButtonRef}
            onClick={handleClose}
            className="w-full"
            type="button"
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};
