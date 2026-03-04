import { CONFIG, MOCK_WORKPLACES } from '@/shared/config';

export interface FormData {
  personal: {
    phone: string;
    firstName: string;
    lastName: string;
    gender: GenderOption;
  };
  address: {
    workplace: string;
    residenceAddress: string;
  };
  loan: {
    amount: number;
    term: number;
  };
}

export type GenderOption = 'male' | 'female' | '';

export type FormStep = typeof CONFIG.STEPS[keyof typeof CONFIG.STEPS];

export type WorkplaceCategory = typeof MOCK_WORKPLACES[number];

export type ValidationErrors = Partial<Record<keyof FormData['personal'] | keyof FormData['address'], string>>;

export const INITIAL_FORM_DATA: FormData = {
  personal: { phone: '', firstName: '', lastName: '', gender: '' },
  address: { workplace: '', residenceAddress: '' },
  loan: {
    amount: CONFIG.LOAN.MIN_AMOUNT,
    term: CONFIG.LOAN.MIN_TERM
  },
} as const;
