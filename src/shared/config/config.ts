export const CONFIG = {
  STEPS: {
    PERSONAL: 'personal' as const,
    ADDRESS: 'address' as const,
    LOAN: 'loan' as const,
    CONFIRMATION: 'confirmation' as const,
    DONE: 'done' as const,
  },

  LOAN: {
    MIN_AMOUNT: 200,
    MAX_AMOUNT: 1000,
    AMOUNT_STEP: 100,
    MIN_TERM: 10,
    MAX_TERM: 30,
    TERM_STEP: 1,
  },

  API: {
    BASE_URL: 'https://dummyjson.com',
    TIMEOUTS: {
      WORKPLACE: 15000,
      SUBMISSION: 10000,
    },
  },

  ANIMATION: {
    MODAL_FADE: 300,
  },
} as const;

export const MOCK_WORKPLACES = [
  'electronics',
  'beauty',
  'furniture',
  'groceries',
  'clothing',
  'books',
  'sports',
  'automotive',
  'home-decoration',
  'fragrances',
] as const;
