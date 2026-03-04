import React, { useState, useCallback, useMemo } from 'react';
import { useFormData } from '@/entities/form-data';
import { useNavigate } from 'react-router-dom';
import { Input, Label, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import { IMaskInput } from 'react-imask';
import { CONFIG } from '@/shared/config';
import { ValidationErrors } from '@/shared/types';

const PHONE_DIGIT_COUNT = 10;

export const PersonalForm: React.FC = () => {
  const { formData, updateFormData, setStep } = useFormData();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ValidationErrors>({});

  const personal = useMemo(() => formData.personal, [formData.personal]);

  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (!personal.phone || personal.phone.replace(/\s/g, '').length !== PHONE_DIGIT_COUNT) {
      newErrors.phone = 'Введите телефон в формате 0XXX XXX XXX';
    }
    if (!personal.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }
    if (!personal.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }
    if (!personal.gender) {
      newErrors.gender = 'Выберите пол';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [personal]);

  const handleNext = useCallback(() => {
    if (validate()) {
      setStep(CONFIG.STEPS.ADDRESS);
      navigate('/step/2');
    }
  }, [validate, setStep, navigate]);

  const inputClass = useCallback((fieldName: keyof ValidationErrors): string => {
    return errors[fieldName] ? 'border-destructive ring-destructive' : '';
  }, [errors]);

  return (
    <div className="space-y-4" role="form" aria-labelledby="personal-form-title">
      <h2 id="personal-form-title" className="text-2xl font-semibold mb-4">
        Личные данные
      </h2>

      <div className="space-y-2">
        <Label htmlFor="phone">Телефон *</Label>
        <IMaskInput
          id="phone"
          mask="0000 000 000"
          value={personal.phone}
          onAccept={(value: string) => updateFormData('personal', { phone: value })}
          className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${inputClass('phone')}`}
          placeholder="0XXX XXX XXX"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-destructive" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">Имя *</Label>
        <Input
          id="firstName"
          value={personal.firstName}
          onChange={(e) => updateFormData('personal', { firstName: e.target.value })}
          className={inputClass('firstName')}
          placeholder="Введите имя"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
        />
        {errors.firstName && (
          <p id="firstName-error" className="text-sm text-destructive" role="alert">
            {errors.firstName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Фамилия *</Label>
        <Input
          id="lastName"
          value={personal.lastName}
          onChange={(e) => updateFormData('personal', { lastName: e.target.value })}
          className={inputClass('lastName')}
          placeholder="Введите фамилию"
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
        />
        {errors.lastName && (
          <p id="lastName-error" className="text-sm text-destructive" role="alert">
            {errors.lastName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Пол *</Label>
        <Select
          value={personal.gender || undefined}
          onValueChange={(value) => updateFormData('personal', { gender: value as 'male' | 'female' })}
        >
          <SelectTrigger className={inputClass('gender')} aria-invalid={!!errors.gender}>
            <SelectValue placeholder="Выберите пол" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Мужской</SelectItem>
            <SelectItem value="female">Женский</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p id="gender-error" className="text-sm text-destructive" role="alert">
            {errors.gender}
          </p>
        )}
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} className="w-full" type="button">
          Далее
        </Button>
      </div>
    </div>
  );
};
