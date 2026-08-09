import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';
import { toast } from 'sonner';

export enum PropertyRiskEnum {
  MODERATE_SHORT = 'moderate_short',
  BALANCED = 'balanced',
  VENTURE = 'venture',
  MODERATE = 'moderate',
  BALANCED_LONG = 'balanced_long',
  CONSERVATIVE = 'conservative',
}

export enum InvestmentStrategyEnum {
  INSTITUTIONAL_HARD_ASSET = 'institutional_hard_asset',
  EXCLUSIVE_BUILD = 'exclusive_build',
  YIELD_OPTIMIZER = 'yield_optimizer',
  PRE_COMPLETION_VALUE = 'pre_completion_value',
  VALUE_ADD_HOLD = 'value_add_hold',
  INSTITUTIONAL_BUNDLING = 'institutional_bundling',
}

export enum PrimaryGoalEnum {
  APPRECIATION_PRESTIGE = 'appreciation_prestige',
  GROSS_APPRECIATION = 'gross_appreciation',
  MONTHLY_INCOME = 'monthly_income',
  ARBITRAGE_LIQUIDITY = 'arbitrage_liquidity',
  OPERATIONAL_GROWTH = 'operational_growth',
  INSTITUTIONAL_EXIT = 'institutional_exit',
}

export type RiskType = PropertyRiskEnum;

export interface PropertyRisk {
  id: string;
  propertyId: string;
  risk: RiskType;
  strategy: string;
  primaryGoal: string;
  horizonStartYears: number;
  horizonEndYears: number | null;
  createdAt: string;
  updatedAt: string;
}

export const RISK_OPTIONS: { value: RiskType; label: string }[] = [
  { value: PropertyRiskEnum.MODERATE_SHORT, label: 'Corto (1-2y)' },
  { value: PropertyRiskEnum.BALANCED, label: 'Corto/Medio (1-5y)' },
  { value: PropertyRiskEnum.VENTURE, label: 'Mediano (2-4y)' },
  { value: PropertyRiskEnum.MODERATE, label: 'Mediano (3-5y)' },
  { value: PropertyRiskEnum.BALANCED_LONG, label: 'Medio/Largo (4y+)' },
  { value: PropertyRiskEnum.CONSERVATIVE, label: 'Largo plazo (5y+)' },
];

export const STRATEGY_FOR_RISK: Record<PropertyRiskEnum, InvestmentStrategyEnum> = {
  [PropertyRiskEnum.CONSERVATIVE]: InvestmentStrategyEnum.INSTITUTIONAL_HARD_ASSET,
  [PropertyRiskEnum.VENTURE]: InvestmentStrategyEnum.EXCLUSIVE_BUILD,
  [PropertyRiskEnum.BALANCED]: InvestmentStrategyEnum.YIELD_OPTIMIZER,
  [PropertyRiskEnum.MODERATE_SHORT]: InvestmentStrategyEnum.PRE_COMPLETION_VALUE,
  [PropertyRiskEnum.MODERATE]: InvestmentStrategyEnum.VALUE_ADD_HOLD,
  [PropertyRiskEnum.BALANCED_LONG]: InvestmentStrategyEnum.INSTITUTIONAL_BUNDLING,
};

/** Mapea la respuesta del API (snake_case) al tipo del admin (camelCase). */
function mapRiskFromApi(raw: Record<string, unknown> | null): PropertyRisk | null {
  if (!raw || typeof raw !== 'object') return null;

  const payload =
    raw.data && typeof raw.data === 'object'
      ? (raw.data as Record<string, unknown>)
      : raw;

  const id = payload.id;
  if (typeof id !== 'string' || !id) return null;

  const propertyId = payload.propertyId ?? payload.property_id;
  const strategy = payload.strategy;
  const primaryGoal = payload.primaryGoal ?? payload.primary_goal;
  const horizonStartYears = payload.horizonStartYears ?? payload.horizon_start_years;
  const horizonEndYears = payload.horizonEndYears ?? payload.horizon_end_years;
  const createdAt = payload.createdAt ?? payload.created_at;
  const updatedAt = payload.updatedAt ?? payload.updated_at;

  const safeRisk =
    typeof payload.risk === 'string' ? (payload.risk as RiskType) : PropertyRiskEnum.BALANCED;
  const parsedHorizonEndYears = horizonEndYears == null ? null : Number(horizonEndYears);

  return {
    id,
    propertyId: typeof propertyId === 'string' ? propertyId : '',
    risk: safeRisk,
    strategy: typeof strategy === 'string' ? strategy : '',
    primaryGoal: typeof primaryGoal === 'string' ? primaryGoal : '',
    horizonStartYears: Number(horizonStartYears ?? 0),
    horizonEndYears: parsedHorizonEndYears,
    createdAt: typeof createdAt === 'string' ? createdAt : '',
    updatedAt: typeof updatedAt === 'string' ? updatedAt : '',
  };
}

export const usePropertyRisk = (propertyId: string | null) => {
  const queryClient = useQueryClient();

  const query = useQuery<PropertyRisk | null>({
    queryKey: ['property-risk', propertyId],
    queryFn: async () => {
      try {
        const response = await fetchApi(`/properties/${propertyId}/risk`);
        const data = response.data ?? response;
        return mapRiskFromApi(data as Record<string, unknown>);
      } catch (error: any) {
        const msg = error?.message ?? '';
        const is404 =
          msg.includes('404') ||
          msg.includes('Property risk not found') ||
          msg.includes('PRISK-404');
        if (is404) return null;
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
