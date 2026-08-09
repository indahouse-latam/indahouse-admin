'use client';

import { useState, useEffect, useCallback } from 'react';
import { Globe, CheckCircle, XCircle, Loader2, Settings, AlertCircle, Shield, RefreshCw, Info, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { useCountries } from '@/modules/properties/hooks/useCountries';
import { createUserPublicClient, executeAndWaitForTransaction, createWalletClientWithKey, checkHasRole, parseContractError } from '@/utils/blockchain.utils';
import { isAddress, type Abi } from 'viem';
import { currentContracts, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { IndahouseRegistryAbi, ManagerAbi, IndaRootAbi, PropertyRegistryAbi } from '@/config/abis';
import { toast } from 'sonner';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

const ROLE_HASHES = {
    DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000' as const,
    CERTIFICATE_MANAGER_ROLE: '0x793fafc4216e31eb47b95467a5d6c852611bb7e4df768602288844840c234392' as const,
    PROPERTIES_MANAGER_ROLE: '0x5caba2aa072f9476eef4eba05f22235aef4612b73d339428b33d92eca0aabf20' as const,
    USER_MANAGER_ROLE: '0x5ebedfa6104e4963a67c17c9b73e50a627c5307e1a07c68dd391bb0e4fc974d3' as const,
    GOVERNANCE_ROLE: '0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1' as const,
    OPERATOR_ROLE: '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929' as const,
} as const;

type SetupStepId = 'create_manager' | 'grant_operator' | 'grant_certificate' | 'initialize_pool';

interface SetupStep {
    id: SetupStepId;
    label: string;
    detail: string;
    done: boolean;
    unknown?: boolean;
}

interface RoleStatus {
    indahouseRegistry: { DEFAULT_ADMIN_ROLE: boolean };
    manager: { CERTIFICATE_MANAGER_ROLE: boolean; OPERATOR_ROLE: boolean };
    indaRoot: {
        PROPERTIES_MANAGER_ROLE: boolean;
        USER_MANAGER_ROLE: boolean;
        GOVERNANCE_ROLE: boolean;
    };
    propertyRegistry: { PROPERTIES_MANAGER_ROLE: boolean; GOVERNANCE_ROLE: boolean };
}

interface CountryManagerInfo {
    countryCode: string;
    countryName: string;
    managerAddress: string | null;
    status: 'loading' | 'ready' | 'error' | 'needs_setup';
    error?: string;
    indaRoot?: string | null;
    poolInitialized?: boolean;
    checkedFor?: string | null;
    managerRoles?: {
        DEFAULT_ADMIN_ROLE: boolean;
        CERTIFICATE_MANAGER_ROLE: boolean;
        OPERATOR_ROLE: boolean;
    };
    steps?: SetupStep[];
}

interface RoleSummary {
    adminAddress: string | null;
    roles: RoleStatus;
    isLoading: boolean;
    lastVerified: Date | null;
}

function countryCodeToBytes32(code: string): `0x${string}` {
    const upperCode = code.toUpperCase();
    return `0x${upperCode
        .split('')
        .map(c => c.charCodeAt(0).toString(16))
        .join('')
        .padEnd(64, '0')}` as `0x${string}`;
}

function buildSteps(params: {
    managerExists: boolean;
    hasOperator: boolean;
    hasCert: boolean;
    poolInitialized: boolean;
    indaRootSet: boolean;
    targetLabel: string;
}): SetupStep[] {
    const { managerExists, hasOperator, hasCert, poolInitialized, indaRootSet, targetLabel } = params;
    return [
        {
            id: 'create_manager',
            label: 'Manager registrado',
            detail: 'createManager en IndahouseRegistry',
            done: managerExists,
        },
        {
            id: 'grant_operator',
            label: 'OPERATOR_ROLE',
            detail: `Necesario en ${targetLabel} para poder otorgar CERT (roleAdmin)`,
            done: managerExists && hasOperator,
        },
        {
            id: 'grant_certificate',
            label: 'CERTIFICATE_MANAGER_ROLE',
            detail: `Necesario en ${targetLabel} para createCertificate`,
            done: managerExists && hasCert,
        },
        {
            id: 'initialize_pool',
            label: 'Pool / IndaRoot',
            detail: 'initializePool(baseToken, indaRoot) — indaRoot no puede ser zero',
            done: managerExists && poolInitialized && indaRootSet,
        },
    ];
}

function statusFromSteps(steps: SetupStep[], managerAddress: string | null): CountryManagerInfo['status'] {
    if (!managerAddress) return 'needs_setup';
    return steps.every(s => s.done) ? 'ready' : 'needs_setup';
}

export function CountryManagers() {
    const { data: countries, isLoading: loadingCountries } = useCountries();
    const [managers, setManagers] = useState<Map<string, CountryManagerInfo>>(new Map());
    const [loadingCountry, setLoadingCountry] = useState<string | null>(null);
    const [privateKey, setPrivateKey] = useState('');
    /** Wallet operativa que debe recibir OPERATOR + CERT (ej. 0x7C95...). Si vacío, usa la address de la private key. */
    const [targetAddress, setTargetAddress] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [roleSummary, setRoleSummary] = useState<RoleSummary>({
        adminAddress: null,
        roles: {
            indahouseRegistry: { DEFAULT_ADMIN_ROLE: false },
            manager: { CERTIFICATE_MANAGER_ROLE: false, OPERATOR_ROLE: false },
            indaRoot: { PROPERTIES_MANAGER_ROLE: false, USER_MANAGER_ROLE: false, GOVERNANCE_ROLE: false },
            propertyRegistry: { PROPERTIES_MANAGER_ROLE: false, GOVERNANCE_ROLE: false },
        },
        isLoading: false,
        lastVerified: null,
    });
    const [showRoleCard, setShowRoleCard] = useState(true);

    const resolveTargetAddress = useCallback((fallbackFromKey?: string): `0x${string}` | null => {
        const raw = targetAddress.trim() || fallbackFromKey || roleSummary.adminAddress || '';
        if (!raw || !isAddress(raw)) return null;
        return raw as `0x${string}`;
    }, [targetAddress, roleSummary.adminAddress]);

    const inspectManager = useCallback(async (
        countryCode: string,
        countryName: string,
        managerAddress: string | null,
        accountToCheck: string | null,
    ): Promise<CountryManagerInfo> => {
        const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
        const exists = Boolean(managerAddress && managerAddress !== ZERO_ADDRESS);

        let indaRoot: string | null = null;
        let poolInitialized = false;
        let managerRoles: CountryManagerInfo['managerRoles'];

        if (exists && managerAddress) {
            const [rootAddr, poolInfo] = await Promise.all([
                publicClient.readContract({
                    address: managerAddress as `0x${string}`,
                    abi: ManagerAbi as Abi,
                    functionName: 'indaRoot',
                }) as Promise<`0x${string}`>,
                publicClient.readContract({
                    address: managerAddress as `0x${string}`,
                    abi: ManagerAbi as Abi,
                    functionName: 'getPoolInfo',
                }) as Promise<readonly [`0x${string}`, `0x${string}`, `0x${string}`, boolean]>,
            ]);
            indaRoot = rootAddr;
            poolInitialized = poolInfo[3];

            if (accountToCheck && isAddress(accountToCheck)) {
                const [hasDefaultAdmin, hasCertRole, hasOperatorRole] = await Promise.all([
                    checkHasRole({
                        contractAddress: managerAddress as `0x${string}`,
                        abi: ManagerAbi as Abi,
                        role: ROLE_HASHES.DEFAULT_ADMIN_ROLE,
                        account: accountToCheck as `0x${string}`,
                        chainId: DEFAULT_CHAIN_ID,
                    }),
                    checkHasRole({
                        contractAddress: managerAddress as `0x${string}`,
                        abi: ManagerAbi as Abi,
                        role: ROLE_HASHES.CERTIFICATE_MANAGER_ROLE,
                        account: accountToCheck as `0x${string}`,
                        chainId: DEFAULT_CHAIN_ID,
                    }),
                    checkHasRole({
                        contractAddress: managerAddress as `0x${string}`,
                        abi: ManagerAbi as Abi,
                        role: ROLE_HASHES.OPERATOR_ROLE,
                        account: accountToCheck as `0x${string}`,
                        chainId: DEFAULT_CHAIN_ID,
                    }),
                ]);
                managerRoles = {
                    DEFAULT_ADMIN_ROLE: hasDefaultAdmin,
                    CERTIFICATE_MANAGER_ROLE: hasCertRole,
                    OPERATOR_ROLE: hasOperatorRole,
                };
            }
        }

        const targetLabel = accountToCheck
            ? `${accountToCheck.slice(0, 6)}...${accountToCheck.slice(-4)}`
            : 'wallet operativa (definir abajo)';

        const steps = buildSteps({
            managerExists: exists,
            hasOperator: managerRoles?.OPERATOR_ROLE ?? false,
            hasCert: managerRoles?.CERTIFICATE_MANAGER_ROLE ?? false,
            poolInitialized,
            indaRootSet: Boolean(indaRoot && indaRoot !== ZERO_ADDRESS),
            targetLabel,
        });

        // Sin wallet operativa: roles quedan "sin verificar" y no bloquean el status global
        if (!accountToCheck) {
            steps.forEach(step => {
                if (step.id === 'grant_operator' || step.id === 'grant_certificate') {
                    step.done = true;
                    step.unknown = true;
                    step.detail = 'Sin verificar — ingresá la wallet operativa y pulsá Verificar';
                }
            });
        }

        const statusSteps = accountToCheck
            ? steps
            : steps.filter(s => s.id === 'create_manager' || s.id === 'initialize_pool');

        return {
            countryCode,
            countryName,
            managerAddress: exists ? managerAddress : null,
            status: statusFromSteps(statusSteps, exists ? managerAddress : null),
            indaRoot,
            poolInitialized,
            checkedFor: accountToCheck,
            managerRoles,
            steps,
        };
    }, []);

    const verifyRoles = useCallback(async (adminAddress?: string) => {
        if (!privateKey && !adminAddress) {
            toast.error('Ingresa la clave privada para verificar roles');
            return;
        }

        let address = adminAddress;
        if (!address) {
            try {
                const formattedKey = privateKey.startsWith('0x') ? privateKey as `0x${string}` : `0x${privateKey}` as `0x${string}`;
                const walletClient = createWalletClientWithKey(formattedKey, DEFAULT_CHAIN_ID);
                address = walletClient.account.address;
            } catch {
                toast.error('Clave privada inválida');
                return;
            }
        }

        setRoleSummary(prev => ({ ...prev, isLoading: true }));

        try {
            const [
                hasDEFAULT_ADMIN_ROLEOnRegistry,
                hasPROPERTIES_MANAGER_ROLEOnRoot,
                hasUSER_MANAGER_ROLEOnRoot,
                hasGOVERNANCE_ROLEOnRoot,
                hasPROPERTIES_MANAGER_ROLEOnPropReg,
                hasGOVERNANCE_ROLEOnPropReg,
            ] = await Promise.all([
                checkHasRole({
                    contractAddress: currentContracts.indahouseRegistry as `0x${string}`,
                    abi: IndahouseRegistryAbi as Abi,
                    role: ROLE_HASHES.DEFAULT_ADMIN_ROLE,
                    account: address as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                }),
                checkHasRole({
                    contractAddress: currentContracts.indaRoot as `0x${string}`,
                    abi: IndaRootAbi as Abi,
                    role: ROLE_HASHES.PROPERTIES_MANAGER_ROLE,
                    account: address as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                }),
                checkHasRole({
                    contractAddress: currentContracts.indaRoot as `0x${string}`,
                    abi: IndaRootAbi as Abi,
                    role: ROLE_HASHES.USER_MANAGER_ROLE,
                    account: address as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                }),
                checkHasRole({
                    contractAddress: currentContracts.indaRoot as `0x${string}`,
                    abi: IndaRootAbi as Abi,
                    role: ROLE_HASHES.GOVERNANCE_ROLE,
                    account: address as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                }),
                checkHasRole({
                    contractAddress: currentContracts.PropertyRegistry as `0x${string}`,
                    abi: PropertyRegistryAbi as Abi,
                    role: ROLE_HASHES.PROPERTIES_MANAGER_ROLE,
                    account: address as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                }),
                checkHasRole({
                    contractAddress: currentContracts.PropertyRegistry as `0x${string}`,
                    abi: PropertyRegistryAbi as Abi,
                    role: ROLE_HASHES.GOVERNANCE_ROLE,
                    account: address as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                }),
            ]);

            setRoleSummary({
                adminAddress: address,
                roles: {
                    indahouseRegistry: { DEFAULT_ADMIN_ROLE: hasDEFAULT_ADMIN_ROLEOnRegistry },
                    manager: { CERTIFICATE_MANAGER_ROLE: false, OPERATOR_ROLE: false },
                    indaRoot: {
                        PROPERTIES_MANAGER_ROLE: hasPROPERTIES_MANAGER_ROLEOnRoot,
                        USER_MANAGER_ROLE: hasUSER_MANAGER_ROLEOnRoot,
                        GOVERNANCE_ROLE: hasGOVERNANCE_ROLEOnRoot,
                    },
                    propertyRegistry: {
                        PROPERTIES_MANAGER_ROLE: hasPROPERTIES_MANAGER_ROLEOnPropReg,
                        GOVERNANCE_ROLE: hasGOVERNANCE_ROLEOnPropReg,
                    },
                },
                isLoading: false,
                lastVerified: new Date(),
            });

            toast.success('Roles verificados correctamente');
        } catch (error) {
            toast.error(`Error al verificar roles: ${parseContractError(error)}`);
            setRoleSummary(prev => ({ ...prev, isLoading: false }));
        }
    }, [privateKey]);

    const checkManager = useCallback(async (countryCode: string, countryName: string, accountOverride?: string | null) => {
        setLoadingCountry(countryCode);
        try {
            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
            const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
            const countryCodeBytes32 = countryCodeToBytes32(countryCode);

            const managerAddress = await publicClient.readContract({
                address: registryAddress,
                abi: IndahouseRegistryAbi as Abi,
                functionName: 'getManager',
                args: [countryCodeBytes32],
            }) as `0x${string}`;

            const accountToCheck = accountOverride ?? resolveTargetAddress();
            const info = await inspectManager(
                countryCode,
                countryName,
                managerAddress !== ZERO_ADDRESS ? managerAddress : null,
                accountToCheck,
            );

            setManagers(prev => {
                const newMap = new Map(prev);
                newMap.set(countryCode, info);
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
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
                return newMap;
            });
        } finally {
            setLoadingCountry(null);
        }
    }, [inspectManager, resolveTargetAddress]);

    useEffect(() => {
        if (countries && countries.length > 0) {
            countries.forEach((country) => {
                if (!managers.has(country.code)) {
                    checkManager(country.code, country.name);
                }
            });
        }
    }, [countries]);

    const setupManager = async (countryCode: string, countryName: string) => {
        if (!privateKey) {
            toast.error('Ingresá la clave privada del Registry defaultAdmin (o de un OPERATOR/DEFAULT_ADMIN del Manager)');
            return;
        }

        setLoadingCountry(countryCode);
        try {
            const formattedKey = privateKey.startsWith('0x') ? privateKey as `0x${string}` : `0x${privateKey}` as `0x${string}`;
            const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
            const countryCodeBytes32 = countryCodeToBytes32(countryCode);
            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
            const walletClient = createWalletClientWithKey(formattedKey, DEFAULT_CHAIN_ID);
            const signerAddress = walletClient.account.address;
            const target = resolveTargetAddress(signerAddress);

            if (!target) {
                toast.error('Dirección operativa inválida');
                return;
            }

            const existingManager = await publicClient.readContract({
                address: registryAddress,
                abi: IndahouseRegistryAbi as Abi,
                functionName: 'getManager',
                args: [countryCodeBytes32],
            }) as `0x${string}`;

            let managerAddress = existingManager;

            // Step 1: create manager if missing
            if (!managerAddress || managerAddress === ZERO_ADDRESS) {
                const canCreate = await checkHasRole({
                    contractAddress: registryAddress,
                    abi: IndahouseRegistryAbi as Abi,
                    role: ROLE_HASHES.DEFAULT_ADMIN_ROLE,
                    account: signerAddress,
                    chainId: DEFAULT_CHAIN_ID,
                });
                if (!canCreate) {
                    toast.error('La key no tiene DEFAULT_ADMIN_ROLE en IndahouseRegistry. No puede crear el manager.');
                    return;
                }

                toast.info(`Creando manager para ${countryName}...`);
                await executeAndWaitForTransaction({
                    contractAddress: registryAddress,
                    abi: IndahouseRegistryAbi as Abi,
                    functionName: 'createManager',
                    args: [countryCodeBytes32],
                    chainId: DEFAULT_CHAIN_ID,
                    privateKey: formattedKey,
                });

                managerAddress = await publicClient.readContract({
                    address: registryAddress,
                    abi: IndahouseRegistryAbi as Abi,
                    functionName: 'getManager',
                    args: [countryCodeBytes32],
                }) as `0x${string}`;
                toast.success(`Manager creado: ${managerAddress}`);
            }

            const [signerHasDefaultAdmin, signerHasOperator, targetHasOperator, targetHasCert, indaRootAddr, poolInfo] =
                await Promise.all([
                    checkHasRole({
                        contractAddress: managerAddress,
                        abi: ManagerAbi as Abi,
                        role: ROLE_HASHES.DEFAULT_ADMIN_ROLE,
                        account: signerAddress,
                        chainId: DEFAULT_CHAIN_ID,
                    }),
                    checkHasRole({
                        contractAddress: managerAddress,
                        abi: ManagerAbi as Abi,
                        role: ROLE_HASHES.OPERATOR_ROLE,
                        account: signerAddress,
                        chainId: DEFAULT_CHAIN_ID,
                    }),
                    checkHasRole({
                        contractAddress: managerAddress,
                        abi: ManagerAbi as Abi,
                        role: ROLE_HASHES.OPERATOR_ROLE,
                        account: target,
                        chainId: DEFAULT_CHAIN_ID,
                    }),
                    checkHasRole({
                        contractAddress: managerAddress,
                        abi: ManagerAbi as Abi,
                        role: ROLE_HASHES.CERTIFICATE_MANAGER_ROLE,
                        account: target,
                        chainId: DEFAULT_CHAIN_ID,
                    }),
                    publicClient.readContract({
                        address: managerAddress,
                        abi: ManagerAbi as Abi,
                        functionName: 'indaRoot',
                    }) as Promise<`0x${string}`>,
                    publicClient.readContract({
                        address: managerAddress,
                        abi: ManagerAbi as Abi,
                        functionName: 'getPoolInfo',
                    }) as Promise<readonly [`0x${string}`, `0x${string}`, `0x${string}`, boolean]>,
                ]);

            // Step 2: grant OPERATOR (roleAdmin = DEFAULT_ADMIN)
            if (!targetHasOperator) {
                if (!signerHasDefaultAdmin) {
                    toast.error(`La key ${signerAddress.slice(0, 8)}... no tiene DEFAULT_ADMIN en el Manager. No puede otorgar OPERATOR_ROLE.`);
                    return;
                }
                toast.info(`Otorgando OPERATOR_ROLE a ${target}...`);
                await executeAndWaitForTransaction({
                    contractAddress: managerAddress,
                    abi: ManagerAbi as Abi,
                    functionName: 'grantRole',
                    args: [ROLE_HASHES.OPERATOR_ROLE, target],
                    chainId: DEFAULT_CHAIN_ID,
                    privateKey: formattedKey,
                });
                toast.success('OPERATOR_ROLE otorgado');
            }

            // Step 3: grant CERTIFICATE_MANAGER (roleAdmin = OPERATOR)
            if (!targetHasCert) {
                // Re-check: signer needs OPERATOR (defaultAdmin lo recibe en initialize)
                const signerStillHasOp = await checkHasRole({
                    contractAddress: managerAddress,
                    abi: ManagerAbi as Abi,
                    role: ROLE_HASHES.OPERATOR_ROLE,
                    account: signerAddress,
                    chainId: DEFAULT_CHAIN_ID,
                });

                if (!signerStillHasOp) {
                    toast.error('La key no tiene OPERATOR_ROLE en el Manager. No puede otorgar CERTIFICATE_MANAGER_ROLE (roleAdmin=OPERATOR).');
                    return;
                }

                toast.info(`Otorgando CERTIFICATE_MANAGER_ROLE a ${target}...`);
                await executeAndWaitForTransaction({
                    contractAddress: managerAddress,
                    abi: ManagerAbi as Abi,
                    functionName: 'grantRole',
                    args: [ROLE_HASHES.CERTIFICATE_MANAGER_ROLE, target],
                    chainId: DEFAULT_CHAIN_ID,
                    privateKey: formattedKey,
                });
                toast.success('CERTIFICATE_MANAGER_ROLE otorgado');
            }

            // Step 4: initialize pool / wire IndaRoot
            const needsPool = !poolInfo[3] || !indaRootAddr || indaRootAddr === ZERO_ADDRESS;
            if (needsPool) {
                if (!signerHasDefaultAdmin) {
                    toast.error('La key no tiene DEFAULT_ADMIN en el Manager. No puede llamar initializePool.');
                    return;
                }
                toast.info('Inicializando pool e IndaRoot en el Manager...');
                await executeAndWaitForTransaction({
                    contractAddress: managerAddress,
                    abi: ManagerAbi as Abi,
                    functionName: 'initializePool',
                    args: [
                        currentContracts.baseToken as `0x${string}`,
                        currentContracts.indaRoot as `0x${string}`,
                    ],
                    chainId: DEFAULT_CHAIN_ID,
                    privateKey: formattedKey,
                });
                toast.success('Pool / IndaRoot inicializados');
            }

            toast.success(`Manager de ${countryName} listo`);
            await verifyRoles(signerAddress);
            await checkManager(countryCode, countryName, target);
            setSelectedCountry(null);
        } catch (error) {
            toast.error(`Error: ${parseContractError(error)}`);
        } finally {
            setLoadingCountry(null);
        }
    };

    const getStatusInfo = (managerInfo: CountryManagerInfo | undefined) => {
        if (!managerInfo) return { label: 'Sin verificar', color: 'text-muted-foreground', icon: <Info className="w-4 h-4" /> };
        if (managerInfo.status === 'loading') return { label: 'Cargando...', color: 'text-muted-foreground', icon: <Loader2 className="w-4 h-4 animate-spin" /> };
        if (managerInfo.status === 'error') return { label: 'Error', color: 'text-red-500', icon: <XCircle className="w-4 h-4 text-red-500" /> };

        const pending = managerInfo.steps?.filter(s => !s.done) ?? [];
        if (pending.length === 0 && managerInfo.managerAddress) {
            return { label: 'Configurado', color: 'text-green-500', icon: <CheckCircle className="w-4 h-4 text-green-500" /> };
        }
        if (!managerInfo.managerAddress) {
            return { label: 'Sin manager', color: 'text-amber-500', icon: <AlertCircle className="w-4 h-4 text-amber-500" /> };
        }
        return {
            label: `Faltan ${pending.length} paso${pending.length === 1 ? '' : 's'}`,
            color: 'text-amber-500',
            icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
        };
    };

    if (loadingCountries) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border bg-secondary/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-400" />
                            <h3 className="font-semibold">Resumen de Roles</h3>
                        </div>
                        <button
                            onClick={() => setShowRoleCard(!showRoleCard)}
                            className="p-1 hover:bg-secondary/50 rounded transition-colors"
                        >
                            {showRoleCard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Usá la private key del Registry defaultAdmin para completar setup. La wallet operativa es quien necesita CERT para crear tokens.
                    </p>
                </div>

                {showRoleCard && (
                    <div className="p-6 space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Key className="w-4 h-4 text-muted-foreground shrink-0" />
                            <input
                                type="password"
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                                placeholder="Private key Registry defaultAdmin (0x...)"
                                className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={() => verifyRoles()}
                                disabled={!privateKey || roleSummary.isLoading}
                                className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {roleSummary.isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4" />
                                )}
                                Verificar Roles
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Wallet operativa (recibe OPERATOR + CERT)</label>
                            <input
                                type="text"
                                value={targetAddress}
                                onChange={(e) => setTargetAddress(e.target.value)}
                                placeholder="0x7C95... (vacío = address de la private key)"
                                className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                            />
                        </div>

                        {roleSummary.adminAddress && (
                            <div className="space-y-3">
                                <div className="p-3 bg-secondary/30 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Address de la private key</p>
                                    <p className="text-sm font-mono break-all">{roleSummary.adminAddress}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="p-3 bg-secondary/30 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-2">IndaHouseRegistry</p>
                                        <div className="flex items-center gap-2">
                                            {roleSummary.roles.indahouseRegistry.DEFAULT_ADMIN_ROLE ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className="text-sm">DEFAULT_ADMIN_ROLE</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-secondary/30 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-2">IndaRoot</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {roleSummary.roles.indaRoot.PROPERTIES_MANAGER_ROLE ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className="text-xs">PROPERTIES_MANAGER</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {roleSummary.roles.indaRoot.USER_MANAGER_ROLE ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className="text-xs">USER_MANAGER</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {roleSummary.roles.indaRoot.GOVERNANCE_ROLE ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className="text-xs">GOVERNANCE</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-secondary/30 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-2">PropertyRegistry</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {roleSummary.roles.propertyRegistry.PROPERTIES_MANAGER_ROLE ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className="text-xs">PROPERTIES_MANAGER</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {roleSummary.roles.propertyRegistry.GOVERNANCE_ROLE ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className="text-xs">GOVERNANCE</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-secondary/30 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-2">Acciones Disponibles</p>
                                        <div className="space-y-1 text-xs">
                                            {roleSummary.roles.indahouseRegistry.DEFAULT_ADMIN_ROLE ? (
                                                <p className="text-green-500">✓ Crear managers + initializePool</p>
                                            ) : (
                                                <p className="text-red-500">✗ No es Registry defaultAdmin</p>
                                            )}
                                            {roleSummary.roles.indaRoot.PROPERTIES_MANAGER_ROLE ? (
                                                <p className="text-green-500">✓ Registrar propiedades</p>
                                            ) : (
                                                <p className="text-red-500">✗ No puede registrar propiedades</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {roleSummary.lastVerified && (
                                    <p className="text-xs text-muted-foreground text-right">
                                        Última verificación: {roleSummary.lastVerified.toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                        )}

                        {!roleSummary.adminAddress && (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                                Ingresá la private key del defaultAdmin y la wallet operativa, luego verificá / configurá cada país.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border bg-secondary/10">
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-semibold">Managers por País</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Pasos: manager → OPERATOR → CERTIFICATE_MANAGER → initializePool (IndaRoot).
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid gap-3">
                        {countries?.map((country) => {
                            const managerInfo = managers.get(country.code);
                            const isLoading = loadingCountry === country.code;
                            const isSelected = selectedCountry === country.code;
                            const statusInfo = getStatusInfo(managerInfo);
                            const pendingSteps = managerInfo?.steps?.filter(s => !s.done) ?? [];
                            const needsSetup = managerInfo?.status === 'needs_setup' || !managerInfo?.managerAddress;

                            return (
                                <div
                                    key={country.id}
                                    className={`p-4 rounded-lg border ${
                                        managerInfo?.status === 'ready'
                                            ? 'bg-green-500/5 border-green-500/20'
                                            : needsSetup
                                                ? 'bg-amber-500/5 border-amber-500/20'
                                                : 'bg-secondary/30 border-border'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                            ) : (
                                                statusInfo.icon
                                            )}
                                            <div>
                                                <p className="font-medium">{country.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {country.code}
                                                    {managerInfo?.managerAddress && (
                                                        <>
                                                            {' • '}
                                                            <span className="font-mono">
                                                                {managerInfo.managerAddress.slice(0, 10)}...{managerInfo.managerAddress.slice(-6)}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs px-2 py-1 rounded ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            <button
                                                onClick={() => checkManager(country.code, country.name)}
                                                disabled={isLoading}
                                                className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                                            >
                                                <RefreshCw className="w-3 h-3 inline mr-1" />
                                                Verificar
                                            </button>
                                            {needsSetup && (
                                                <button
                                                    onClick={() => setSelectedCountry(isSelected ? null : country.code)}
                                                    disabled={isLoading}
                                                    className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                                                >
                                                    <Settings className="w-3 h-3 inline mr-1" />
                                                    Completar setup
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {managerInfo?.steps && (
                                        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                                            {managerInfo.steps.map((step) => (
                                                <div key={step.id} className="flex items-start gap-2 text-xs">
                                                    {step.unknown ? (
                                                        <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                                    ) : step.done ? (
                                                        <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                                                    ) : (
                                                        <XCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                                    )}
                                                    <div>
                                                        <p className={
                                                            step.unknown ? 'text-muted-foreground'
                                                                : step.done ? 'text-green-600' : 'text-amber-600'
                                                        }>
                                                            {step.label}
                                                        </p>
                                                        <p className="text-muted-foreground">{step.detail}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {managerInfo?.managerAddress && (
                                        <p className="mt-2 text-xs text-muted-foreground font-mono">
                                            indaRoot: {managerInfo.indaRoot && managerInfo.indaRoot !== ZERO_ADDRESS
                                                ? `${managerInfo.indaRoot.slice(0, 10)}...${managerInfo.indaRoot.slice(-6)}`
                                                : '0x0 (falta initializePool)'}
                                            {' • '}
                                            pool: {managerInfo.poolInitialized ? 'ok' : 'no'}
                                            {managerInfo.checkedFor && (
                                                <>
                                                    {' • '}roles para {managerInfo.checkedFor.slice(0, 6)}...{managerInfo.checkedFor.slice(-4)}
                                                </>
                                            )}
                                        </p>
                                    )}

                                    {isSelected && (
                                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                                            <div className="flex items-start gap-2 text-sm text-amber-600">
                                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    {pendingSteps.length > 0
                                                        ? `Pendiente: ${pendingSteps.map(s => s.label).join(' → ')}`
                                                        : `Configurar manager de ${country.name}`}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                La private key debe ser del Registry defaultAdmin (tiene DEFAULT_ADMIN + OPERATOR en el Manager al crearlo).
                                                La wallet operativa recibe OPERATOR + CERTIFICATE_MANAGER.
                                            </p>
                                            <input
                                                type="password"
                                                value={privateKey}
                                                onChange={(e) => setPrivateKey(e.target.value)}
                                                placeholder="Private key defaultAdmin (0x...)"
                                                className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <input
                                                type="text"
                                                value={targetAddress}
                                                onChange={(e) => setTargetAddress(e.target.value)}
                                                placeholder="Wallet operativa 0x... (ej. la que usa el admin al crear tokens)"
                                                className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedCountry(null)}
                                                    className="px-3 py-1.5 text-xs border border-border hover:bg-secondary/50 rounded-lg transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => setupManager(country.code, country.name)}
                                                    disabled={!privateKey || isLoading}
                                                    className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        'Ejecutar pasos faltantes'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {managerInfo?.error && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <div className="flex items-start gap-2 text-sm text-red-500">
                                                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>{managerInfo.error}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
