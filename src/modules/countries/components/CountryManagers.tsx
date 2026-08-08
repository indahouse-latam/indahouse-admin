'use client';

import { useState, useEffect, useCallback } from 'react';
import { Globe, CheckCircle, XCircle, Loader2, Settings, AlertCircle, Shield, RefreshCw, Info, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { useCountries } from '@/modules/properties/hooks/useCountries';
import { createUserPublicClient, executeAndWaitForTransaction, createWalletClientWithKey, checkHasRole, parseContractError } from '@/utils/blockchain.utils';
import type { Abi } from 'viem';
import { currentContracts, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { IndahouseRegistryAbi, ManagerAbi, IndaRootAbi, PropertyRegistryAbi } from '@/config/abis';
import { toast } from 'sonner';

const ROLE_HASHES = {
    DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000' as const,
    CERTIFICATE_MANAGER_ROLE: '0x793fafc4216e31eb47b95467a5d6c852611bb7e4df768602288844840c234392' as const,
    PROPERTIES_MANAGER_ROLE: '0x5caba2aa072f9476eef4eba05f22235aef4612b73d339428b33d92eca0aabf20' as const,
    USER_MANAGER_ROLE: '0x5ebedfa6104e4963a67c17c9b73e50a627c5307e1a07c68dd391bb0e4fc974d3' as const,
    GOVERNANCE_ROLE: '0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1' as const,
    OPERATOR_ROLE: '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929' as const,
} as const;

function countryCodeToBytes32(code: string): `0x${string}` {
    const upperCode = code.toUpperCase();
    return `0x${upperCode
        .split('')
        .map(c => c.charCodeAt(0).toString(16))
        .join('')
        .padEnd(64, '0')}` as `0x${string}`;
}

interface RoleStatus {
    indahouseRegistry: {
        DEFAULT_ADMIN_ROLE: boolean;
    };
    manager: {
        CERTIFICATE_MANAGER_ROLE: boolean;
        OPERATOR_ROLE: boolean;
    };
    indaRoot: {
        PROPERTIES_MANAGER_ROLE: boolean;
        USER_MANAGER_ROLE: boolean;
        GOVERNANCE_ROLE: boolean;
    };
    propertyRegistry: {
        PROPERTIES_MANAGER_ROLE: boolean;
        GOVERNANCE_ROLE: boolean;
    };
}

interface CountryManagerInfo {
    countryCode: string;
    countryName: string;
    managerAddress: string | null;
    status: 'loading' | 'ready' | 'error' | 'needs_setup';
    error?: string;
    managerRoles?: {
        CERTIFICATE_MANAGER_ROLE: boolean;
        OPERATOR_ROLE: boolean;
    };
}

interface RoleSummary {
    adminAddress: string | null;
    roles: RoleStatus;
    isLoading: boolean;
    lastVerified: Date | null;
}

export function CountryManagers() {
    const { data: countries, isLoading: loadingCountries } = useCountries();
    const [managers, setManagers] = useState<Map<string, CountryManagerInfo>>(new Map());
    const [loadingCountry, setLoadingCountry] = useState<string | null>(null);
    const [privateKey, setPrivateKey] = useState('');
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
            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);

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

    const checkManagerRoles = useCallback(async (countryCode: string, managerAddress: string, adminAddress: string) => {
        try {
            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);

            const [hasCertRole, hasOperatorRole] = await Promise.all([
                checkHasRole({
                    contractAddress: managerAddress as `0x${string}`,
                    abi: ManagerAbi as Abi,
                    role: ROLE_HASHES.CERTIFICATE_MANAGER_ROLE,
                    account: adminAddress as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                }),
                checkHasRole({
                    contractAddress: managerAddress as `0x${string}`,
                    abi: ManagerAbi as Abi,
                    role: ROLE_HASHES.OPERATOR_ROLE,
                    account: adminAddress as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                }),
            ]);

            setManagers(prev => {
                const newMap = new Map(prev);
                const existing = newMap.get(countryCode);
                if (existing) {
                    newMap.set(countryCode, {
                        ...existing,
                        managerRoles: {
                            CERTIFICATE_MANAGER_ROLE: hasCertRole,
                            OPERATOR_ROLE: hasOperatorRole,
                        },
                    });
                }
                return newMap;
            });
        } catch (error) {
            console.error(`Error checking manager roles for ${countryCode}:`, error);
        }
    }, []);

    useEffect(() => {
        if (countries && countries.length > 0) {
            countries.forEach((country) => {
                if (!managers.has(country.code)) {
                    checkManager(country.code, country.name);
                }
            });
        }
    }, [countries]);

    useEffect(() => {
        if (roleSummary.adminAddress && privateKey) {
            verifyRoles(roleSummary.adminAddress);
        }
    }, [privateKey]);

    const checkManager = async (countryCode: string, countryName: string) => {
        setLoadingCountry(countryCode);
        try {
            const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);
            const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
            const countryCodeBytes32 = countryCodeToBytes32(countryCode);
            const zeroAddress = '0x0000000000000000000000000000000000000000';

            const managerAddress = await publicClient.readContract({
                address: registryAddress,
                abi: IndahouseRegistryAbi as Abi,
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
                    status: exists ? 'ready' : 'needs_setup',
                });
                return newMap;
            });

            if (exists && roleSummary.adminAddress) {
                await checkManagerRoles(countryCode, managerAddress, roleSummary.adminAddress);
            }
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
    };

    const setupManager = async (countryCode: string, countryName: string) => {
        if (!privateKey) {
            toast.error('Por favor ingresa la clave privada maestra');
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

            toast.info('Verificando permisos del administrador...');

            const hasAdminRole = await checkHasRole({
                contractAddress: registryAddress,
                abi: IndahouseRegistryAbi as Abi,
                role: ROLE_HASHES.DEFAULT_ADMIN_ROLE,
                account: adminAddress,
                chainId: DEFAULT_CHAIN_ID,
            });

            if (!hasAdminRole) {
                toast.error('No tienes el rol DEFAULT_ADMIN_ROLE en IndahouseRegistry. No puedes crear managers.');
                setLoadingCountry(null);
                return;
            }

            toast.success('Permiso verificado. Verificando manager existente...');

            const existingManager = await publicClient.readContract({
                address: registryAddress,
                abi: IndahouseRegistryAbi as Abi,
                functionName: 'getManager',
                args: [countryCodeBytes32],
            }) as `0x${string}`;

            let managerAddress: string;

            if (existingManager && existingManager !== zeroAddress) {
                managerAddress = existingManager;
                toast.info(`Manager ya existe en ${managerAddress}. Otorgando rol de certificate manager...`);

                try {
                    await executeAndWaitForTransaction({
                        contractAddress: managerAddress as `0x${string}`,
                        abi: ManagerAbi as Abi,
                        functionName: 'grantRole',
                        args: [ROLE_HASHES.CERTIFICATE_MANAGER_ROLE, adminAddress],
                        chainId: DEFAULT_CHAIN_ID,
                        privateKey: formattedKey,
                    });
                    toast.success('Rol de Certificate Manager otorgado correctamente');
                } catch (error) {
                    if (error instanceof Error && error.message.includes('AccessControl')) {
                        toast.error('Error de permisos: No tienes autoridad para otorgar este rol en el manager');
                    } else {
                        throw error;
                    }
                }
            } else {
                toast.info(`Creando manager para ${countryName}...`);

                try {
                    await executeAndWaitForTransaction({
                        contractAddress: registryAddress,
                        abi: IndahouseRegistryAbi as Abi,
                        functionName: 'createManager',
                        args: [countryCodeBytes32],
                        chainId: DEFAULT_CHAIN_ID,
                        privateKey: formattedKey,
                    });
                } catch (error) {
                    const errorMsg = parseContractError(error);
                    if (errorMsg.includes('AccessControl') || errorMsg.includes('AccessDenied')) {
                        toast.error('Error de permisos: No tienes el rol necesario para crear managers en IndahouseRegistry');
                    } else {
                        toast.error(`Error al crear manager: ${errorMsg}`);
                    }
                    throw error;
                }

                managerAddress = await publicClient.readContract({
                    address: registryAddress,
                    abi: IndahouseRegistryAbi as Abi,
                    functionName: 'getManager',
                    args: [countryCodeBytes32],
                }) as string;

                toast.info(`Manager creado en ${managerAddress}. Otorgando rol de certificate manager...`);

                try {
                    await executeAndWaitForTransaction({
                        contractAddress: managerAddress as `0x${string}`,
                        abi: ManagerAbi as Abi,
                        functionName: 'grantRole',
                        args: [ROLE_HASHES.CERTIFICATE_MANAGER_ROLE, adminAddress],
                        chainId: DEFAULT_CHAIN_ID,
                        privateKey: formattedKey,
                    });
                    toast.success('Rol de Certificate Manager otorgado correctamente');
                } catch (error) {
                    const errorMsg = parseContractError(error);
                    toast.warning(`Manager creado pero error al otorgar rol: ${errorMsg}`);
                }
            }

            toast.success(`Manager para ${countryName} configurado correctamente!`);

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

            await verifyRoles(adminAddress);
            await checkManagerRoles(countryCode, managerAddress, adminAddress);

            setSelectedCountry(null);
            setPrivateKey('');
        } catch (error) {
            if (!(error instanceof Error && error.message.includes('AccessControl'))) {
                toast.error(`Error: ${parseContractError(error)}`);
            }
        } finally {
            setLoadingCountry(null);
        }
    };

    const getStatusInfo = (managerInfo: CountryManagerInfo | undefined) => {
        if (!managerInfo) return { label: 'Sin verificar', color: 'text-muted-foreground', icon: <Info className="w-4 h-4" /> };
        if (managerInfo.status === 'loading') return { label: 'Cargando...', color: 'text-muted-foreground', icon: <Loader2 className="w-4 h-4 animate-spin" /> };
        if (managerInfo.status === 'error') return { label: 'Error', color: 'text-red-500', icon: <XCircle className="w-4 h-4 text-red-500" /> };
        if (!managerInfo.managerAddress) return { label: 'Sin configurar', color: 'text-amber-500', icon: <AlertCircle className="w-4 h-4 text-amber-500" /> };

        const hasCertRole = managerInfo.managerRoles?.CERTIFICATE_MANAGER_ROLE;
        const hasOperatorRole = managerInfo.managerRoles?.OPERATOR_ROLE;

        if (hasCertRole) return { label: 'Configurado', color: 'text-green-500', icon: <CheckCircle className="w-4 h-4 text-green-500" /> };
        if (hasOperatorRole) return { label: 'Operador', color: 'text-blue-500', icon: <Shield className="w-4 h-4 text-blue-500" /> };
        return { label: 'Needs Setup', color: 'text-amber-500', icon: <AlertCircle className="w-4 h-4 text-amber-500" /> };
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
                        Verifica qué roles tiene el administrador en los contratos.
                    </p>
                </div>

                {showRoleCard && (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Key className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="password"
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                                placeholder="Clave privada del admin (0x...)"
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

                        {roleSummary.adminAddress && (
                            <div className="space-y-3">
                                <div className="p-3 bg-secondary/30 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Dirección del Admin</p>
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
                                                    <XCircle className="w-4 h-500" />
                                                )}
                                                <span className="text-xs">GOVERNANCE</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-secondary/30 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-2">Acciones Disponibles</p>
                                        <div className="space-y-1 text-xs">
                                            {roleSummary.roles.indahouseRegistry.DEFAULT_ADMIN_ROLE ? (
                                                <p className="text-green-500">✓ Crear managers</p>
                                            ) : (
                                                <p className="text-red-500">✗ No puede crear managers</p>
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
                                Ingresa tu clave privada y haz clic en "Verificar Roles" para ver el resumen de permisos.
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
                        Gestiona los managers de contratos inteligentes para cada país soportado.
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid gap-3">
                        {countries?.map((country) => {
                            const managerInfo = managers.get(country.code);
                            const isLoading = loadingCountry === country.code;
                            const isSelected = selectedCountry === country.code;
                            const statusInfo = getStatusInfo(managerInfo);

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

                                        <div className="flex items-center gap-3">
                                            {managerInfo?.managerAddress && managerInfo.managerRoles && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className={`${managerInfo.managerRoles.CERTIFICATE_MANAGER_ROLE ? 'text-green-500' : 'text-red-500'}`}>
                                                        Cert:{managerInfo.managerRoles.CERTIFICATE_MANAGER_ROLE ? '✓' : '✗'}
                                                    </span>
                                                    <span className={`${managerInfo.managerRoles.OPERATOR_ROLE ? 'text-green-500' : 'text-red-500'}`}>
                                                        Op:{managerInfo.managerRoles.OPERATOR_ROLE ? '✓' : '✗'}
                                                    </span>
                                                </div>
                                            )}
                                            <span className={`text-xs px-2 py-1 rounded ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            {!managerInfo && (
                                                <button
                                                    onClick={() => checkManager(country.code, country.name)}
                                                    disabled={isLoading}
                                                    className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                                                >
                                                    Verificar
                                                </button>
                                            )}
                                            {managerInfo && !managerInfo.managerAddress && (
                                                <button
                                                    onClick={() => setSelectedCountry(isSelected ? null : country.code)}
                                                    disabled={isLoading}
                                                    className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                                                >
                                                    <Settings className="w-3 h-3 inline mr-1" />
                                                    Configurar
                                                </button>
                                            )}
                                            {managerInfo?.managerAddress && roleSummary.adminAddress && (
                                                <button
                                                    onClick={() => checkManagerRoles(country.code, managerInfo.managerAddress!, roleSummary.adminAddress!)}
                                                    disabled={isLoading}
                                                    className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                                                >
                                                    <RefreshCw className="w-3 h-3 inline mr-1" />
                                                    Verificar Roles
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                                            <div className="flex items-start gap-2 text-sm text-amber-500">
                                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>No se encontró manager para {country.name}. Ingresa la clave privada maestra para crear uno.</span>
                                            </div>
                                            {!roleSummary.roles.indahouseRegistry.DEFAULT_ADMIN_ROLE && privateKey && (
                                                <div className="flex items-start gap-2 text-sm text-red-500">
                                                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span>Advertencia: La dirección actual no tiene DEFAULT_ADMIN_ROLE en IndahouseRegistry.</span>
                                                </div>
                                            )}
                                            <input
                                                type="password"
                                                value={privateKey}
                                                onChange={(e) => setPrivateKey(e.target.value)}
                                                placeholder="Clave privada maestra (0x...)"
                                                className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setSelectedCountry(null); }}
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
                                                        'Crear Manager'
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
                                            <button
                                                onClick={() => checkManager(country.code, country.name)}
                                                className="mt-2 px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                                            >
                                                Reintentar
                                            </button>
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
