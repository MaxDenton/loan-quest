import { CONFIG, MOCK_WORKPLACES } from '@/shared/config';

export const api = {
  getWorkplaceOptions: async (): Promise<readonly string[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONFIG.API.TIMEOUTS.WORKPLACE
    );

    try {
      const response = await fetch(
        `${CONFIG.API.BASE_URL}/products/category-list`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.categories ?? MOCK_WORKPLACES;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Failed to fetch workplaces, using fallback data:', error);
      return MOCK_WORKPLACES;
    }
  },

  submitApplication: async (title: string): Promise<{ id: number; title: string; status?: string }> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONFIG.API.TIMEOUTS.SUBMISSION
    );

    try {
      const response = await fetch(`${CONFIG.API.BASE_URL}/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Submission failed, returning mock response:', error);
      return {
        id: Date.now(),
        title,
        status: 'approved',
      };
    }
  },
} as const;
