'use client';

import { useParams } from 'next/navigation';
import { AdminLayout } from "@/components/AdminLayout";
import { useCampaigns, Campaign } from "@/modules/campaigns/hooks/useCampaigns";
import {
    ArrowLeft,
    Copy,
    ExternalLink,
    Building2,
    Coins,
    FileText,
    ShieldCheck,
    Percent
} from "lucide-react";
import Link from 'next/link';

export default function CampaignDetailPage() {
    const { id } = useParams();
    const { data: campaigns, isLoading } = useCampaigns();

    // Find the campaign in the list (or fetch it specifically in a real app)
    const campaign = campaigns?.find(c => c.id === id);

    if (isLoading) return <AdminLayout><div>Cargando...</div></AdminLayout>;
    if (!campaign) return <AdminLayout><div>Campaña no encontrada.</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/assets" className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{campaign.property?.name_reference}</h2>
                        <p className="text-muted-foreground">Detalles técnicos de la campaña y activos vinculados.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Token Info Section */}
                        <div className="bg-secondary/10 border border-border rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-border bg-secondary/20">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Coins className="w-4 h-4 text-primary" />
                                    Información de Tokens
                                </h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem
                                    label="Underlying Token (USDC)"
                                    value="0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
                                    icon={<div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                    isAddress
                                />
                                <DetailItem
                                    label="Property Token (PT)"
                                    value="0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
                                    icon={<div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                                    isAddress
                                />
                                <DetailItem
                                    label="Campaign Contract"
                                    value={campaign.campaign_address}
                                    icon={<ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                                    isAddress
                                />
                                <DetailItem
                                    label="Price per Token"
                                    value="1.00 USDC"
                                    icon={<Percent className="w-3.5 h-3.5 text-yellow-500" />}
                                />
                            </div>
                        </div>

                        {/* Campaign Metrics */}
                        <div className="bg-secondary/10 border border-border rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <MetricItem label="Capa Mínima" value={`$${(Number(campaign.min_cap) / 1e6).toLocaleString()} USDC`} />
                            <MetricItem label="Capa Máxima" value={`$${(Number(campaign.max_cap) / 1e6).toLocaleString()} USDC`} />
                            <MetricItem label="Total Recaudado" value={`$${(Number(campaign.stats?.totalCommitted || 0) / 1e6).toLocaleString()} USDC`} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-secondary/10 border border-border rounded-2xl p-6 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 border-b border-border pb-4 mb-4">
                                <FileText className="w-4 h-4 text-primary" />
                                Certificado (CMD)
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-background rounded-xl border border-border space-y-2">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Membership Certificate Address</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono truncate">0x5FbDB2315678...</span>
                                        <Copy className="w-3 h-3 cursor-pointer hover:text-primary" />
                                    </div>
                                </div>
                                <button className="w-full bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Ver en Explorer
                                </button>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-4">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Estado de Activo</p>
                            <div className="text-2xl font-bold text-primary">OPERATIVO</div>
                            <p className="text-[10px] text-muted-foreground">La propiedad está generando rentas y la campaña administrativa ha sido verificada.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function DetailItem({ label, value, icon, isAddress }: { label: string; value: string; icon: React.ReactNode; isAddress?: boolean }) {
    return (
        <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                {icon}
                {label}
            </p>
            <div className="flex items-center justify-between gap-2 p-2 bg-background rounded-lg border border-border">
                <span className={`text-xs ${isAddress ? 'font-mono' : 'font-medium'}`}>{isAddress ? `${value.slice(0, 8)}...${value.slice(-6)}` : value}</span>
                {isAddress && <Copy className="w-3 h-3 text-muted-foreground hover:text-primary cursor-pointer" />}
            </div>
        </div>
    );
}

function MetricItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1 text-center md:text-left">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
