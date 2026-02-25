import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';
import { toast } from 'sonner';

export interface PropertyBuilder {
  id: string;
  name: string;
  slug: string | null;
  website: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function usePropertyBuilders() {
  const queryClient = useQueryClient();

  const query = useQuery<PropertyBuilder[]>({
    queryKey: ['property-builders'],
    queryFn: async () => {
      const response = await fetchApi<{ code: string; data: PropertyBuilder[] }>('/property-builders');
      return response.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (body: { name: string; slug?: string; website?: string; description?: string }) => {
      const response = await fetchApi<{ code: string; data: PropertyBuilder }>('/property-builders', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-builders'] });
      toast.success('Constructora creada');
    },
    onError: (error: unknown) => {
      toast.error((error as Error)?.message ?? 'Error al crear constructora');
    },
  });

  return {
    builders: query.data ?? [],
    isLoading: query.isLoading,
    createBuilder: createMutation.mutate,
    createBuilderAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
