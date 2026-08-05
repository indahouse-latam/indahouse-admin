'use client';

import { useState, useEffect } from 'react';
import { Globe, CheckCircle, XCircle, Loader2, Settings, AlertCircle } from 'lucide-react';
import { useCountries } from '@/modules/properties/hooks/useCountries';
import { createUserPublicClient, executeAndWaitForTransaction, createWalletClientWithKey } from '@/utils/blockchain.utils';
import { currentContracts, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { IndahouseRegistryAbi, ManagerAbi } from '@/config/abis';
import { toast } from 'sonner';

const CERTIFICATE_MANAGER_ROLE = '0x793fafc4216e31eb47b95467a5d6c852611bb7e4df768602288844840c234392';

function countryCodeToBytes32(code: string): `0x${string}` {
    const upperCode = code.toUpperCase();
    return `0x${upperCode
        .split('')
        .map(c => c.charCodeAt(0).toString(16))
        .join('')
        .padEnd(64, '0')}` as `0x${string}`;
}

interface CountryManagerInfo {
    countryCode: string;
    countryName: string;
    managerAddress: string | null;
    status: 'loading' | 'ready' | 'error';
    error?: string;
}

export function CountryManagers() {
    const { data: countries, isLoading: loadingCountries } = useCountries();
    const [managers, setManagers] = useState<Map<string, CountryManagerInfo>>(new Map());
    const [loadingCountry, setLoadingCountry] = useState<string | null>(null);
    const [privateKey, setPrivateKey] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    useEffect(() => {
        if (countries && countries.length > 0) {
            countries.forEach((country) => {
                if (!managers.has(country.code)) {
                    checkManager(country.code, country.name);
                }
            });
        }
    }, [countries]);

    const checkManager = async (countryCode: string, countryName: string) => {
        setLoadingCountry(countryCode);
        try {
            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
            const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
            const countryCodeBytes32 = countryCodeToBytes32(countryCode);
            const zeroAddress = '0x0000000000000000000000000000000000000000';

            const managerAddress = await publicClient.readContract({
                address: registryAddress,
                abi: IndahouseRegistryAbi,
                functionName: 'getManager',
                args: [countryCodeBytes32],
            }) as `0x${string}`;

            const exists = managerAddress && managerAddress !== zeroAddress;

            setManagers(prev => {
                const newMap = new Map(prev);
                newMap.set(countryCode, {
                    countryCode,
                    countryName,
                    managerAddress: exists ? managerAddress : null,
                    status: 'ready',
                });
                return newMap;
            });
        } catch (error) {
            setManagers(prev => {
                const newMap = new Map(prev);
                newMap.set(countryCode, {
                    countryCode,
                    countryName,
                    managerAddress: null,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
                return newMap;
            });
        } finally {
            setLoadingCountry(null);
        }
    };

    const setupManager = async (countryCode: string, countryName: string) => {
        if (!privateKey) {
            toast.error('Please enter the master private key');
            return;
        }

        setLoadingCountry(countryCode);
        try {
            const formattedKey = privateKey.startsWith('0x') ? privateKey as `0x${string}` : `0x${privateKey}` as `0x${string}`;
            const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
            const countryCodeBytes32 = countryCodeToBytes32(countryCode);
            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
            const walletClient = createWalletClientWithKey(formattedKey, DEFAULT_CHAIN_ID);
            const adminAddress = walletClient.account.address;
            const zeroAddress = '0x0000000000000000000000000000000000000000';

            const existingManager = await publicClient.readContract({
                address: registryAddress,
                abi: IndahouseRegistryAbi,
                functionName: 'getManager',
                args: [countryCodeBytes32],
            }) as `0x${string}`;

            let managerAddress: string;

            if (existingManager && existingManager !== zeroAddress) {
                managerAddress = existingManager;
                toast.info(`Manager already exists at ${managerAddress}. Granting certificate manager role...`);

                await executeAndWaitForTransaction({
                    contractAddress: managerAddress as `0x${string}`,
                    abi: ManagerAbi,
                    functionName: 'grantRole',
                    args: [CERTIFICATE_MANAGER_ROLE, adminAddress],
                    chainId: DEFAULT_CHAIN_ID,
                    privateKey: formattedKey,
                });
            } else {
                toast.info(`Creating manager for ${countryName}...`);

                await executeAndWaitForTransaction({
                    contractAddress: registryAddress,
                    abi: IndahouseRegistryAbi,
                    functionName: 'createManager',
                    args: [countryCodeBytes32],
                    chainId: DEFAULT_CHAIN_ID,
                    privateKey: formattedKey,
                });

                managerAddress = await publicClient.readContract({
                    address: registryAddress,
                    abi: IndahouseRegistryAbi,
                    functionName: 'getManager',
                    args: [countryCodeBytes32],
                }) as string;

                toast.info(`Manager created at ${managerAddress}. Granting certificate manager role...`);

                await executeAndWaitForTransaction({
                    contractAddress: managerAddress as `0x${string}`,
                    abi: ManagerAbi,
                    functionName: 'grantRole',
                    args: [CERTIFICATE_MANAGER_ROLE, adminAddress],
                    chainId: DEFAULT_CHAIN_ID,
                    privateKey: formattedKey,
                });
            }

            toast.success(`Manager for ${countryName} configured successfully!`);

            setManagers(prev => {
                const newMap = new Map(prev);
                newMap.set(countryCode, {
                    countryCode,
                    countryName,
                    managerAddress,
                    status: 'ready',
                });
                return newMap;
            });
            setSelectedCountry(null);
            setPrivateKey('');
        } catch (error) {
            toast.error(`Failed to setup manager: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoadingCountry(null);
        }
    };

    if (loadingCountries) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-semibold">Country Managers</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage smart contract managers for each supported country.
                </p>
            </div>

            <div className="p-6 space-y-4">
                <div className="grid gap-3">
                    {countries?.map((country) => {
                        const managerInfo = managers.get(country.code);
                        const isLoading = loadingCountry === country.code;
                        const isSelected = selectedCountry === country.code;

                        return (
                            <div
                                key={country.id}
                                className={`p-4 rounded-lg border ${
                                    managerInfo?.managerAddress
                                        ? 'bg-green-500/5 border-green-500/20'
                                        : 'bg-secondary/30 border-border'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                        ) : managerInfo?.managerAddress ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-muted-foreground" />
                                        )}
                                        <div>
                                            <p className="font-medium">{country.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {country.code}
                                                {managerInfo?.managerAddress ? ` • ${managerInfo.managerAddress.slice(0, 10)}...${managerInfo.managerAddress.slice(-6)}` : ' • No manager configured'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!managerInfo && (
                                            <button
                                                onClick={() => checkManager(country.code, country.name)}
                                                disabled={isLoading}
                                                className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                                            >
                                                Check
                                            </button>
                                        )}
                                        {managerInfo && !managerInfo.managerAddress && (
                                            <button
                                                onClick={() => setSelectedCountry(isSelected ? null : country.code)}
                                                disabled={isLoading}
                                                className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                                            >
                                                <Settings className="w-3 h-3 inline mr-1" />
                                                Setup
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-amber-500">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>No manager found for {country.name}. Enter your master private key to create one.</span>
                                        </div>
                                        <input
                                            type="password"
                                            value={privateKey}
                                            onChange={(e) => setPrivateKey(e.target.value)}
                                            placeholder="Master private key (0x...)"
                                            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setSelectedCountry(null); setPrivateKey(''); }}
                                                className="px-3 py-1.5 text-xs border border-border hover:bg-secondary/50 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => setupManager(country.code, country.name)}
                                                disabled={!privateKey || isLoading}
                                                className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isLoading ? 'Processing...' : 'Create Manager'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
