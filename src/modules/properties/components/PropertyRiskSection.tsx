'use client';

import { useState } from 'react';
import { Loader2, ShieldAlert, Trash2 } from 'lucide-react';
import { usePropertyRisk, RISK_OPTIONS, RiskType } from '../hooks/usePropertyRisk';

interface PropertyRiskSectionProps {
  propertyId: string | null;
}

const STRATEGY_LABELS: Record<string, string> = {
  yield_optimizer: 'Optimizador de rendimiento',
  value_add_hold: 'Fix & Hold',
  exclusive_build: 'Construccion exclusiva',
  income_balanced: 'Ingreso balanceado',
  capital_preservation: 'Preservacion de capital',
  growth_focused: 'Enfocado en crecimiento',
};

const GOAL_LABELS: Record<string, string> = {
  monthly_income: 'Ingreso mensual',
  operational_growth: 'Crecimiento operacional',
  gross_appreciation: 'Apreciacion bruta',
  capital_growth: 'Crecimiento de capital',
  passive_income: 'Ingreso pasivo',
};

export function PropertyRiskSection({ propertyId }: PropertyRiskSectionProps) {
  const { risk, isLoading, createRisk, isCreating, updateRisk, isUpdating, deleteRisk, isDeleting } = usePropertyRisk(propertyId);
  const [selectedRisk, setSelectedRisk] = useState<RiskType>('balanced');

  if (!propertyId) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Primero crea la propiedad para configurar el riesgo.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const isBusy = isCreating || isUpdating || isDeleting;

  if (!risk) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg mx-auto space-y-6">
        <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
          <ShieldAlert className="w-4 h-4 text-primary" />
          Crear Perfil de Riesgo
        </h4>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Tipo de Riesgo</label>
          <select
            className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value as RiskType)}
          >
            {RISK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => createRisk(selectedRisk)}
          disabled={isBusy}
          className="w-full px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
          Crear Perfil de Riesgo
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg mx-auto space-y-6">
      <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
        <ShieldAlert className="w-4 h-4 text-primary" />
        Perfil de Riesgo
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Estrategia</p>
          <p className="text-sm font-medium">{STRATEGY_LABELS[risk.strategy] || risk.strategy}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Objetivo Principal</p>
          <p className="text-sm font-medium">{GOAL_LABELS[risk.primaryGoal] || risk.primaryGoal}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 border border-border col-span-2">
          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Horizonte</p>
          <p className="text-sm font-medium">{risk.horizonStartYears} - {risk.horizonEndYears} años</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Cambiar Tipo de Riesgo</label>
        <select
          className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value as RiskType)}
        >
          {RISK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => updateRisk(selectedRisk)}
          disabled={isBusy}
          className="flex-1 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
          Actualizar
        </button>
        <button
          type="button"
          onClick={() => deleteRisk()}
          disabled={isBusy}
          className="px-4 py-2.5 text-sm font-medium border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Eliminar
        </button>
      </div>
    </div>
  );
}
