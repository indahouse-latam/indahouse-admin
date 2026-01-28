'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Hash, Plus, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import { useContracts } from '@/hooks/useContracts';
import { encodeFunctionData, parseUnits, decodeEventLog, Abi } from 'viem';
import { CommitCampaignFactoryAbi } from '@/config/abis';
import { CONTRACTS, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { executeAndWaitForTransaction } from '@/utils/blockchain.utils';
import { usePropertyTokens } from '@/modules/properties/hooks/usePropertyTokens';
import { useMarkets } from '@/modules/markets/hooks/useMarkets';
import { toast } from 'sonner';
import { fetchApi } from '@/utils/api';

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
    const { data: propertyTokens, isLoading: isLoadingTokens } = usePropertyTokens();
    const { data: marketsData } = useMarkets();
    const { createCampaign } = useCampaigns();

    const properties = marketsData?.properties || [];

    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<'creating' | 'confirming' | 'saving' | null>(null);
    const [propertyTokensWithNames, setPropertyTokensWithNames] = useState<Array<{
        token: any;
        propertyName: string;
    }>>([]);

    const [formData, setFormData] = useState({
        property_token_id: '',
        campaign_type: 1, // Default: SINGLE_PROPERTY
        indaRoot: CONTRACTS.polygonAmoy.indaRoot,
        baseToken: CONTRACTS.polygonAmoy.usdc,
        campaignOwner: CONTRACTS.polygonAmoy.indaAdmin,
        token_address: '',
        min_cap: '100',
        max_cap: '500',
        price_per_token: '1',
        start_time: new Date().toISOString().split('T')[0],
        commit_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        execute_after: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        network: 'polygonAmoy' as 'baseSepolia' | 'polygonAmoy',
    });

    const [feeTiers, setFeeTiers] = useState<FeeTier[]>([
        { tier_order: 1, deadline_timestamp: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fee_bp: 50 },
        { tier_order: 2, deadline_timestamp: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fee_bp: 100 },
        { tier_order: 3, deadline_timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fee_bp: 150 },
    ]);

    useEffect(() => {
        if (!propertyTokens || !properties.length) return;

        console.log('🔍 Property Tokens:', propertyTokens);
        console.log('🏠 Properties:', properties);

        const tokensWithNames = propertyTokens.map((token) => {
            const propertyId = token.propertyUuid || token.property_uuid;
            const property = properties.find((p: any) => p.id === propertyId);
            const propertyName = property?.nameReference || property?.name_reference || 'Unknown Property';

            console.log(`✅ Token ${token.id} -> Property ${propertyId} -> Name: ${propertyName}`);
            console.log(`   Token Address: ${token.tokenAddress || token.token_address}`);

            return {
                token,
                propertyName
            };
        });

        setPropertyTokensWithNames(tokensWithNames);
    }, [propertyTokens, properties]);

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

        if (!formData.property_token_id || !formData.token_address) {
            toast.error('Please select a property token');
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Prepare blockchain data
            setLoadingStep('creating');
            console.log('📝 Creating campaign on blockchain...');

            const chainId = DEFAULT_CHAIN_ID;

            const startTime = Math.floor(new Date(formData.start_time).getTime() / 1000);
            const commitDeadline = Math.floor(new Date(formData.commit_deadline).getTime() / 1000);
            const executeAfter = Math.floor(new Date(formData.execute_after).getTime() / 1000);

            const minCap = parseUnits(formData.min_cap, 6);
            const maxCap = parseUnits(formData.max_cap, 6);

            const encodedFeeTiers = feeTiers.map(tier => [
                BigInt(Math.floor(new Date(tier.deadline_timestamp).getTime() / 1000)),
                Number(tier.fee_bp)
            ]);

            // Encode the initialization data for the campaign
            const initData = encodeFunctionData({
                abi: [
                    {
                        "inputs": [
                            { "name": "_indaRoot", "type": "address" },
                            { "name": "_baseToken", "type": "address" },
                            { "name": "_owner", "type": "address" },
                            { "name": "_campaignType", "type": "uint8" },
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
                    formData.campaign_type,
                    formData.token_address as `0x${string}`,
                    BigInt(startTime),
                    BigInt(commitDeadline),
                    BigInt(executeAfter),
                    minCap,
                    maxCap,
                    encodedFeeTiers as any
                ]
            });

            console.log('📦 Init Data:', initData);

            // Step 2: Execute transaction and wait for confirmation
            const { hash, receipt } = await executeAndWaitForTransaction({
                contractAddress: CONTRACTS.polygonAmoy.commitFactory as `0x${string}`,
                abi: CommitCampaignFactoryAbi as Abi,
                functionName: 'createCampaign',
                args: [initData],
                chainId,
            });

            console.log('✅ Transaction confirmed:', hash);

            // Step 3: Parse CampaignCreated event
            setLoadingStep('confirming');
            const log = receipt.logs.find((log) => {
                try {
                    const decoded = decodeEventLog({
                        abi: CommitCampaignFactoryAbi,
                        data: log.data,
                        topics: log.topics,
                    });
                    return decoded.eventName === 'CampaignCreated';
                } catch {
                    return false;
                }
            });

            if (!log) {
                throw new Error('CampaignCreated event not found in transaction receipt');
            }

            const decoded = decodeEventLog({
                abi: CommitCampaignFactoryAbi,
                data: log.data,
                topics: log.topics,
            });
            const campaignAddress = decoded?.args?.campaign as string;

            console.log('🎯 Campaign created at address:', campaignAddress);

            // Step 4: Save to database
            setLoadingStep('saving');

            // Get the property_id from the selected token
            const selectedToken = propertyTokens?.find(t => t.id === formData.property_token_id);
            const propertyId = selectedToken?.propertyUuid || selectedToken?.property_uuid;

            if (!propertyId) {
                throw new Error('Property ID not found for selected token');
            }

            await new Promise<void>((resolve, reject) => {
                createCampaign({
                    property_id: propertyId,
                    campaign_address: campaignAddress,
                    token_address: formData.token_address,
                    min_cap: formData.min_cap,
                    max_cap: formData.max_cap,
                    start_time: formData.start_time,
                    commit_deadline: formData.commit_deadline,
                    execute_after: formData.execute_after,
                    price_per_token: formData.price_per_token,
                    fee_tiers: feeTiers.map(t => ({
                        ...t,
                        deadline_timestamp: new Date(t.deadline_timestamp).toISOString()
                    }))
                }, {
                    onSuccess: () => {
                        console.log('✅ Campaign saved to database');
                        resolve();
                    },
                    onError: (error: any) => {
                        reject(error);
                    },
                });
            });

            // Step 5: Update property with campaign_contract_hash
            console.log('📝 Updating property with campaign contract hash...');
            await fetchApi(`/properties/${propertyId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    campaign_contract_hash: campaignAddress
                })
            });
            console.log('✅ Property updated with campaign contract hash');

            // Success!
            toast.success('Campaign created successfully!', {
                description: `Campaign address: ${campaignAddress}`,
                duration: 20000
            });

            // Reset form
            setFormData({
                property_token_id: '',
                campaign_type: 1,
                indaRoot: CONTRACTS.polygonAmoy.indaRoot,
                baseToken: CONTRACTS.polygonAmoy.usdc,
                campaignOwner: CONTRACTS.polygonAmoy.indaAdmin,
                token_address: '',
                min_cap: '100',
                max_cap: '500',
                price_per_token: '1',
                start_time: new Date().toISOString().split('T')[0],
                commit_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                execute_after: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                network: 'polygonAmoy',
            });
            onClose();

        } catch (error: any) {
            console.error('❌ Error creating campaign:', error);
            toast.error('Failed to create campaign', {
                description: error.message || 'Unknown error occurred',
            });
        } finally {
            setIsLoading(false);
            setLoadingStep(null);
        }
    };

    const getLoadingMessage = () => {
        if (loadingStep === 'creating') return 'Creating campaign...';
        if (loadingStep === 'confirming') return 'Confirming transaction...';
        if (loadingStep === 'saving') return 'Saving to database...';
        return 'Finalizing...';
    };

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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                                    Seleccionar Property Token {propertyTokensWithNames.length > 0 && `(${propertyTokensWithNames.length})`}
                                </label>
                                <select
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary h-[42px]"
                                    value={formData.property_token_id}
                                    onChange={(e) => {
                                        const selectedTokenId = e.target.value;
                                        const selectedTokenItem = propertyTokensWithNames.find(item => item.token.id === selectedTokenId);
                                        const tokenAddr = selectedTokenItem?.token.tokenAddress || selectedTokenItem?.token.token_address || '';

                                        console.log('📌 Selected:', { selectedTokenId, tokenAddr, item: selectedTokenItem });

                                        setFormData({
                                            ...formData,
                                            property_token_id: selectedTokenId,
                                            token_address: tokenAddr
                                        });
                                    }}
                                    required
                                    disabled={isLoadingTokens || isLoading}
                                >
                                    <option value="" disabled>Seleccione un property token...</option>
                                    {isLoadingTokens ? (
                                        <option value="" disabled>Cargando tokens...</option>
                                    ) : propertyTokensWithNames.length === 0 ? (
                                        <option value="" disabled>No hay property tokens disponibles</option>
                                    ) : (
                                        propertyTokensWithNames.map((item) => (
                                            <option key={item.token.id} value={item.token.id}>
                                                {item.propertyName} - {item.token.symbol}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Campaign Type</label>
                                <select
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary h-[42px]"
                                    value={formData.campaign_type}
                                    onChange={(e) => setFormData({ ...formData, campaign_type: Number(e.target.value) })}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value={0}>Pool INDH</option>
                                    <option value={1}>Single Property</option>
                                    <option value={2}>Custom Token</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Token Address (auto-populated)</label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full bg-secondary/20 border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none cursor-not-allowed opacity-60"
                                        placeholder="Select a property token first..."
                                        value={formData.token_address}
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
                            disabled={isLoading || !formData.property_token_id}
                            className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {getLoadingMessage()}
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
