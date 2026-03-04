import React, { useCallback, useMemo, useState } from 'react';
import { useFormData } from '@/entities/form-data';
import { useNavigate } from 'react-router-dom';
import { Input, Label, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import { useWorkplaces } from '@/features/form-submission';
import { CONFIG } from '@/shared/config';
import { ValidationErrors } from '@/shared/types';

export const AddressForm: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormData();
  const navigate = useNavigate();
  const { data: workplaces, isLoading, error } = useWorkplaces();

  const address = useMemo(() => formData.address, [formData.address]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (!address.workplace) {
      newErrors.workplace = 'Выберите место работы';
    }
    if (!address.residenceAddress.trim()) {
      newErrors.residenceAddress = 'Введите адрес проживания';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [address]);

  const handleNext = useCallback(() => {
    if (validate()) {
      setStep(CONFIG.STEPS.LOAN);
      navigate('/step/3');
    }
  }, [validate, setStep, navigate]);

  const handleBack = useCallback(() => {
    setStep(CONFIG.STEPS.PERSONAL);
    navigate('/step/1');
  }, [setStep, navigate]);

  const inputClass = useCallback((fieldName: keyof ValidationErrors): string => {
    return errors[fieldName] ? 'border-destructive ring-destructive' : '';
  }, [errors]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8" role="status" aria-label="Загрузка">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="sr-only">Загрузка данных...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">Не удалось загрузить данные</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="form" aria-labelledby="address-form-title">
      <h2 id="address-form-title" className="text-2xl font-semibold mb-4">
        Адрес и место работы
      </h2>

      <div className="space-y-2">
        <Label htmlFor="workplace">Место работы *</Label>
        <Select
          value={address.workplace || undefined}
          onValueChange={(value) => updateFormData('address', { workplace: value })}
        >
          <SelectTrigger className={inputClass('workplace')} aria-invalid={!!errors.workplace}>
            <SelectValue placeholder="Выберите место работы" />
          </SelectTrigger>
          <SelectContent>
            {workplaces?.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.workplace && (
          <p id="workplace-error" className="text-sm text-destructive" role="alert">
            {errors.workplace}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="residenceAddress">Адрес проживания *</Label>
        <Input
          id="residenceAddress"
          value={address.residenceAddress}
          onChange={(e) => updateFormData('address', { residenceAddress: e.target.value })}
          className={inputClass('residenceAddress')}
          placeholder="Введите адрес проживания"
          aria-invalid={!!errors.residenceAddress}
          aria-describedby={errors.residenceAddress ? 'residenceAddress-error' : undefined}
        />
        {errors.residenceAddress && (
          <p id="residenceAddress-error" className="text-sm text-destructive" role="alert">
            {errors.residenceAddress}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={handleBack} className="flex-1" type="button">
          Назад
        </Button>
        <Button onClick={handleNext} className="flex-1" type="button">
          Далее
        </Button>
      </div>
    </div>
  );
};
