'use client';

import { useState } from 'react';
import { Loader2, Plus, Trash2, ChevronLeft, ChevronRight, TrendingUp, Pencil, X, Check } from 'lucide-react';
import { useInvestmentStates, InvestmentStatus, CreateInvestmentStateInput, InvestmentState } from '../hooks/useInvestmentStates';

interface InvestmentStatesSectionProps {
  propertyId: string | null;
}

const STATUS_OPTIONS: { value: InvestmentStatus; label: string }[] = [
  { value: 'NOT_INITIATED', label: 'No Iniciado' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'DONE', label: 'Completado' },
  { value: 'FAILED', label: 'Fallido' },
];

const STATUS_COLORS: Record<string, string> = {
  blue: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  green: 'border-green-500/40 bg-green-500/10 text-green-400',
  red: 'border-red-500/40 bg-red-500/10 text-red-400',
  gray: 'border-gray-500/40 bg-gray-500/10 text-gray-400',
};

const STATUS_BADGE: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  green: 'bg-green-500/20 text-green-400 border border-green-500/30',
  red: 'bg-red-500/20 text-red-400 border border-red-500/30',
  gray: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

export function InvestmentStatesSection({ propertyId }: InvestmentStatesSectionProps) {
  const {
    states, isLoading, createInitial, isCreatingInitial,
    moveState, isMoving, updateCurrentStatus, isUpdatingCurrent,
    addState, isAdding, updateState, isUpdatingState, deleteState, isDeleting,
  } = useInvestmentStates(propertyId);

  const [newRows, setNewRows] = useState<CreateInvestmentStateInput[]>([
    { title: '', description: '', milestone_date: '', order_position: 0, is_initial_state: true },
  ]);
  const [addForm, setAddForm] = useState({ title: '', description: '', milestone_date: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', milestone_date: '' });

  if (!propertyId) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Primero crea la propiedad para gestionar estados de inversion.
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

  const isBusy = isCreatingInitial || isMoving || isUpdatingCurrent || isAdding || isUpdatingState || isDeleting;

  const handleCreateInitial = () => {
    const validRows = newRows.filter(r => r.title && r.milestone_date);
    if (validRows.length === 0) return;
    createInitial(validRows);
  };

  const startEdit = (state: InvestmentState) => {
    setEditingId(state.id);
    setEditForm({ title: state.title, description: state.description || '', milestone_date: state.milestone_date?.split('T')[0] || '' });
  };

  const saveEdit = (stateId: string) => {
    updateState({ stateId, data: editForm });
    setEditingId(null);
  };

  // No states yet - show creation form
  if (states.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
        <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Crear Estados Iniciales de Inversion
        </h4>

        <div className="space-y-3">
          {newRows.map((row, i) => (
            <div key={i} className="p-3 rounded-lg border border-border space-y-2 group">
              <div className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground w-6 text-center shrink-0">{i}</span>
                <input
                  className="flex-1 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Título"
                  value={row.title}
                  onChange={(e) => {
                    const next = [...newRows];
                    next[i] = { ...next[i], title: e.target.value };
                    setNewRows(next);
                  }}
                />
                <input
                  type="date"
                  className="w-44 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  value={row.milestone_date}
                  onChange={(e) => {
                    const next = [...newRows];
                    next[i] = { ...next[i], milestone_date: e.target.value };
                    setNewRows(next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setNewRows(newRows.filter((_, idx) => idx !== i))}
                  className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 shrink-0"
                  disabled={newRows.length <= 1}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-20"
                placeholder="Descripción"
                value={row.description}
                onChange={(e) => {
                  const next = [...newRows];
                  next[i] = { ...next[i], description: e.target.value };
                  setNewRows(next);
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setNewRows([...newRows, { title: '', description: '', milestone_date: '', order_position: newRows.length }])}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Agregar fila
          </button>
        </div>

        <button
          type="button"
          onClick={handleCreateInitial}
          disabled={isBusy || !newRows.some(r => r.title && r.milestone_date)}
          className="w-full px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isCreatingInitial && <Loader2 className="w-4 h-4 animate-spin" />}
          Crear Estados Iniciales
        </button>
      </div>
    );
  }

  // Has states - show management view
  const sorted = [...states].sort((a, b) => a.order_position - b.order_position);
  const currentState = sorted.find(s => s.is_current_state);
  const currentIdx = sorted.findIndex(s => s.is_current_state);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h4 className="text-sm font-bold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Estados de Inversion ({states.length})
        </h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => moveState('previous')}
            disabled={isBusy || currentIdx <= 0}
            className="p-1.5 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 transition-colors"
            title="Mover al anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => moveState('next')}
            disabled={isBusy || currentIdx >= sorted.length - 1}
            className="p-1.5 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 transition-colors"
            title="Mover al siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current state status control */}
      {currentState && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
          <span className="text-[10px] font-bold uppercase text-muted-foreground shrink-0">Status actual:</span>
          <select
            className="flex-1 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={currentState.status}
            onChange={(e) => updateCurrentStatus(e.target.value as InvestmentStatus)}
            disabled={isBusy}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {isUpdatingCurrent && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />}
        </div>
      )}

      {/* States list */}
      <div className="space-y-2">
        {sorted.map((state) => {
          const colorClass = STATUS_COLORS[state.status_color] || STATUS_COLORS.gray;
          const badgeClass = STATUS_BADGE[state.status_color] || STATUS_BADGE.gray;
          const isEditing = editingId === state.id;

          return (
            <div
              key={state.id}
              className={`p-3 rounded-lg border transition-colors ${state.is_current_state ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : colorClass}`}
            >
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <input
                      className="flex-1 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      placeholder="Título"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <input
                      type="date"
                      className="w-44 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      value={editForm.milestone_date}
                      onChange={(e) => setEditForm({ ...editForm, milestone_date: e.target.value })}
                    />
                    <button type="button" onClick={() => saveEdit(state.id)} disabled={isBusy} className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-20"
                    placeholder="Descripción"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-6 text-center shrink-0">{state.order_position}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{state.title}</p>
                      {state.is_current_state && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold shrink-0">ACTUAL</span>
                      )}
                    </div>
                    {state.description && <p className="text-xs text-muted-foreground truncate">{state.description}</p>}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${badgeClass}`}>
                    {state.status}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {state.milestone_date?.split('T')[0]}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => startEdit(state)} className="p-1 text-muted-foreground hover:text-foreground">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => deleteState(state.id)} disabled={isBusy} className="p-1 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add new state */}
      {showAddForm ? (
        <div className="p-4 rounded-lg border border-dashed border-border space-y-3">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Agregar nuevo estado al final</p>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Título"
              value={addForm.title}
              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
            />
            <input
              type="date"
              className="w-44 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={addForm.milestone_date}
              onChange={(e) => setAddForm({ ...addForm, milestone_date: e.target.value })}
            />
          </div>
          <textarea
            className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none h-20"
            placeholder="Descripción"
            value={addForm.description}
            onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (addForm.title && addForm.milestone_date) {
                  addState(addForm);
                  setAddForm({ title: '', description: '', milestone_date: '' });
                  setShowAddForm(false);
                }
              }}
              disabled={isBusy || !addForm.title || !addForm.milestone_date}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
              Agregar
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full py-2 text-sm text-primary hover:bg-primary/5 rounded-lg border border-dashed border-primary/30 transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" /> Agregar Estado
        </button>
      )}
    </div>
  );
}
