import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '@/entities/form-data';
import { canAccessStep, getRedirectStep } from '@/entities/workplace';
import { FormStep } from '@/shared/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredStep: FormStep;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredStep,
}) => {
  const navigate = useNavigate();
  const { formData } = useFormData();

  useEffect(() => {
    if (!canAccessStep(formData, requiredStep)) {
      const redirectPath = getRedirectStep(formData);
      navigate(redirectPath, { replace: true });
    }
  }, [formData, requiredStep, navigate]);

  if (!canAccessStep(formData, requiredStep)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Перенаправление...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
