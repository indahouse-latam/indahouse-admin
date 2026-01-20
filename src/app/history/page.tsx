'use client';

import { useState } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { useMovements, Movement } from "@/modules/financials/hooks/useMovements";
import { useRentClaims, RentClaim } from "@/modules/financials/hooks/useRentClaims";
import {
    History as HistoryIcon,
    ArrowUpRight,
    ArrowDownLeft,
    Coins,
    ExternalLink,
    Search,
    FileText,
    TrendingUp
} from "lucide-react";

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState<'movements' | 'rent'>('movements');

    const { data: movementsResponse, isLoading: isLoadingMovements } = useMovements();
    const { data: rentClaims, isLoading: isLoadingRent } = useRentClaims();

    const movements = movementsResponse?.data || [];

    const movementColumns = [
        {
            header: 'Fecha',
            accessor: (mv: Movement) => (
                <span className="text-xs text-muted-foreground">
                    {new Date(mv.created_at).toLocaleString()}
                </span>
            )
        },
        {
            header: 'Usuario',
            accessor: (mv: Movement) => (
                <span className="font-medium text-xs">
                    {mv.user ? `${mv.user.name} ${mv.user.lastname}` : 'Anónimo'}
                </span>
            )
        },
        {
            header: 'Operación',
            accessor: (mv: Movement) => (
                <div className="flex items-center gap-2">
                    {getOperationIcon(mv.operation_type)}
                    <span className="text-xs font-bold">{mv.operation_type}</span>
                </div>
            )
        },
        {
            header: 'Monto',
            accessor: (mv: Movement) => (
                <span className={`font-mono font-bold text-xs ${getAmountColor(mv.operation_type)}`}>
                    {mv.total_indh} INDH
                </span>
            )
        },
        {
            header: 'Hash / Detalle',
            accessor: (mv: Movement) => (
                <div className="flex flex-col max-w-[200px]">
                    <span className="text-[10px] text-muted-foreground truncate">{mv.detail}</span>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-primary/80">
                        <span className="truncate">{mv.transaction_hash}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                    </div>
                </div>
            )
        }
    ];

    const rentColumns = [
        {
            header: 'Fecha',
            accessor: (rc: RentClaim) => (
                <span className="text-xs text-muted-foreground">
                    {new Date(rc.created_at).toLocaleString()}
                </span>
            )
        },
        {
            header: 'Usuario',
            accessor: (rc: RentClaim) => (
                <span className="font-medium text-xs">
                    {rc.user ? `${rc.user.name} ${rc.user.lastname}` : 'Anónimo'}
                </span>
            )
        },
        {
            header: 'Propiedad',
            accessor: (rc: RentClaim) => (
                <span className="text-xs font-bold">
                    {(rc as any).propertyToken?.property?.name_reference || 'N/A'}
                </span>
            )
        },
        {
            header: 'Monto Reclamado',
            accessor: (rc: RentClaim) => (
                <span className="font-mono font-bold text-xs text-yellow-500">
                    {rc.amount} USDC
                </span>
            )
        },
        {
            header: 'Tipo',
            accessor: (rc: RentClaim) => (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/30 border border-border uppercase font-bold">
                    {rc.type || 'INDIVIDUAL'}
                </span>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Historial Financiero</h2>
                        <p className="text-muted-foreground">Registro de movimientos y reclamos de renta en la plataforma.</p>
                    </div>
                    <div className="flex bg-secondary/20 p-1 rounded-xl border border-border">
                        <button
                            onClick={() => setActiveTab('movements')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'movements' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-secondary'}`}
                        >
                            <TrendingUp className="w-3.5 h-3.5" />
                            Movimientos
                        </button>
                        <button
                            onClick={() => setActiveTab('rent')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'rent' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-secondary'}`}
                        >
                            <Coins className="w-3.5 h-3.5" />
                            Rentas
                        </button>
                    </div>
                </div>

                <div className="bg-secondary/10 border border-border rounded-2xl p-6">
                    {activeTab === 'movements' ? (
                        <DataTable
                            data={movements}
                            columns={movementColumns}
                            isLoading={isLoadingMovements}
                        />
                    ) : (
                        <DataTable
                            data={rentClaims || []}
                            columns={rentColumns}
                            isLoading={isLoadingRent}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

function getOperationIcon(type: string) {
    switch (type) {
        case 'BUY': return <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />;
        case 'SELL': return <ArrowUpRight className="w-3.5 h-3.5 text-destructive" />;
        case 'RENT_CLAIMED': return <Coins className="w-3.5 h-3.5 text-yellow-500" />;
        default: return <HistoryIcon className="w-3.5 h-3.5 text-primary" />;
    }
}

function getAmountColor(type: string) {
    switch (type) {
        case 'BUY': return 'text-emerald-500';
        case 'SELL': return 'text-destructive';
        case 'RENT_CLAIMED': return 'text-yellow-500';
        default: return 'text-foreground';
    }
}
