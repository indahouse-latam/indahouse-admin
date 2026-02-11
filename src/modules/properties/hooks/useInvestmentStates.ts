import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';
import { toast } from 'sonner';

export type InvestmentStatus = 'ACTIVE' | 'DONE' | 'FAILED' | 'NOT_INITIATED';

export interface InvestmentState {
  id: string;
  property_id?: string;
  title: string;
  description: string;
  status: InvestmentStatus;
  order_position: number;
  milestone_date: string;
  is_current_state: boolean;
  status_color: 'blue' | 'green' | 'red' | 'gray';
  created_at?: string;
  updated_at?: string;
}

export interface CreateInvestmentStateInput {
  title: string;
  description?: string;
  milestone_date: string;
  order_position: number;
  is_initial_state?: boolean;
}

export const useInvestmentStates = (propertyId: string | null) => {
  const queryClient = useQueryClient();

  const query = useQuery<InvestmentState[]>({
    queryKey: ['investment-states', propertyId],
    queryFn: async () => {
      const response = await fetchApi(`/properties/${propertyId}/investment-states`);
      return response.data?.investment_states || response.investment_states || [];
    },
    enabled: !!propertyId,
  });

  const createInitialMutation = useMutation({
    mutationFn: async (states: CreateInvestmentStateInput[]) => {
      return await fetchApi(`/properties/${propertyId}/investment-states`, {
        method: 'POST',
        body: JSON.stringify({ investment_states: states }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-states', propertyId] });
      toast.success('Estados de inversi\u00f3n creados');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear estados de inversi\u00f3n');
    },
  });

  const moveStateMutation = useMutation({
    mutationFn: async (direction: 'next' | 'previous') => {
      const body = direction === 'next' ? { next_state: true } : { previous_state: true };
      return await fetchApi(`/properties/${propertyId}/investment-states/move`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-states', propertyId] });
      toast.success('Estado movido correctamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al mover estado');
    },
  });

  const updateCurrentStatusMutation = useMutation({
    mutationFn: async (newStatus: InvestmentStatus) => {
      return await fetchApi(`/properties/${propertyId}/investment-states/current`, {
        method: 'PUT',
        body: JSON.stringify({ new_status: newStatus }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-states', propertyId] });
      toast.success('Status del estado actual actualizado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar status');
    },
  });

  const addStateMutation = useMutation({
    mutationFn: async (state: { title: string; description?: string; milestone_date: string }) => {
      return await fetchApi(`/properties/${propertyId}/investment-states/add`, {
        method: 'POST',
        body: JSON.stringify(state),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-states', propertyId] });
      toast.success('Nuevo estado agregado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al agregar estado');
    },
  });

  const updateStateMutation = useMutation({
    mutationFn: async ({ stateId, data }: { stateId: string; data: { title?: string; description?: string; milestone_date?: string } }) => {
      return await fetchApi(`/investment-states/${stateId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-states', propertyId] });
      toast.success('Estado actualizado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar estado');
    },
  });

  const deleteStateMutation = useMutation({
    mutationFn: async (stateId: string) => {
      return await fetchApi(`/investment-states/${stateId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-states', propertyId] });
      toast.success('Estado eliminado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar estado');
    },
  });

  return {
    states: query.data ?? [],
    isLoading: query.isLoading,
    createInitial: createInitialMutation.mutate,
    isCreatingInitial: createInitialMutation.isPending,
    moveState: moveStateMutation.mutate,
    isMoving: moveStateMutation.isPending,
    updateCurrentStatus: updateCurrentStatusMutation.mutate,
    isUpdatingCurrent: updateCurrentStatusMutation.isPending,
    addState: addStateMutation.mutate,
    isAdding: addStateMutation.isPending,
    updateState: updateStateMutation.mutate,
    isUpdatingState: updateStateMutation.isPending,
    deleteState: deleteStateMutation.mutate,
    isDeleting: deleteStateMutation.isPending,
  };
};
