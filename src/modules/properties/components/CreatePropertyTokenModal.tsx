'use client';

import { useState } from 'react';
import { X, Coins, Loader2 } from 'lucide-react';
import { useMarkets } from '@/modules/markets/hooks/useMarkets';
import { useCountries } from '../hooks/useCountries';
import { usePropertyTokens } from '../hooks/usePropertyTokens';
import { Abi, decodeEventLog } from 'viem';
import { TokenFactoryAbi, ManagerAbi, PropertyRegistryAbi } from '@/config/abis';
import { CONTRACTS, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { toast } from 'sonner';
import { executeAndWaitForTransaction } from '@/utils/blockchain.utils';

interface CreatePropertyTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreatePropertyTokenModal({ isOpen, onClose }: CreatePropertyTokenModalProps) {
    const { data: marketsData } = useMarkets();
    const { data: countries } = useCountries();
    const properties = marketsData?.properties || [];
    const { createPropertyToken } = usePropertyTokens();

    const [formData, setFormData] = useState({
        property_id: '',
        country_id: '',
        name: '',
        symbol: '',
        price_per_token: '50000', // Default $0.05 (6 decimals)
        sale_start_date: new Date().toISOString().split('T')[0],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<'creating' | 'confirming' | 'registering_manager' | 'registering_property' | 'saving' | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!formData.property_id || !formData.country_id || !formData.name || !formData.symbol) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create token on blockchain
            setLoadingStep('creating');
            console.log('📝 Creating token on blockchain...');

            const networkConfig = CONTRACTS["polygonAmoy"];
            const chainId = DEFAULT_CHAIN_ID;

            const { hash, receipt } = await executeAndWaitForTransaction({
                contractAddress: networkConfig.tokenFactory as `0x${string}`,
                abi: TokenFactoryAbi,
                functionName: 'createToken',
                args: [
                    networkConfig.indaRoot as `0x${string}`,
                    networkConfig.distributorProxy as `0x${string}`,
                    formData.name,
                    formData.symbol,
                    networkConfig.baseToken as `0x${string}`,
                ],
                chainId,
            });

            console.log('✅ Transaction confirmed:', hash);

            // Step 2: Parse TokenCreated event
            setLoadingStep('confirming');
            const log = receipt.logs.find((log) => {
                try {
                    const decoded = decodeEventLog({
                        abi: TokenFactoryAbi,
                        data: log.data,
                        topics: log.topics,
                    });
                    return decoded.eventName === 'TokenCreated';
                } catch {
                    return false;
                }
            });

            if (!log) {
                throw new Error('TokenCreated event not found in transaction receipt');
            }

            const decoded = decodeEventLog({
                abi: TokenFactoryAbi,
                data: log.data,
                topics: log.topics,
            });
            const tokenAddress = decoded.args.token as string;

            console.log('🎯 Token created at address:', tokenAddress);

            // Step 2: Register token in Manager
            setLoadingStep('registering_manager');
            console.log('📝 Registering token in Manager...');

            const { hash: managerHash } = await executeAndWaitForTransaction({
                contractAddress: networkConfig?.manager as `0x${string}`,
                abi: ManagerAbi as Abi,
                functionName: 'registerIndividualToken',
                args: [
                    tokenAddress as `0x${string}`,
                    networkConfig.distributorProxy as `0x${string}`,
                    formData.symbol,
                ],
                chainId,
            });

            console.log('✅ Token registered in Manager:', managerHash);

            // Step 3: Register property in PropertyRegistry
            setLoadingStep('registering_property');
            console.log('📝 Registering property in registry...');

            // Get country code from selected country
            const selectedCountry = countries?.find(c => c.id === formData?.country_id);
            if (!selectedCountry) {
                throw new Error('Country not found');
            }

            // Convert "CO" -> 0x434f000000...00 (bytes32)
            const countryCodeBytes32 = `0x${selectedCountry.code.toUpperCase()
                .split('')
                .map(c => c.charCodeAt(0).toString(16))
                .join('')
                .padEnd(64, '0')}` as `0x${string}`;

            const saleStartTimestamp = Math.floor(new Date(formData.sale_start_date).getTime() / 1000);

            const { hash: registryHash } = await executeAndWaitForTransaction({
                contractAddress: networkConfig.PropertyRegistry as `0x${string}`,
                abi: PropertyRegistryAbi,
                functionName: 'registerProperty',
                args: [
                    countryCodeBytes32,
                    tokenAddress as `0x${string}`,
                    BigInt(formData.price_per_token),
                    BigInt(saleStartTimestamp),
                ],
                chainId,
            });

            console.log('✅ Property registered in registry:', registryHash);

            // Step 4: Save to database
            setLoadingStep('saving');

            await new Promise<void>((resolve, reject) => {
                createPropertyToken(
                    {
                        token_address: tokenAddress,
                        distributor_address: networkConfig.distributorProxy,
                        country_id: formData.country_id,
                        symbol: formData.symbol,
                        name: formData.name,
                        status: 'active',
                        property_id: formData?.property_id,
                        // price_per_token: formData.price_per_token,
                        // sale_start_date: formData.sale_start_date,
                    },
                    {
                        onSuccess: () => {
                            console.log('✅ Token saved to database');
                            resolve();
                        },
                        onError: (error: any) => {
                            reject(error);
                        },
                    }
                );
            });

            // Success!
            toast.success('Property token created successfully!', {
                description: `Token address: ${tokenAddress}`,
                duration: 20000
            });

            setFormData({
                property_id: '',
                country_id: '',
                name: '',
                symbol: '',
                price_per_token: '50000',
                sale_start_date: new Date().toISOString().split('T')[0],
            });

            onClose();
        } catch (error: any) {
            console.error('❌ Error creating token:', error);
            toast.error('Failed to create token', {
                description: error.message || 'Unknown error occurred',
            });
        } finally {
            setIsLoading(false);
            setLoadingStep(null);
        }
    };

    const getLoadingMessage = () => {
        if (loadingStep === 'creating') return 'Creating token on blockchain...';
        if (loadingStep === 'confirming') return 'Confirming transaction...';
        if (loadingStep === 'registering_manager') return 'Registering in Manager...';
        if (loadingStep === 'registering_property') return 'Registering property...';
        if (loadingStep === 'saving') return 'Saving to database...';
        return '';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Coins className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Crear Token de Propiedad</h2>
                            <p className="text-sm text-muted-foreground">Deploy ERC20 token on blockchain</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-lg hover:bg-secondary/80 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Property Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Propiedad *</label>
                        <select
                            value={formData.property_id}
                            onChange={(e) => { console.log(e.target.value); setFormData({ ...formData, property_id: e.target.value }); }}
                            disabled={isLoading}
                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                            required
                        >
                            <option value="">Seleccionar propiedad</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property?.nameReference || property?.name_reference || 'Sin nombre'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Country Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">País *</label>
                        <select
                            value={formData.country_id}
                            onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                            disabled={isLoading}
                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                            required
                        >
                            <option value="">Seleccionar país</option>
                            {countries?.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Token Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Token Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isLoading}
                            placeholder="e.g., WELCOME TOKEN"
                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                            required
                        />
                    </div>

                    {/* Token Symbol */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Token Symbol *</label>
                        <input
                            type="text"
                            value={formData.symbol}
                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                            disabled={isLoading}
                            placeholder="e.g., INDH-WLM-2"
                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                            required
                        />
                    </div>

                    {/* Pricing Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price Per Token (USDC) *</label>
                            <input
                                type="number"
                                step="0.000001"
                                value={Number(formData.price_per_token) / 1000000}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    price_per_token: String(Math.floor(Number(e.target.value) * 1000000))
                                })}
                                disabled={isLoading}
                                placeholder="0.05"
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                6 decimals: ${(Number(formData.price_per_token) / 1000000).toFixed(6)}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sale Start Date *</label>
                            <input
                                type="date"
                                value={formData.sale_start_date}
                                onChange={(e) => setFormData({ ...formData, sale_start_date: e.target.value })}
                                disabled={isLoading}
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                required
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 border border-border rounded-xl hover:bg-secondary/80 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {getLoadingMessage()}
                                </>
                            ) : (
                                'Crear Token'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
