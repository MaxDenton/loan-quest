import React, { useCallback, useMemo } from 'react';
import { useFormData } from '@/entities/form-data';
import { useNavigate } from 'react-router-dom';
import { Label, Button, Slider } from '@/shared/ui';
import { useSubmitApplication } from '@/features/form-submission';
import { CONFIG } from '@/shared/config';

export const LoanForm: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormData();
  const navigate = useNavigate();
  const submitMutation = useSubmitApplication();

  const loan = useMemo(() => formData.loan, [formData.loan]);
  const personal = useMemo(() => formData.personal, [formData.personal]);

  const handleBack = useCallback(() => {
    setStep(CONFIG.STEPS.ADDRESS);
    navigate('/step/2');
  }, [setStep, navigate]);

  const handleSubmit = useCallback(() => {
    const fullName = `${personal.firstName} ${personal.lastName}`.trim();

    submitMutation.mutate(fullName, {
      onSuccess: () => {
        setStep(CONFIG.STEPS.CONFIRMATION);
        navigate('/confirmation');
      },
    });
  }, [personal, submitMutation, setStep, navigate]);

  const isSubmitting = submitMutation.isPending;
  const error = submitMutation.error;

  return (
    <div className="space-y-6" role="form" aria-labelledby="loan-form-title">
      <h2 id="loan-form-title" className="text-2xl font-semibold mb-4">
        Параметры займа
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="amount">Сумма займа</Label>
          <span className="text-lg font-semibold text-primary" aria-live="polite">
            ${loan.amount}
          </span>
        </div>
        <Slider
          id="amount"
          min={CONFIG.LOAN.MIN_AMOUNT}
          max={CONFIG.LOAN.MAX_AMOUNT}
          step={CONFIG.LOAN.AMOUNT_STEP}
          value={[loan.amount]}
          onValueChange={(value) => updateFormData('loan', { amount: value[0] })}
          className="py-4"
          aria-valuemin={CONFIG.LOAN.MIN_AMOUNT}
          aria-valuemax={CONFIG.LOAN.MAX_AMOUNT}
          aria-valuenow={loan.amount}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${CONFIG.LOAN.MIN_AMOUNT}</span>
          <span>${CONFIG.LOAN.MAX_AMOUNT}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="term">Срок займа</Label>
          <span className="text-lg font-semibold text-primary" aria-live="polite">
            {loan.term} дней
          </span>
        </div>
        <Slider
          id="term"
          min={CONFIG.LOAN.MIN_TERM}
          max={CONFIG.LOAN.MAX_TERM}
          step={CONFIG.LOAN.TERM_STEP}
          value={[loan.term]}
          onValueChange={(value) => updateFormData('loan', { term: value[0] })}
          className="py-4"
          aria-valuemin={CONFIG.LOAN.MIN_TERM}
          aria-valuemax={CONFIG.LOAN.MAX_TERM}
          aria-valuenow={loan.term}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{CONFIG.LOAN.MIN_TERM} дней</span>
          <span>{CONFIG.LOAN.MAX_TERM} дней</span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm" role="alert">
          Не удалось отправить заявку. Попробуйте позже.
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex-1"
          type="button"
        >
          Назад
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-green-600 hover:bg-green-700"
          type="button"
        >
          {isSubmitting ? 'Отправка...' : 'Подать заявку'}
        </Button>
      </div>
    </div>
  );
};
