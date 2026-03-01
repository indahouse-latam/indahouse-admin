'use client';

import { X, Building2, DollarSign, Calendar, Hash, TrendingUp, Clock } from 'lucide-react';
import { Campaign } from '../hooks/useCampaigns';
import { CommitCampaignAbi } from '@/config/abis/commit-campaing.abi';
import { IndaAdminRouterAbi } from '@/config/abis/inda-admin-router.abi';
import { currentContracts, DEFAULT_CHAIN_ID } from '@/config/contracts';
import {
    executeContractWrite,
    createUserPublicClient,
    waitForTransaction
} from '@/utils/blockchain.utils';
import { fetchApi } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Abi, Hash as ViemHash, parseAbi } from 'viem';
import { useState, useEffect } from 'react';

interface CampaignDetailModalProps {
    campaign: Campaign;
    isOpen: boolean;
    onClose: () => void;
}

interface FinalizationState {
    totalCommitted: bigint | null;
    campaignOwner: string | null;
    executeAfter: bigint | null;
    currentTime: bigint;
    investorCount: bigint | null;
    currentBatch: number;
    totalBatches: number;
    step1Status: 'idle' | 'checking' | 'approved' | 'approving' | 'failed';
    step2Status: 'idle' | 'executing' | 'completed' | 'failed';
    step1Error: string | null;
    step2Error: string | null;
    step1Hash: ViemHash | null;
    step2Hashes: ViemHash[];
    countryCode: `0x${string}` | null;
    preflightIssues: string[];
}
const BATCH_SIZE = 50;

export function CampaignDetailModal({ campaign, isOpen, onClose }: CampaignDetailModalProps) {
    const queryClient = useQueryClient();
    const [finState, setFinState] = useState<FinalizationState>({
        totalCommitted: null,
        campaignOwner: null,
        executeAfter: null,
        currentTime: BigInt(0),
        investorCount: null,
        currentBatch: 0,
        totalBatches: 0,
        step1Status: 'idle',
        step2Status: 'idle',
        step1Error: null,
        step2Error: null,
        step1Hash: null,
        step2Hashes: [],
        countryCode: null,
        preflightIssues: []
    });

    console.log('Campaign data:', campaign);

    useEffect(() => {
        const campaignAddr = (campaign as any).campaignAddress || campaign.campaign_address;
        console.log('🔍 CampaignDetailModal Effect:', {
            isOpen,
            status: campaign.status,
            hasAddress: !!campaignAddr,
            address: campaignAddr
        });

        if (isOpen && campaign.status === 'active' && campaignAddr) {
            console.log('✅ Loading prerequisites for campaign:', campaignAddr);
            checkPrerequisites();
        }
    }, [isOpen, (campaign as any).campaignAddress, campaign.campaign_address, campaign.status]);

    const checkPrerequisites = async () => {
        try {
            console.log('🔄 Starting prerequisites check...');
            setFinState(prev => ({ ...prev, step1Status: 'checking', step1Error: null }));

            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
            const campaignAddr = ((campaign as any).campaignAddress || campaign.campaign_address) as `0x${string}`;
            const tokenAddress = ((campaign as any).tokenAddress || (campaign as any).token_address) as `0x${string}`;
            const preflightIssues: string[] = [];

            console.log('📡 Reading contract data from:', campaignAddr);

            const [totalCommitted, campaignOwner, executeAfter, investorCount] = await Promise.all([
                publicClient.readContract({
                    address: campaignAddr,
                    abi: CommitCampaignAbi,
                    functionName: 'totalCommitted',
                }),
                publicClient.readContract({
                    address: campaignAddr,
                    abi: CommitCampaignAbi,
                    functionName: 'campaignOwner',
                }),
                publicClient.readContract({
                    address: campaignAddr,
                    abi: CommitCampaignAbi,
                    functionName: 'executeAfter',
                }),
                publicClient.readContract({
                    address: campaignAddr,
                    abi: CommitCampaignAbi,
                    functionName: 'getInvestorCount',
                })
            ]);

            const currentTime = BigInt(Math.floor(Date.now() / 1000));

            const minCap = (campaign as any).minCap || campaign.min_cap || '0';
            const investors = investorCount as bigint;
            const totalBatches = investors > BigInt(0) ? Math.ceil(Number(investors) / BATCH_SIZE) : 1;
            let dynamicCountryCode: `0x${string}` | null = null;

            try {
                // Resolve dynamic countryCode from token -> property on-chain
                const propertyRegistry = await publicClient.readContract({
                    address: currentContracts.indaRoot as `0x${string}`,
                    abi: parseAbi(['function propertyRegistry() view returns (address)']),
                    functionName: 'propertyRegistry',
                }) as `0x${string}`;

                const propertyId = await publicClient.readContract({
                    address: propertyRegistry,
                    abi: parseAbi(['function tokenToPropertyId(address) view returns (uint256)']),
                    functionName: 'tokenToPropertyId',
                    args: [tokenAddress],
                }) as bigint;

                if (propertyId === BigInt(0)) {
                    preflightIssues.push('Token is not mapped to a property in PropertyRegistry.');
                } else {
                    const property = await publicClient.readContract({
                        address: propertyRegistry,
                        abi: parseAbi([
                            'function getProperty(uint256) view returns ((address,bytes32,string,uint256,uint256,uint64,uint64,uint120,uint8,uint256,uint256,uint256))'
                        ]),
                        functionName: 'getProperty',
                        args: [propertyId],
                    }) as any;

                    dynamicCountryCode = property[1] as `0x${string}`;
                    const pricePerToken = property[4] as bigint;
                    const propertyStatus = Number(property[8]);
                    if (pricePerToken === BigInt(0)) preflightIssues.push('Property pricePerToken is zero.');
                    if (propertyStatus !== 1) preflightIssues.push(`Property status is not ACTIVE (status=${propertyStatus}).`);
                }
            } catch (error) {
                console.error('Error resolving dynamic country code:', error);
                preflightIssues.push('Could not resolve country code from token/property on-chain.');
            }

            if (!dynamicCountryCode) preflightIssues.push('Missing dynamic country code for finalization.');

            // Additional preflight checks for clear UI errors before finalization
            if (dynamicCountryCode) {
                try {
                    const managerFromRegistry = await publicClient.readContract({
                        address: currentContracts.indahouseRegistry as `0x${string}`,
                        abi: parseAbi(['function getManager(bytes32) view returns (address)']),
                        functionName: 'getManager',
                        args: [dynamicCountryCode],
                    }) as `0x${string}`;
                    const zeroAddress = '0x0000000000000000000000000000000000000000';
                    if (!managerFromRegistry || managerFromRegistry === zeroAddress) {
                        preflightIssues.push('No manager found in registry for resolved country code.');
                    } else {
                        const [campaignRegistered, poolInfo] = await Promise.all([
                            publicClient.readContract({
                                address: managerFromRegistry,
                                abi: parseAbi(['function registeredCampaigns(address) view returns (bool)']),
                                functionName: 'registeredCampaigns',
                                args: [campaignAddr],
                            }) as Promise<boolean>,
                            publicClient.readContract({
                                address: managerFromRegistry,
                                abi: parseAbi(['function getPoolInfo() view returns (address,address,address,bool)']),
                                functionName: 'getPoolInfo',
                            }) as Promise<readonly [`0x${string}`, `0x${string}`, `0x${string}`, boolean]>,
                        ]);

                        if (!campaignRegistered) preflightIssues.push('Campaign is not registered in resolved manager.');

                        const poolVault = poolInfo[2];
                        const criticalAddresses: `0x${string}`[] = [
                            currentContracts.IndaAdminRouter as `0x${string}`,
                            campaignAddr,
                        ];
                        if (poolVault && poolVault !== zeroAddress) criticalAddresses.push(poolVault);

                        const investorAddresses = await publicClient.readContract({
                            address: campaignAddr,
                            abi: parseAbi(['function getInvestors() view returns (address[])']),
                            functionName: 'getInvestors',
                        }) as `0x${string}`[];

                        const tokenDistributor = await publicClient.readContract({
                            address: tokenAddress,
                            abi: parseAbi(['function indaDistributor() view returns (address)']),
                            functionName: 'indaDistributor',
                        }) as `0x${string}`;
                        const [shareToken, rewardToken, indaRootOnDistributor] = await Promise.all([
                            publicClient.readContract({
                                address: tokenDistributor,
                                abi: parseAbi(['function shareToken() view returns (address)']),
                                functionName: 'shareToken',
                            }) as Promise<`0x${string}`>,
                            publicClient.readContract({
                                address: tokenDistributor,
                                abi: parseAbi(['function rewardToken() view returns (address)']),
                                functionName: 'rewardToken',
                            }) as Promise<`0x${string}`>,
                            publicClient.readContract({
                                address: tokenDistributor,
                                abi: parseAbi(['function indaRoot() view returns (address)']),
                                functionName: 'indaRoot',
                            }) as Promise<`0x${string}`>,
                        ]);

                        if (shareToken.toLowerCase() !== tokenAddress.toLowerCase()) {
                            preflightIssues.push('Token distributor shareToken mismatch.');
                        }
                        if (rewardToken.toLowerCase() !== (currentContracts.baseToken as string).toLowerCase()) {
                            preflightIssues.push('Token distributor rewardToken mismatch.');
                        }
                        if (indaRootOnDistributor.toLowerCase() !== (currentContracts.indaRoot as string).toLowerCase()) {
                            preflightIssues.push('Token distributor indaRoot mismatch.');
                        }

                        for (const inv of investorAddresses) {
                            criticalAddresses.push(inv);
                            const cmd = await publicClient.readContract({
                                address: managerFromRegistry,
                                abi: parseAbi(['function userCertificates(address) view returns (address)']),
                                functionName: 'userCertificates',
                                args: [inv],
                            }) as `0x${string}`;
                            if (cmd === zeroAddress) {
                                preflightIssues.push(`Investor ${inv.slice(0, 10)} has no CMD.`);
                            } else {
                                criticalAddresses.push(cmd);
                            }
                        }

                        const unique = [...new Set(criticalAddresses.map((a) => a.toLowerCase()))];
                        for (const addr of unique) {
                            const isWhitelisted = await publicClient.readContract({
                                address: currentContracts.indaRoot as `0x${string}`,
                                abi: parseAbi(['function whitelist(address) view returns (bool)']),
                                functionName: 'whitelist',
                                args: [addr as `0x${string}`],
                            }) as boolean;
                            if (!isWhitelisted) preflightIssues.push(`Address ${addr.slice(0, 10)} is not whitelisted.`);
                        }

                        const allowance = await publicClient.readContract({
                            address: currentContracts.baseToken as `0x${string}`,
                            abi: parseAbi(['function allowance(address,address) view returns (uint256)']),
                            functionName: 'allowance',
                            args: [campaignAddr, currentContracts.IndaAdminRouter as `0x${string}`],
                        }) as bigint;
                        if (allowance < (totalCommitted as bigint)) {
                            preflightIssues.push('Campaign allowance to IndaAdminRouter is insufficient (run approveFunds).');
                        }
                    }
                } catch (error) {
                    console.error('Error in finalization preflight checks:', error);
                    preflightIssues.push('Could not complete preflight checks due to contract read error.');
                }
            }

            console.log('✅ Prerequisites loaded:', {
                totalCommitted: totalCommitted?.toString(),
                campaignOwner,
                executeAfter: executeAfter?.toString(),
                executeAfterDate: new Date(Number(executeAfter) * 1000),
                currentTime: currentTime.toString(),
                currentDate: new Date(Number(currentTime) * 1000),
                minCap,
                investorCount: investors.toString(),
                totalBatches,
                countryCode: dynamicCountryCode,
                preflightIssuesCount: preflightIssues.length,
                isAfterExecuteTime: currentTime >= (executeAfter as bigint),
                isMinCapReached: minCap ? BigInt(minCap) <= (totalCommitted as bigint) : false
            });

            setFinState(prev => ({
                ...prev,
                totalCommitted: totalCommitted as bigint,
                campaignOwner: campaignOwner as string,
                executeAfter: executeAfter as bigint,
                currentTime,
                investorCount: investors,
                totalBatches,
                countryCode: dynamicCountryCode,
                preflightIssues,
                step1Status: 'idle',
                step1Error: null
            }));
        } catch (error: any) {
            console.error('❌ Error checking prerequisites:', error);
            setFinState(prev => ({
                ...prev,
                step1Status: 'failed',
                step1Error: error.message || 'Failed to load campaign data'
            }));
        }
    };

    const handleApproveFunds = async () => {
        setFinState(prev => ({ ...prev, step1Status: 'approving', step1Error: null }));

        try {
            const hash = await executeContractWrite({
                contractAddress: campaignAddr as `0x${string}`,
                abi: CommitCampaignAbi as Abi,
                functionName: 'approveFunds',
                args: [
                    currentContracts.IndaAdminRouter as `0x${string}`,
                    finState.totalCommitted!
                ],
                chainId: DEFAULT_CHAIN_ID
            });

            setFinState(prev => ({ ...prev, step1Hash: hash }));

            await waitForTransaction({ hash, chainId: DEFAULT_CHAIN_ID });

            setFinState(prev => ({ ...prev, step1Status: 'approved' }));
        } catch (error: any) {
            console.error('Error approving funds:', error);
            setFinState(prev => ({
                ...prev,
                step1Status: 'failed',
                step1Error: error.message || 'Transaction failed'
            }));
        }
    };

    const handleExecuteFinalization = async () => {
        setFinState(prev => ({ ...prev, step2Status: 'executing', step2Error: null, step2Hashes: [], currentBatch: 0 }));

        try {
            if (!finState.countryCode) {
                throw new Error('Missing dynamic countryCode. Please run prerequisites check again.');
            }
            const investors = Number(finState.investorCount || BigInt(0));
            const totalBatches = finState.totalBatches || 1;
            const hashes: ViemHash[] = [];

            for (let i = 0; i < totalBatches; i++) {
                const start = i * BATCH_SIZE;
                const count = Math.min(BATCH_SIZE, investors - start);

                setFinState(prev => ({ ...prev, currentBatch: i + 1 }));

                console.log(`🔄 Processing batch ${i + 1}/${totalBatches} (start: ${start}, count: ${count})`);

                const hash = await executeContractWrite({
                    contractAddress: currentContracts.IndaAdminRouter as `0x${string}`,
                    abi: IndaAdminRouterAbi as Abi,
                    functionName: 'finalizeAndDistributeCampaignBatched',
                    args: [
                        campaignAddr as `0x${string}`,
                        finState.countryCode as `0x${string}`,
                        tokenAddr as `0x${string}`,
                        currentContracts.baseToken as `0x${string}`,
                        currentContracts.indaRoot as `0x${string}`,
                        BigInt(start),
                        BigInt(count)
                    ],
                    chainId: DEFAULT_CHAIN_ID
                });

                hashes.push(hash);
                setFinState(prev => ({ ...prev, step2Hashes: [...hashes] }));

                await waitForTransaction({ hash, chainId: DEFAULT_CHAIN_ID });
                console.log(`✅ Batch ${i + 1}/${totalBatches} confirmed: ${hash}`);
            }

            await fetchApi(`/campaigns/${campaign.id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'finalized' })
            });

            queryClient.invalidateQueries({ queryKey: ['campaigns'] });

            setFinState(prev => ({ ...prev, step2Status: 'completed' }));
        } catch (error: any) {
            console.error('Error executing finalization:', error);
            const hasSilentRevert =
                (error?.message || '').toLowerCase().includes('execution reverted') &&
                finState.preflightIssues.length > 0;
            setFinState(prev => ({
                ...prev,
                step2Status: 'failed',
                step2Error: hasSilentRevert
                    ? `Preflight failed. First issue: ${finState.preflightIssues[0]}`
                    : `Batch ${prev.currentBatch}/${prev.totalBatches} failed: ${error.message || 'Transaction failed'}`
            }));
        }
    };

    const minCap = (campaign as any).minCap || campaign.min_cap || '0';
    const campaignAddr = (campaign as any).campaignAddress || campaign.campaign_address;
    const tokenAddr = (campaign as any).tokenAddress || (campaign as any).token_address;

    const canExecuteStep1 =
        campaign.status === 'active' &&
        finState.totalCommitted !== null &&
        finState.executeAfter !== null &&
        finState.currentTime >= finState.executeAfter &&
        minCap &&
        BigInt(minCap) <= finState.totalCommitted &&
        finState.step1Status === 'idle';

    const canExecuteStep2 =
        finState.step1Status === 'approved' &&
        !!finState.countryCode &&
        finState.preflightIssues.length === 0;

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
                                    <span className="font-mono text-xs break-all">{(campaign as any).tokenAddress || (campaign as any).token_address}</span>
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
                                <p className="text-lg font-bold mt-1">${(campaign as any).pricePerToken || (campaign as any).price_per_token} USDC</p>
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
                                    <p className="text-sm">{formatDate((campaign as any).startTime || (campaign as any).start_time)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-border">
                                <Clock className="w-4 h-4 text-primary" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-muted-foreground">Commit Deadline</p>
                                    <p className="text-sm">{formatDate((campaign as any).commitDeadline || (campaign as any).commit_deadline)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-border">
                                <Calendar className="w-4 h-4 text-primary" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-muted-foreground">Execute After</p>
                                    <p className="text-sm">{formatDate((campaign as any).executeAfter || (campaign as any).execute_after)}</p>
                                </div>
                            </div>
                            {(campaign as any).finalized_at && (
                                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-primary">Finalized At</p>
                                        <p className="text-sm">{formatDate((campaign as any).finalizedAt || (campaign as any).finalized_at)}</p>
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

                    {/* Campaign Finalization */}
                    {(campaign.status === 'active' || finState.step1Status !== 'idle') && (
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase text-primary/80">
                                Campaign Finalization
                            </h4>

                            {/* Warning Banner */}
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                    ⚠️ Warning: This action is irreversible once both steps are completed.
                                </p>
                            </div>

                            {/* Prerequisites Check */}
                            <div className="bg-secondary/20 p-4 rounded-xl border border-border space-y-3">
                                <h5 className="text-xs font-bold uppercase text-muted-foreground mb-3">Prerequisites Status</h5>

                                {/* Loading State */}
                                {finState.step1Status === 'checking' && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-lg">🔄</span>
                                        <span>Loading campaign data from blockchain...</span>
                                    </div>
                                )}

                                {/* Error State */}
                                {finState.step1Status === 'failed' && finState.step1Error && (
                                    <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <span className="text-lg">❌</span>
                                            <div>
                                                <p className="text-sm font-bold text-destructive">Failed to load campaign data</p>
                                                <p className="text-xs text-muted-foreground mt-1">{finState.step1Error}</p>
                                                <button
                                                    onClick={checkPrerequisites}
                                                    className="mt-2 text-xs text-primary hover:underline"
                                                >
                                                    🔄 Retry
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Data Loaded Successfully */}
                                {finState.totalCommitted !== null && finState.step1Status !== 'checking' && (
                                    <>

                                    {/* Execute After Check */}
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg">
                                            {finState.currentTime >= (finState.executeAfter || BigInt(0)) ? '✅' : '❌'}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">Execute After Timestamp:</span>
                                                <span className={finState.currentTime >= (finState.executeAfter || BigInt(0)) ? 'text-success-500 font-bold' : 'text-destructive font-bold'}>
                                                    {finState.currentTime >= (finState.executeAfter || BigInt(0)) ? 'READY' : 'WAITING'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Required: {finState.executeAfter !== null ? new Date(Number(finState.executeAfter) * 1000).toLocaleString() : 'Loading...'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Current: {new Date(Number(finState.currentTime) * 1000).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Min Cap Check */}
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg">
                                            {(minCap && finState.totalCommitted && BigInt(minCap) <= finState.totalCommitted) ? '✅' : '❌'}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">Minimum Cap Reached:</span>
                                                <span className={(minCap && finState.totalCommitted && BigInt(minCap) <= finState.totalCommitted) ? 'text-success-500 font-bold' : 'text-destructive font-bold'}>
                                                    {(minCap && finState.totalCommitted && BigInt(minCap) <= finState.totalCommitted) ? 'YES' : 'NO'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Required: ${minCap || 'N/A'} USDC
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Committed: ${finState.totalCommitted ? (Number(finState.totalCommitted) / 1e6).toFixed(2) : 'N/A'} USDC
                                            </div>
                                        </div>
                                    </div>

                                    {/* Campaign Status Check */}
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg">
                                            {campaign.status === 'active' ? '✅' : '❌'}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">Campaign Status:</span>
                                                <span className={campaign.status === 'active' ? 'text-success-500 font-bold uppercase' : 'text-destructive font-bold uppercase'}>
                                                    {campaign.status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Required: ACTIVE
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overall Status */}
                                    <div className="pt-3 border-t border-border">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">Ready to Finalize:</span>
                                            <span className={canExecuteStep1 ? 'text-success-500 font-bold text-lg' : 'text-destructive font-bold text-lg'}>
                                                {canExecuteStep1 ? '✅ YES' : '❌ NO'}
                                            </span>
                                        </div>
                                        {!canExecuteStep1 && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Complete all prerequisites above to enable Step 1.
                                            </p>
                                        )}
                                    </div>

                                    {/* Dynamic countryCode and preflight result for Step 2 */}
                                    <div className="pt-3 border-t border-border mt-3">
                                        <div className="text-xs text-muted-foreground">Resolved countryCode</div>
                                        <div className="font-mono text-xs mt-1 break-all">
                                            {finState.countryCode || 'Not resolved'}
                                        </div>
                                        {finState.preflightIssues.length > 0 && (
                                            <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                                <p className="text-xs font-bold text-destructive mb-2">
                                                    Finalization preflight issues:
                                                </p>
                                                <ul className="text-xs space-y-1 text-muted-foreground">
                                                    {finState.preflightIssues.map((issue) => (
                                                        <li key={issue}>• {issue}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    </>
                                )}
                            </div>

                            {/* Step 1: Approve Funds */}
                            <StepSection
                                title="Step 1: Approve Funds Transfer"
                                description="Campaign owner must approve funds transfer to IndaAdminRouter"
                                status={finState.step1Status}
                                error={finState.step1Error}
                                txHash={finState.step1Hash}
                                onExecute={handleApproveFunds}
                                disabled={!canExecuteStep1}
                            >
                                {finState.totalCommitted !== null && (
                                    <div className="text-sm space-y-2">
                                        <div>Amount: ${(Number(finState.totalCommitted) / 1e6).toFixed(2)} USDC</div>
                                        <div className="text-xs text-muted-foreground">Recipient: IndaAdminRouter</div>
                                    </div>
                                )}
                            </StepSection>

                            {/* Step 2: Execute Finalization (Batched) */}
                            <StepSection
                                title="Step 2: Execute Finalization"
                                description={finState.investorCount !== null
                                    ? `Batched distribution: ${Number(finState.investorCount)} investors in ${finState.totalBatches} batch${finState.totalBatches !== 1 ? 'es' : ''} (${BATCH_SIZE}/batch)`
                                    : 'Admin executes finalization to distribute tokens'}
                                status={finState.step2Status}
                                error={finState.step2Error}
                                txHashes={finState.step2Hashes}
                                currentBatch={finState.currentBatch}
                                totalBatches={finState.totalBatches}
                                onExecute={handleExecuteFinalization}
                                disabled={!canExecuteStep2}
                            >
                                <div className="text-sm space-y-1">
                                    <div>• Transfer USDC to treasury</div>
                                    <div>• Mint property tokens</div>
                                    <div>• Distribute to investors</div>
                                </div>
                            </StepSection>
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

interface StepSectionProps {
    title: string;
    description: string;
    status: 'idle' | 'checking' | 'approved' | 'approving' | 'executing' | 'completed' | 'failed';
    error: string | null;
    txHash?: ViemHash | null;
    txHashes?: ViemHash[];
    currentBatch?: number;
    totalBatches?: number;
    onExecute: () => void;
    disabled: boolean;
    children: React.ReactNode;
}

function StepSection({ title, description, status, error, txHash, txHashes, currentBatch, totalBatches, onExecute, disabled, children }: StepSectionProps) {
    const statusIcons: Record<string, string> = {
        idle: '⚪',
        checking: '🔄',
        approving: '🔄',
        approved: '✅',
        executing: '🔄',
        completed: '✅',
        failed: '❌'
    };

    return (
        <div className="bg-secondary/20 p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h5 className="font-bold flex items-center gap-2">
                        <span>{statusIcons[status]}</span>
                        {title}
                    </h5>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>

            {children}

            {error && (
                <div className="mt-3 p-2 bg-destructive/10 rounded text-xs text-destructive">
                    {error}
                </div>
            )}

            {/* Batch progress */}
            {totalBatches && totalBatches > 1 && currentBatch && currentBatch > 0 && status === 'executing' && (
                <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Batch {currentBatch} of {totalBatches}</span>
                        <span>{Math.round((currentBatch / totalBatches) * 100)}%</span>
                    </div>
                    <div className="w-full bg-secondary/40 rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentBatch / totalBatches) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Single tx hash */}
            {txHash && (
                <div className="mt-3 text-xs">
                    <a
                        href={`https://amoy.polygonscan.com/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        View transaction →
                    </a>
                </div>
            )}

            {/* Multiple tx hashes (batched) */}
            {txHashes && txHashes.length > 0 && (
                <div className="mt-3 space-y-1">
                    {txHashes.map((hash, idx) => (
                        <div key={hash} className="text-xs">
                            <a
                                href={`https://amoy.polygonscan.com/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Batch {idx + 1} tx →
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {disabled && status === 'idle' && (
                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-600 dark:text-yellow-400">
                    {title.includes('Step 1')
                        ? '⚠️ Prerequisites not met. Check the status above.'
                        : '⚠️ Complete Step 1 first before executing Step 2.'}
                </div>
            )}

            <button
                onClick={onExecute}
                disabled={disabled || status === 'approving' || status === 'executing' || status === 'checking'}
                className="mt-3 w-full px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold"
            >
                {status === 'approving' || status === 'executing'
                    ? (currentBatch && totalBatches && totalBatches > 1
                        ? `⏳ Processing Batch ${currentBatch}/${totalBatches}...`
                        : '⏳ Processing Transaction...')
                    : status === 'checking' ? '🔄 Loading Campaign Data...'
                    : status === 'approved' || status === 'completed' ? '✅ Completed'
                    : disabled ? '🔒 Locked'
                    : '🚀 Execute'}
            </button>
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
