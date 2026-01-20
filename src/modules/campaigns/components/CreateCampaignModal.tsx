'use client';

import { useState } from 'react';
import { X, Calendar, DollarSign, MapPin, Hash, Plus, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { useMarkets } from '@/modules/markets/hooks/useMarkets';
import { useCampaigns } from '../hooks/useCampaigns';
import { useContracts } from '@/hooks/useContracts';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData, parseUnits } from 'viem';
import { CommitFactoryAbi } from '@/config/abis';
import { CONTRACTS, DEFAULT_CHAIN_ID } from '@/config/contracts';

interface FeeTier {
    tier_order: number;
    deadline_timestamp: string;
    fee_bp: number;
}

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
    const { contracts } = useContracts();
    const { data: marketsData } = useMarkets();
    const properties = marketsData?.properties || [];
    const { createCampaign, isCreating: isApiCreating } = useCampaigns();

    const { writeContract, data: txHash, isPending: isTxPending } = useWriteContract();
    const { isLoading: isWaitingForTx } = useWaitForTransactionReceipt({ hash: txHash });

    const [formData, setFormData] = useState({
        property_id: '',
        indaRoot: contracts.batch3.indaRootProxy,
        baseToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC Base Sepolia
        campaignOwner: contracts.batch2.indaAdmin,
        token_address: '',
        min_cap: '100', // In USD
        max_cap: '500', // In USD
        price_per_token: '1',
        start_time: new Date().toISOString().split('T')[0],
        commit_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        execute_after: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const [feeTiers, setFeeTiers] = useState<FeeTier[]>([
        { tier_order: 1, deadline_timestamp: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fee_bp: 50 },
        { tier_order: 2, deadline_timestamp: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fee_bp: 100 },
        { tier_order: 3, deadline_timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fee_bp: 150 },
    ]);

    if (!isOpen) return null;

    const addFeeTier = () => {
        setFeeTiers([
            ...feeTiers,
            {
                tier_order: feeTiers.length + 1,
                deadline_timestamp: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                fee_bp: 200
            }
        ]);
    };

    const removeFeeTier = (index: number) => {
        const newTiers = feeTiers.filter((_, i) => i !== index).map((tier, i) => ({ ...tier, tier_order: i + 1 }));
        setFeeTiers(newTiers);
    };

    const updateFeeTier = (index: number, field: keyof FeeTier, value: any) => {
        const newTiers = [...feeTiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setFeeTiers(newTiers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 1. Prepare on-chain data
            const startTime = Math.floor(new Date(formData.start_time).getTime() / 1000);
            const commitDeadline = Math.floor(new Date(formData.commit_deadline).getTime() / 1000);
            const executeAfter = Math.floor(new Date(formData.execute_after).getTime() / 1000);

            const minCap = parseUnits(formData.min_cap, 6); // Assuming USDC 6 decimals
            const maxCap = parseUnits(formData.max_cap, 6);

            const encodedFeeTiers = feeTiers.map(tier => [
                BigInt(Math.floor(new Date(tier.deadline_timestamp).getTime() / 1000)),
                Number(tier.fee_bp)
            ]);

            const initData = encodeFunctionData({
                abi: [
                    {
                        "inputs": [
                            { "name": "_indaRoot", "type": "address" },
                            { "name": "_baseToken", "type": "address" },
                            { "name": "_owner", "type": "address" },
                            { "name": "_paymentTier", "type": "uint8" },
                            { "name": "_tokenAddress", "type": "address" },
                            { "name": "_startTime", "type": "uint256" },
                            { "name": "_commitDeadline", "type": "uint256" },
                            { "name": "_executeAfter", "type": "uint256" },
                            { "name": "_minCap", "type": "uint256" },
                            { "name": "_maxCap", "type": "uint256" },
                            {
                                "name": "_feeTiers", "type": "tuple[]", "components": [
                                    { "name": "deadline", "type": "uint256" },
                                    { "name": "fee_bp", "type": "uint16" }
                                ]
                            }
                        ],
                        "name": "initialize",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                functionName: 'initialize',
                args: [
                    formData.indaRoot as `0x${string}`,
                    formData.baseToken as `0x${string}`,
                    formData.campaignOwner as `0x${string}`,
                    1,
                    formData.token_address as `0x${string}`,
                    BigInt(startTime),
                    BigInt(commitDeadline),
                    BigInt(executeAfter),
                    minCap,
                    maxCap,
                    encodedFeeTiers as any
                ]
            });

            // 2. Transact on-chain
            writeContract({
                address: contracts.batch3.commitFactory as `0x${string}`,
                abi: CommitFactoryAbi,
                functionName: 'createCampaign',
                args: [initData],
            }, {
                onSuccess: (txHash) => {
                    console.log('Transaction sent:', txHash);
                    // placeholder for campaign address - real address will be synced by backend or extracted from events
                    const generatedCampaignAddress = "0x" + "0".repeat(40);

                    createCampaign({
                        ...formData,
                        campaign_address: generatedCampaignAddress,
                        fee_tiers: feeTiers.map(t => ({
                            ...t,
                            deadline_timestamp: new Date(t.deadline_timestamp).toISOString()
                        }))
                    }, {
                        onSuccess: () => {
                            onClose();
                        }
                    });
                }
            });

        } catch (error) {
            console.error('Failed to create campaign:', error);
        }
    };

    const isPending = isTxPending || isWaitingForTx || isApiCreating;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-foreground">
            <div className="bg-background border border-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2.5 rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Lanzar Nueva Campaña On-Chain</h3>
                            <p className="text-xs text-muted-foreground">Configura los parámetros del contrato y despliega en la blockchain.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
                    {/* Section 1: Property and Basic Info */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary/80 mb-4 block">
                            1. Propiedad y Direcciones Base
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Seleccionar Propiedad</label>
                                <select
                                    className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary h-[42px]"
                                    value={formData.property_id}
                                    onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Seleccione una propiedad...</option>
                                    {properties.map((prop: any) => (
                                        <option key={prop.id} value={prop.id}>{prop.name_reference}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Token de la Propiedad (address)</label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-secondary/20 border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="0x..."
                                        value={formData.token_address}
                                        onChange={(e) => setFormData({ ...formData, token_address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">IndaRoot Address</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-secondary/10 border border-border/50 rounded-lg px-3 py-2 text-[11px] font-mono outline-none"
                                    value={formData.indaRoot}
                                    onChange={(e) => setFormData({ ...formData, indaRoot: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Base Token (USDC)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-secondary/10 border border-border/50 rounded-lg px-3 py-2 text-[11px] font-mono outline-none"
                                    value={formData.baseToken}
                                    onChange={(e) => setFormData({ ...formData, baseToken: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Campaign Owner (Admin)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-secondary/10 border border-border/50 rounded-lg px-3 py-2 text-[11px] font-mono outline-none"
                                    value={formData.campaignOwner}
                                    onChange={(e) => setFormData({ ...formData, campaignOwner: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Timing and Caps */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary/80 mb-4 block">
                            2. Tiempos y Límites de Inversión
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Start Time</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2 text-sm"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Commit Deadline</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2 text-sm"
                                    value={formData.commit_deadline}
                                    onChange={(e) => setFormData({ ...formData, commit_deadline: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Execution After</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2 text-sm"
                                    value={formData.execute_after}
                                    onChange={(e) => setFormData({ ...formData, execute_after: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Min Cap (USDC)</label>
                                <div className="relative">
                                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-secondary/20 border border-border rounded-lg pl-10 pr-4 py-2 text-sm"
                                        value={formData.min_cap}
                                        onChange={(e) => setFormData({ ...formData, min_cap: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Max Cap (USDC)</label>
                                <div className="relative">
                                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-secondary/20 border border-border rounded-lg pl-10 pr-4 py-2 text-sm"
                                        value={formData.max_cap}
                                        onChange={(e) => setFormData({ ...formData, max_cap: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Precio / Token (USDC)</label>
                                <div className="relative">
                                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        className="w-full bg-secondary/20 border border-border rounded-lg pl-10 pr-4 py-2 text-sm"
                                        value={formData.price_per_token}
                                        onChange={(e) => setFormData({ ...formData, price_per_token: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Fee Tiers */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-primary/80">
                                3. Fee Tiers (Comisiones por época)
                            </label>
                            <button
                                type="button"
                                onClick={addFeeTier}
                                className="flex items-center gap-1.5 text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                                Añadir Tier
                            </button>
                        </div>

                        <div className="space-y-3">
                            {feeTiers.map((tier, index) => (
                                <div key={index} className="flex items-end gap-4 p-4 rounded-xl bg-secondary/10 border border-border/50 group">
                                    <div className="w-12 space-y-2 text-center">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Tier</span>
                                        <div className="h-9 flex items-center justify-center font-bold text-sm bg-background border border-border rounded-lg">
                                            {tier.tier_order}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Límite de Tiempo (Deadline)</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm"
                                            value={tier.deadline_timestamp}
                                            onChange={(e) => updateFeeTier(index, 'deadline_timestamp', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-32 space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Comisión (BP)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                required
                                                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm"
                                                value={tier.fee_bp}
                                                onChange={(e) => updateFeeTier(index, 'fee_bp', e.target.value)}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-mono">BPS</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFeeTier(index)}
                                        className="p-2 mb-0.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-6 border-t border-border flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-bold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !formData.property_id}
                            className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                'Lanzar Campaña On-Chain'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
