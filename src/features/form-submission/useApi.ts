import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import { api } from '@/shared/api';

export const queryKeys = {
  workplaces: ['workplaces'] as const,
} as const;

export const useWorkplaces = () => {
  return useQuery({
    queryKey: queryKeys.workplaces,
    queryFn: api.getWorkplaceOptions,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useSubmitApplication = (): UseMutationResult<
  { id: number; title: string; status?: string },
  Error,
  string,
  unknown
> => {
  return useMutation({
    mutationFn: api.submitApplication,
    retry: 1,
  });
};
