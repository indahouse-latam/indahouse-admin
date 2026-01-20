'use client';

import { useState } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { useCampaigns, Campaign } from "@/modules/campaigns/hooks/useCampaigns";
import { CreateCampaignModal } from "@/modules/campaigns/components/CreateCampaignModal";
import { RegisterPropertyModal } from "@/modules/campaigns/components/RegisterPropertyModal";
import {
    Building2,
    ExternalLink,
    Activity,
    Trash2,
    CheckCircle,
    AlertTriangle,
    Plus,
    Layout
} from "lucide-react";

export default function AssetsPage() {
    const { data: campaigns, isLoading, terminateCampaign, finalizeCampaign } = useCampaigns();
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

    const columns = [
        {
            header: 'Propiedad / Activo',
            accessor: (campaign: Campaign) => (
                <div className="flex flex-col">
                    <span className="font-medium">{campaign.property?.name_reference}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{campaign.property?.property_reference}</span>
                </div>
            )
        },
        {
            header: 'Campaña',
            accessor: (campaign: Campaign) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs">
                        <Activity className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono text-[10px]">{campaign.campaign_address}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-muted-foreground hover:text-primary cursor-pointer" />
                    </div>
                </div>
            )
        },
        {
            header: 'Progreso',
            accessor: (campaign: Campaign) => (
                <div className="w-40 space-y-1">
                    <div className="flex justify-between text-[10px]">
                        <span>{(campaign as any).stats?.fundingPercentage || 0}%</span>
                        <span className="text-muted-foreground">{(campaign as any).stats?.commitCount || 0} commits</span>
                    </div>
                    <div className="w-full bg-secondary/30 h-1.5 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 rounded-full ${(campaign as any).stats?.fundingPercentage && (campaign as any).stats.fundingPercentage >= 100 ? 'bg-primary' : 'bg-primary/60'}`}
                            style={{ width: `${Math.min((campaign as any).stats?.fundingPercentage || 0, 100)}%` }}
                        />
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (campaign: Campaign) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(campaign.status)}`}>
                    {campaign.status.toUpperCase()}
                </span>
            )
        },
        {
            header: 'Acciones',
            className: 'text-right',
            accessor: (campaign: Campaign) => (
                <div className="flex items-center justify-end gap-2">
                    {campaign.status === 'active' && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); finalizeCampaign(campaign.id); }}
                                className="p-1.5 hover:bg-primary/10 text-primary rounded-md transition-colors"
                                title="Finalizar Campaña"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); terminateCampaign(campaign.id); }}
                                className="p-1.5 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                                title="Cancelar Campaña"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Activos & Campañas</h2>
                        <p className="text-muted-foreground">Administra las propiedades y sus estados de financiamiento en la blockchain.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsPropertyModalOpen(true)}
                            className="bg-secondary hover:bg-secondary/80 border border-border px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm"
                        >
                            <Building2 className="w-4 h-4" />
                            Registrar Propiedad
                        </button>
                        <button
                            onClick={() => setIsCampaignModalOpen(true)}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" />
                            Lanzar Campaña
                        </button>
                    </div>
                </div>

                <div className="bg-secondary/10 border border-border rounded-2xl p-6">
                    <DataTable
                        data={campaigns || []}
                        columns={columns}
                        isLoading={isLoading}
                        onRowClick={(campaign) => console.log('View campaign detail', campaign.id)}
                    />
                </div>
            </div>

            <CreateCampaignModal
                isOpen={isCampaignModalOpen}
                onClose={() => setIsCampaignModalOpen(false)}
            />

            <RegisterPropertyModal
                isOpen={isPropertyModalOpen}
                onClose={() => setIsPropertyModalOpen(false)}
            />
        </AdminLayout>
    );
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'finalized': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
        case 'expired': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
}
