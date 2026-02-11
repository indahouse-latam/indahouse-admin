import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';
import { toast } from 'sonner';

export type RiskType = 'moderate_short' | 'balanced' | 'venture' | 'moderate' | 'balanced_long' | 'conservative';

export interface PropertyRisk {
  id: string;
  propertyId: string;
  risk: RiskType;
  strategy: string;
  primaryGoal: string;
  horizonStartYears: number;
  horizonEndYears: number;
  createdAt: string;
  updatedAt: string;
}

export const RISK_OPTIONS: { value: RiskType; label: string }[] = [
  { value: 'conservative', label: 'Conservador' },
  { value: 'moderate_short', label: 'Moderado Corto' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'balanced', label: 'Balanceado' },
  { value: 'balanced_long', label: 'Balanceado Largo' },
  { value: 'venture', label: 'Venture' },
];

export const usePropertyRisk = (propertyId: string | null) => {
  const queryClient = useQueryClient();

  const query = useQuery<PropertyRisk | null>({
    queryKey: ['property-risk', propertyId],
    queryFn: async () => {
      try {
        const response = await fetchApi(`/properties/${propertyId}/risk`);
        return response.data || response;
      } catch (error: any) {
        if (error.message?.includes('404')) return null;
        throw error;
      }
    },
    enabled: !!propertyId,
  });

  const createMutation = useMutation({
    mutationFn: async (risk: RiskType) => {
      return await fetchApi(`/properties/${propertyId}/risk`, {
        method: 'POST',
        body: JSON.stringify({ risk }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-risk', propertyId] });
      toast.success('Perfil de riesgo creado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear perfil de riesgo');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (risk: RiskType) => {
      return await fetchApi(`/properties/${propertyId}/risk`, {
        method: 'PUT',
        body: JSON.stringify({ risk }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-risk', propertyId] });
      toast.success('Perfil de riesgo actualizado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar perfil de riesgo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await fetchApi(`/properties/${propertyId}/risk`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-risk', propertyId] });
      toast.success('Perfil de riesgo eliminado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar perfil de riesgo');
    },
  });

  return {
    risk: query.data ?? null,
    isLoading: query.isLoading,
    createRisk: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateRisk: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteRisk: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
