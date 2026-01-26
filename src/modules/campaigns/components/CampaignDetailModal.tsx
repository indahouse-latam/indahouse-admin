'use client';

import { X, Building2, DollarSign, Calendar, Hash, TrendingUp, Clock } from 'lucide-react';
import { Campaign } from '../hooks/useCampaigns';

interface CampaignDetailModalProps {
    campaign: Campaign;
    isOpen: boolean;
    onClose: () => void;
}

export function CampaignDetailModal({ campaign, isOpen, onClose }: CampaignDetailModalProps) {
    if (!isOpen) return null;

    const propertyName = (campaign.property as any)?.nameReference ||
                        campaign.property?.name_reference ||
                        'Sin nombre';
    const propertyRef = (campaign.property as any)?.propertyReference ||
                       (campaign.property as any)?.property_reference ||
                       'N/A';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-background border border-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border bg-secondary/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-primary/20 p-2 rounded-lg">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{propertyName}</h3>
                                    <p className="text-xs text-muted-foreground font-mono">{propertyRef}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(campaign.status)}`}>
                                    {campaign.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Campaign Addresses */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase text-primary/80">Blockchain Addresses</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                                <label className="text-xs font-bold text-muted-foreground">Campaign Address</label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="font-mono text-xs break-all">{(campaign as any).campaignAddress || campaign.campaign_address}</span>
                                </div>
                            </div>
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                                <label className="text-xs font-bold text-muted-foreground">Token Address</label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="font-mono text-xs break-all">{(campaign as any).tokenAddress || campaign.token_address}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase text-primary/80">Financial Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    Min Cap
                                </label>
                                <p className="text-lg font-bold mt-1">${(campaign as any).minCap || campaign.min_cap} USDC</p>
                            </div>
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    Max Cap
                                </label>
                                <p className="text-lg font-bold mt-1">${(campaign as any).maxCap || campaign.max_cap} USDC</p>
                            </div>
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Price/Token
                                </label>
                                <p className="text-lg font-bold mt-1">${(campaign as any).pricePerToken || campaign.price_per_token} USDC</p>
                            </div>
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                                <label className="text-xs font-bold text-muted-foreground">Status</label>
                                <p className="text-lg font-bold mt-1 capitalize">{campaign.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase text-primary/80">Timeline</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-border">
                                <Calendar className="w-4 h-4 text-primary" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-muted-foreground">Start Time</p>
                                    <p className="text-sm">{formatDate((campaign as any).startTime || campaign.start_time)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-border">
                                <Clock className="w-4 h-4 text-primary" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-muted-foreground">Commit Deadline</p>
                                    <p className="text-sm">{formatDate((campaign as any).commitDeadline || campaign.commit_deadline)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-border">
                                <Calendar className="w-4 h-4 text-primary" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-muted-foreground">Execute After</p>
                                    <p className="text-sm">{formatDate((campaign as any).executeAfter || campaign.execute_after)}</p>
                                </div>
                            </div>
                            {campaign.finalized_at && (
                                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-primary">Finalized At</p>
                                        <p className="text-sm">{formatDate((campaign as any).finalizedAt || campaign.finalized_at)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fee Tiers */}
                    {(campaign as any).fee_tiers && (campaign as any).fee_tiers.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase text-primary/80">Fee Tiers</h4>
                            <div className="space-y-2">
                                {(campaign as any).fee_tiers.map((tier: any, index: number) => (
                                    <div key={tier.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-sm font-bold">{tier.tierOrder || tier.tier_order}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Deadline</p>
                                                <p className="text-sm font-medium">
                                                    {formatDate(tier.deadlineTimestamp || tier.deadline_timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Fee</p>
                                            <p className="text-sm font-bold">{tier.feeBp || tier.fee_bp} BPS</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-secondary/5">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-bold"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
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
