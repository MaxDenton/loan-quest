import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { useFormData } from '@/entities/form-data';

export const DoneScreen: React.FC = () => {
  const navigate = useNavigate();
  const { resetForm } = useFormData();

  const handleStartNew = () => {
    resetForm();
    navigate('/step/1');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-8">Fine!</h1>
        <p className="text-muted-foreground mb-6">
          Ваша заявка успешно отправлена
        </p>
        <Button onClick={handleStartNew} className="mx-auto">
          Начать новую заявку
        </Button>
      </div>
    </div>
  );
};
