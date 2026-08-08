'use client';

import { useState, useEffect } from 'react';
import { X, Coins, Loader2, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { useMarkets } from '@/modules/markets/hooks/useMarkets';
import { useCountries } from '../hooks/useCountries';
import { usePropertyTokens } from '../hooks/usePropertyTokens';
import { Abi, decodeEventLog, parseAbi } from 'viem';
import { TokenFactoryAbi, ManagerAbi, PropertyRegistryAbi, IndahouseRegistryAbi } from '@/config/abis';
import { PoolFactoryAbi } from '@/config/abis/pool-factory.abi';
import { currentContracts, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { toast } from 'sonner';
import { createUserPublicClient, createUserWalletClient, executeAndWaitForTransaction, checkHasRole, parseContractError } from '@/utils/blockchain.utils';

interface CreatePropertyTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CERTIFICATE_MANAGER_ROLE = '0x793fafc4216e31eb47b95467a5d6c852611bb7e4df768602288844840c234392';

function countryCodeToBytes32(code: string): `0x${string}` {
    const upperCode = code.toUpperCase();
    return `0x${upperCode
        .split('')
        .map(c => c.charCodeAt(0).toString(16))
        .join('')
        .padEnd(64, '0')}` as `0x${string}`;
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
        price_per_token: '50000',
        sale_start_date: new Date().toISOString().split('T')[0],
    });

    const [privateKey, setPrivateKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<
        'checking_manager' | 'creating_manager' | 'certificate' | 'creating_distributor' | 'creating' | 'confirming' | 'init_distributor' | 'registering_manager' | 'registering_property' | 'saving' | null
    >(null);
    const [managerStatus, setManagerStatus] = useState<{
        exists: boolean;
        address: string | null;
        hasRole: boolean;
        needsSetup: boolean;
    } | null>(null);

    useEffect(() => {
        if (!formData.country_id || !countries) {
            setManagerStatus(null);
            return;
        }

        const selectedCountry = countries.find(c => c.id === formData.country_id);
        if (!selectedCountry) {
            setManagerStatus(null);
            return;
        }

        checkManagerStatus(selectedCountry.code);
    }, [formData.country_id, countries]);

    const checkManagerStatus = async (countryCode: string) => {
        try {
            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
            const countryCodeBytes32 = countryCodeToBytes32(countryCode);
            const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
            const zeroAddress = '0x0000000000000000000000000000000000000000';

            const managerAddress = await publicClient.readContract({
                address: registryAddress,
                abi: IndahouseRegistryAbi,
                functionName: 'getManager',
                args: [countryCodeBytes32],
            }) as `0x${string}`;

            const exists = managerAddress && managerAddress !== zeroAddress;

            if (!exists) {
                setManagerStatus({ exists: false, address: null, hasRole: false, needsSetup: true });
                return;
            }

            const walletClient = await createUserWalletClient(DEFAULT_CHAIN_ID);
            const adminAddress = walletClient.account.address;

            const hasRole = await publicClient.readContract({
                address: managerAddress,
                abi: ManagerAbi,
                functionName: 'hasRole',
                args: [CERTIFICATE_MANAGER_ROLE, adminAddress],
            }) as boolean;

            setManagerStatus({
                exists: true,
                address: managerAddress,
                hasRole,
                needsSetup: !hasRole,
            });
        } catch (error) {
            console.error('Error checking manager status:', error);
            setManagerStatus({ exists: false, address: null, hasRole: false, needsSetup: true });
        }
    };

    const setupManager = async (): Promise<string> => {
        if (!privateKey) {
            throw new Error('Private key is required to set up manager');
        }

        if (!formData.country_id || !countries) {
            throw new Error('Country not selected');
        }

        const selectedCountry = countries.find(c => c.id === formData.country_id);
        if (!selectedCountry) {
            throw new Error('Country not found');
        }

        setLoadingStep('creating_manager');

        const formattedKey = privateKey.startsWith('0x') ? privateKey as `0x${string}` : `0x${privateKey}` as `0x${string}`;
        const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
        const countryCodeBytes32 = countryCodeToBytes32(selectedCountry.code);
        const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
        const walletClient = await createUserWalletClient(DEFAULT_CHAIN_ID);
        const adminAddress = walletClient.account.address;

        const hasAdminRole = await checkHasRole({
            contractAddress: registryAddress,
            abi: IndahouseRegistryAbi,
            role: '0x0000000000000000000000000000000000000000000000000000000000000000',
            account: adminAddress,
            chainId: DEFAULT_CHAIN_ID,
        });
        if (!hasAdminRole) {
            throw new Error('You need DEFAULT_ADMIN_ROLE on IndahouseRegistry to create managers for new countries. Contact the contract admin.');
        }

        const zeroAddress = '0x0000000000000000000000000000000000000000';

        const existingManager = await publicClient.readContract({
            address: registryAddress,
            abi: IndahouseRegistryAbi,
            functionName: 'getManager',
            args: [countryCodeBytes32],
        }) as `0x${string}`;

        if (existingManager && existingManager !== zeroAddress) {
            if (!privateKey) {
                throw new Error('Private key required to grant certificate manager role');
            }

            await executeAndWaitForTransaction({
                contractAddress: existingManager,
                abi: ManagerAbi,
                functionName: 'grantRole',
                args: [CERTIFICATE_MANAGER_ROLE, adminAddress],
                chainId: DEFAULT_CHAIN_ID,
                privateKey: formattedKey,
            });

            return existingManager;
        }

        await executeAndWaitForTransaction({
            contractAddress: registryAddress,
            abi: IndahouseRegistryAbi,
            functionName: 'createManager',
            args: [countryCodeBytes32],
            chainId: DEFAULT_CHAIN_ID,
            privateKey: formattedKey,
        });

        const newManager = await publicClient.readContract({
            address: registryAddress,
            abi: IndahouseRegistryAbi,
            functionName: 'getManager',
            args: [countryCodeBytes32],
        }) as `0x${string}`;

        await executeAndWaitForTransaction({
            contractAddress: newManager,
            abi: ManagerAbi,
            functionName: 'grantRole',
            args: [CERTIFICATE_MANAGER_ROLE, adminAddress],
            chainId: DEFAULT_CHAIN_ID,
            privateKey: formattedKey,
        });

        return newManager;
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!formData.property_id || !formData.country_id || !formData.name || !formData.symbol) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsLoading(true);

        try {
            const networkConfig = currentContracts;
            const chainId = DEFAULT_CHAIN_ID;
            const poolFactoryAddress = (networkConfig as { poolFactory?: string }).poolFactory as `0x${string}` | undefined;
            let distributorAddress = networkConfig.distributorProxy as `0x${string}`;

            const selectedCountry = countries?.find(c => c.id === formData?.country_id);
            if (!selectedCountry) {
                throw new Error('Country not found');
            }
            const selectedCountryCode = selectedCountry.code.toUpperCase();
            const countryCodeForBlockchain = selectedCountryCode === 'ES' ? 'CO' : selectedCountryCode;
            const countryCodeBytes32 = `0x${countryCodeForBlockchain
                .split('')
                .map(c => c.charCodeAt(0).toString(16))
                .join('')
                .padEnd(64, '0')}` as `0x${string}`;

            // Step 0: Ensure admin has a manager certificate for the token's country (reuse if same country, create if new country)
            setLoadingStep('certificate');
            console.log('📋 Verifying manager certificate for country:', countryCodeForBlockchain, '(DB:', selectedCountryCode, ')');
            const publicClient = createUserPublicClient(chainId);
            const walletClient = await createUserWalletClient(chainId);
            const adminAddress = walletClient.account.address;
            const distributorReadAbi = parseAbi([
                'function shareToken() view returns (address)',
                'function rewardToken() view returns (address)',
                'function indaRoot() view returns (address)',
            ]);
            const distributorWriteAbi = parseAbi([
                'function initialize(address,address,address,string)',
            ]);
            const zeroAddress = '0x0000000000000000000000000000000000000000';

            let managerAddress: `0x${string}`;
            const registryAddress = (networkConfig as { indahouseRegistry?: string }).indahouseRegistry;
            if (registryAddress) {
                const managerFromRegistry = await publicClient.readContract({
                    address: registryAddress as `0x${string}`,
                    abi: IndahouseRegistryAbi as Abi,
                    functionName: 'getManager',
                    args: [countryCodeBytes32],
                }) as `0x${string}`;
                managerAddress = (managerFromRegistry && managerFromRegistry !== zeroAddress ? managerFromRegistry : networkConfig.manager) as `0x${string}`;
            } else {
                managerAddress = networkConfig.manager as `0x${string}`;
            }

            if (managerAddress === networkConfig.manager) {
                if (!privateKey) {
                    toast.error(
                        `No manager configured for ${selectedCountryCode}. Please provide the master private key below to set up the manager.`,
                        { duration: 10000 }
                    );
                    throw new Error(
                        `No manager found for ${selectedCountryCode} in registry. Provide the master private key to create and configure the manager.`
                    );
                }

                toast.info(`Setting up manager for ${selectedCountryCode}...`);
                managerAddress = await setupManager();
                toast.success(`Manager configured for ${selectedCountryCode}`);
                setManagerStatus({ exists: true, address: managerAddress, hasRole: true, needsSetup: false });
            }

            // Guardrail: do not create a new token if configured distributor is already bound to a different shareToken
            const existingShareToken = await publicClient.readContract({
                address: distributorAddress,
                abi: distributorReadAbi,
                functionName: 'shareToken',
            }) as `0x${string}`;
            if (existingShareToken !== zeroAddress) {
                if (!poolFactoryAddress || poolFactoryAddress === zeroAddress) {
                    throw new Error(
                        `Configured distributor ${distributorAddress} is already initialized with shareToken ${existingShareToken}. ` +
                        'PoolFactory is not configured in currentContracts. Configure currentContracts.poolFactory to auto-create a new distributor.'
                    );
                }

                setLoadingStep('creating_distributor');
                console.log('🔄 Existing distributor is busy. Creating a new distributor proxy...');

                const simulation = await publicClient.simulateContract({
                    account: adminAddress,
                    address: poolFactoryAddress,
                    abi: PoolFactoryAbi as Abi,
                    functionName: 'createDistributorProxy',
                    args: [countryCodeBytes32, adminAddress],
                });
                const simulatedDistributor = simulation.result as `0x${string}`;

                await executeAndWaitForTransaction({
                    contractAddress: poolFactoryAddress,
                    abi: PoolFactoryAbi as Abi,
                    functionName: 'createDistributorProxy',
                    args: [countryCodeBytes32, adminAddress],
                    chainId,
                });

                // Use the created proxy returned by simulation for the same tx params/state
                distributorAddress = simulatedDistributor;
                console.log('✅ New distributor proxy created:', distributorAddress);
            }

            const existingCert = await publicClient.readContract({
                address: managerAddress,
                abi: ManagerAbi as Abi,
                functionName: 'userCertificates',
                args: [adminAddress],
            }) as `0x${string}`;
            if (!existingCert || existingCert === zeroAddress) {
                console.log('📋 No manager certificate for this country. Creating manager certificate...');
                await executeAndWaitForTransaction({
                    contractAddress: managerAddress,
                    abi: ManagerAbi as Abi,
                    functionName: 'createCertificate',
                    args: [adminAddress],
                    chainId,
                });
                console.log('✅ Manager certificate created for country:', selectedCountry.code);
            } else {
                console.log('✅ Manager certificate already exists for country:', selectedCountry.code, existingCert);
            }

            // Step 1: Create token on blockchain
            setLoadingStep('creating');
            console.log('📝 Creating token on blockchain...');

            const { hash, receipt } = await executeAndWaitForTransaction({
                contractAddress: networkConfig.tokenFactory as `0x${string}`,
                abi: TokenFactoryAbi as Abi,
                functionName: 'createToken',
                args: [
                    networkConfig.indaRoot as `0x${string}`,
                    distributorAddress,
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
                        abi: TokenFactoryAbi as Abi,
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
                abi: TokenFactoryAbi as Abi,
                data: log.data,
                topics: log.topics,
            }) as unknown as { args?: { token?: string } };
            const tokenAddress = decoded.args?.token;
            if (!tokenAddress) {
                throw new Error('Token address not found in TokenCreated event args');
            }

            console.log('🎯 Token created at address:', tokenAddress);

            // Step 2.1: Initialize distributor for this token if not initialized
            setLoadingStep('init_distributor');
            console.log('📝 Validating distributor initialization...');
            const [shareToken, rewardToken, indaRootAddr] = await Promise.all([
                publicClient.readContract({
                    address: distributorAddress,
                    abi: distributorReadAbi,
                    functionName: 'shareToken',
                }),
                publicClient.readContract({
                    address: distributorAddress,
                    abi: distributorReadAbi,
                    functionName: 'rewardToken',
                }),
                publicClient.readContract({
                    address: distributorAddress,
                    abi: distributorReadAbi,
                    functionName: 'indaRoot',
                }),
            ]) as [`0x${string}`, `0x${string}`, `0x${string}`];

            if (shareToken === zeroAddress || rewardToken === zeroAddress || indaRootAddr === zeroAddress) {
                console.log('🛠️ Distributor not initialized, initializing now...');
                await executeAndWaitForTransaction({
                    contractAddress: distributorAddress,
                    abi: distributorWriteAbi,
                    functionName: 'initialize',
                    args: [
                        tokenAddress as `0x${string}`,
                        networkConfig.baseToken as `0x${string}`,
                        networkConfig.indaRoot as `0x${string}`,
                        `Distributor-${tokenAddress.slice(0, 10)}`,
                    ],
                    chainId,
                });
                console.log('✅ Distributor initialized');
            } else if (shareToken.toLowerCase() !== tokenAddress.toLowerCase()) {
                throw new Error(
                    `Distributor shareToken mismatch after token creation. Expected ${tokenAddress}, got ${shareToken}.`
                );
            }

            // Step 2: Register token in Manager (same Manager as certificate, for this country)
            setLoadingStep('registering_manager');
            console.log('📝 Registering token in Manager...');

            const { hash: managerHash } = await executeAndWaitForTransaction({
                contractAddress: managerAddress,
                abi: ManagerAbi as Abi,
                functionName: 'registerIndividualToken',
                args: [
                    tokenAddress as `0x${string}`,
                    distributorAddress,
                    formData.symbol,
                ],
                chainId,
            });

            console.log('✅ Token registered in Manager:', managerHash);

            // Step 3: Register property in PropertyRegistry
            setLoadingStep('registering_property');
            console.log('📝 Registering property in registry...');

            const saleStartTimestamp = Math.floor(new Date(formData.sale_start_date).getTime() / 1000);

            const { hash: registryHash } = await executeAndWaitForTransaction({
                contractAddress: networkConfig.PropertyRegistry as `0x${string}`,
                abi: PropertyRegistryAbi as Abi,
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
                        distributor_address: distributorAddress,
                        country_id: formData.country_id,
                        symbol: formData.symbol,
                        name: formData.name,
                        status: 'active',
                        property_id: formData?.property_id,
                        price_per_token: String(Number(formData.price_per_token) / 1_000_000),
                    },
                    {
                        onSuccess: () => {
                            console.log('✅ Token saved to database');
                            resolve();
                        },
                        onError: (error: unknown) => {
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
        } catch (error: unknown) {
            const message = parseContractError(error);
            console.error('❌ Error creating token:', error);
            toast.error('Failed to create token', {
                description: message,
            });
        } finally {
            setIsLoading(false);
            setLoadingStep(null);
        }
    };

    const getLoadingMessage = () => {
        if (loadingStep === 'checking_manager') return 'Checking manager status...';
        if (loadingStep === 'creating_manager') return 'Setting up manager for country...';
        if (loadingStep === 'certificate') return 'Verificando certificado del país...';
        if (loadingStep === 'creating_distributor') return 'Creating distributor proxy...';
        if (loadingStep === 'creating') return 'Creating token on blockchain...';
        if (loadingStep === 'confirming') return 'Confirming transaction...';
        if (loadingStep === 'init_distributor') return 'Initializing distributor...';
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

                    {/* Manager Status */}
                    {formData.country_id && (
                        <div className={`p-4 rounded-xl border ${
                            managerStatus?.exists && managerStatus?.hasRole
                                ? 'bg-green-500/10 border-green-500/30'
                                : managerStatus?.exists && !managerStatus?.hasRole
                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                : 'bg-red-500/10 border-red-500/30'
                        }`}>
                            <div className="flex items-center gap-3">
                                {managerStatus?.exists && managerStatus?.hasRole ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : managerStatus?.exists && !managerStatus?.hasRole ? (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {managerStatus?.exists && managerStatus?.hasRole
                                            ? 'Manager configurado correctamente'
                                            : managerStatus?.exists && !managerStatus?.hasRole
                                            ? 'Manager existe pero falta rol'
                                            : 'Manager no configurado para este país'}
                                    </p>
                                    {managerStatus?.address && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Manager: {managerStatus.address}
                                        </p>
                                    )}
                                    {!managerStatus?.exists && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Se necesita configurar el manager antes de crear tokens.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

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

                    {/* Master Private Key (only shown when manager needs setup) */}
                    {managerStatus?.needsSetup && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Master Private Key *
                            </label>
                            <input
                                type="password"
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                                disabled={isLoading}
                                placeholder="0x..."
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                            />
                            <p className="text-xs text-muted-foreground">
                                Required to create manager and grant permissions for {managerStatus.exists ? 'this country' : 'new country'}.
                            </p>
                        </div>
                    )}

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
