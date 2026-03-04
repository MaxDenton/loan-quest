import React, { useMemo, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useFormData } from '@/entities/form-data';
import { canAccessStep, getRedirectStep } from '@/entities/workplace';
import { CONFIG } from '@/shared/config';
import { FormStep } from '@/shared/types';

export const WizardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, setStep } = useFormData();

  const currentStepNumber = useMemo(() => {
    const match = location.pathname.match(/\/step\/(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }, [location.pathname]);

  const stepType = useMemo((): FormStep => {
    const stepMap: Record<number, FormStep> = {
      1: CONFIG.STEPS.PERSONAL,
      2: CONFIG.STEPS.ADDRESS,
      3: CONFIG.STEPS.LOAN,
    };
    return stepMap[currentStepNumber] || CONFIG.STEPS.PERSONAL;
  }, [currentStepNumber]);

  useEffect(() => {
    if (!canAccessStep(formData, stepType)) {
      const redirectPath = getRedirectStep(formData);
      navigate(redirectPath, { replace: true });
    }
  }, [formData, stepType, navigate]);

  useEffect(() => {
    setStep(stepType);
  }, [stepType, setStep]);

  const progressPercentage = useMemo(
    () => (currentStepNumber / 3) * 100,
    [currentStepNumber]
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="mb-6" aria-label={`Шаг ${currentStepNumber} из 3`}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Шаг {currentStepNumber} из 3
                </span>
              </div>
              <div
                className="w-full bg-muted rounded-full h-2"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
