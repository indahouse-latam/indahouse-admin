'use client';

import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import {
    Shield,
    Key,
    Wallet,
    CheckCircle,
    XCircle,
    Loader2,
    AlertTriangle,
    RefreshCw
} from "lucide-react";
import {
    IndaRootAbi,
    PropertyRegistryAbi,
    RouterAbi,
    IndaAdminRouterAbi,
    IndahouseRegistryAbi,
    CommitFactoryAbi,
    ManagerAbi
} from "@/config/abis";
import { checkHasRole, executeContractWriteWithKey, waitForTransaction, createUserPublicClient } from "@/utils/blockchain.utils";
import { currentContracts, DEFAULT_CHAIN_ID } from "@/config/contracts";
import { Abi, isAddress } from "viem";
import { getPrivateKeyFromLocalStorage } from "@/utils/nyx-wallet.ultils";

// Contract addresses según entorno (QA = Polygon Amoy, Production = Polygon)
const POLYGON_CONTRACTS = {
    indaRoot: currentContracts.indaRoot as `0x${string}`,
    propertyRegistry: currentContracts.PropertyRegistry as `0x${string}`,
};

// Role hashes from production guide
const ROLE_HASHES = {
    PROPERTIES_MANAGER_ROLE: '0x5caba2aa072f9476eef4eba05f22235aef4612b73d339428b33d92eca0aabf20' as `0x${string}`,
    USER_MANAGER_ROLE: '0x5ebedfa6104e4963a67c17c9b73e50a627c5307e1a07c68dd391bb0e4fc974d3' as `0x${string}`,
    GOVERNANCE_ROLE: '0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1' as `0x${string}`,
    OPERATOR_ROLE: '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929' as `0x${string}`,
    CERTIFICATE_MANAGER_ROLE: '0x793fafc4216e31eb47b95467a5d6c852611bb7e4df768602288844840c234392' as `0x${string}`,
};

type RoleStatus = 'unchecked' | 'checking' | 'granted' | 'not_granted' | 'error';
type GrantStatus = 'idle' | 'granting' | 'success' | 'error';
type AdminTransferStatus = 'idle' | 'checking' | 'pending' | 'transferring' | 'completed' | 'failed';

interface RoleOption {
    id: string;
    label: string;
    description: string;
    roleHash: `0x${string}`;
    contractKey: 'indaRoot' | 'propertyRegistry' | 'indaAdminRouter' | 'manager';
    status: RoleStatus;
    grantStatus: GrantStatus;
    selected: boolean;
}

interface AdminTransferContract {
    id: string;
    label: string;
    contractKey: keyof typeof currentContracts;
    abiName: 'RouterAbi' | 'IndaAdminRouterAbi' | 'IndahouseRegistryAbi' | 'CommitFactoryAbi' | 'ManagerAbi' | 'IndaRootAbi';
    status: AdminTransferStatus;
    selected: boolean;
    currentAdmin?: string;
    pendingAdmin?: string;
    errorMessage?: string;
    txHash?: string;
    // Manager uses beginAdminTransfer/acceptAdminTransfer instead of beginDefaultAdminTransfer/acceptDefaultAdminTransfer
    useCustomFunctions?: boolean;
}


export default function RolesPage() {
    // Tab state
    const [activeTab, setActiveTab] = useState<'admin' | 'roles'>('admin');

    // Role management state
    const [privateKey, setPrivateKey] = useState('');
    const [targetAddress, setTargetAddress] = useState('');
    const [isGranting, setIsGranting] = useState(false);
    const [isCheckingRoles, setIsCheckingRoles] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Admin transfer state
    const [deployerKey, setDeployerKey] = useState('');
    const [newAdminAddress, setNewAdminAddress] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [isBeginning, setIsBeginning] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [autoDetectedAdminKey, setAutoDetectedAdminKey] = useState(false);


    const [adminContracts, setAdminContracts] = useState<AdminTransferContract[]>([
        {
            id: 'router',
            label: 'TransactionRouter',
            contractKey: 'router',
            abiName: 'RouterAbi',
            status: 'idle',
            selected: false,
        },
        {
            id: 'adminRouter',
            label: 'IndaAdminRouter',
            contractKey: 'IndaAdminRouter',
            abiName: 'IndaAdminRouterAbi',
            status: 'idle',
            selected: false,
        },
        {
            id: 'registry',
            label: 'IndahouseRegistry',
            contractKey: 'indahouseRegistry',
            abiName: 'IndahouseRegistryAbi',
            status: 'idle',
            selected: false,
        },
        {
            id: 'commitFactory',
            label: 'CommitFactory',
            contractKey: 'commitFactory',
            abiName: 'CommitFactoryAbi',
            status: 'idle',
            selected: false,
        },
        {
            id: 'manager',
            label: 'Manager',
            contractKey: 'manager',
            abiName: 'ManagerAbi',
            status: 'idle',
            selected: false,
            useCustomFunctions: true, // Uses beginAdminTransfer/acceptAdminTransfer
        },
        {
            id: 'indaRoot',
            label: 'IndaRoot',
            contractKey: 'indaRoot',
            abiName: 'IndaRootAbi',
            status: 'idle',
            selected: false,
        },
    ]);


    const [roles, setRoles] = useState<RoleOption[]>([
        {
            id: 'prop_manager_indaroot',
            label: 'Properties Manager (IndaRoot)',
            description: 'Gestionar propiedades en IndaRoot',
            roleHash: ROLE_HASHES.PROPERTIES_MANAGER_ROLE,
            contractKey: 'indaRoot',
            status: 'unchecked',
            grantStatus: 'idle',
            selected: false,
        },
        {
            id: 'prop_manager_registry',
            label: 'Properties Manager (PropertyRegistry)',
            description: 'Registrar propiedades (registerProperty)',
            roleHash: ROLE_HASHES.PROPERTIES_MANAGER_ROLE,
            contractKey: 'propertyRegistry',
            status: 'unchecked',
            grantStatus: 'idle',
            selected: false,
        },
        {
            id: 'user_manager',
            label: 'User Manager (IndaRoot)',
            description: 'Whitelist de usuarios y campañas (_setToWhitelist)',
            roleHash: ROLE_HASHES.USER_MANAGER_ROLE,
            contractKey: 'indaRoot',
            status: 'unchecked',
            grantStatus: 'idle',
            selected: false,
        },
        {
            id: 'governance_indaroot',
            label: 'Governance (IndaRoot)',
            description: 'Ejecutar buyouts de propiedades',
            roleHash: ROLE_HASHES.GOVERNANCE_ROLE,
            contractKey: 'indaRoot',
            status: 'unchecked',
            grantStatus: 'idle',
            selected: false,
        },
        {
            id: 'governance_registry',
            label: 'Governance (PropertyRegistry)',
            description: 'Ejecutar buyouts en PropertyRegistry',
            roleHash: ROLE_HASHES.GOVERNANCE_ROLE,
            contractKey: 'propertyRegistry',
            status: 'unchecked',
            grantStatus: 'idle',
            selected: false,
        },
        {
            id: 'operator_admin_router',
            label: 'Operator (IndaAdminRouter)',
            description: 'Permisos de operador en IndaAdminRouter',
            roleHash: ROLE_HASHES.OPERATOR_ROLE,
            contractKey: 'indaAdminRouter',
            status: 'unchecked',
            grantStatus: 'idle',
            selected: false,
        },
        {
            id: 'operator_manager',
            label: 'Operator (Manager)',
            description: 'Permisos de operador en el contract Manager',
            roleHash: ROLE_HASHES.OPERATOR_ROLE,
            contractKey: 'manager',
            status: 'unchecked',
            grantStatus: 'idle',
            selected: false,
        },
        {
            id: 'certificate_manager',
            label: 'Certificate Manager (Manager)',
            description: 'Crear CMDs y mint de NFTs de certificados',
            roleHash: ROLE_HASHES.CERTIFICATE_MANAGER_ROLE,
            contractKey: 'manager',
            status: 'unchecked',
            grantStatus: 'idle',
            selected: false,
        },
    ]);

    const getContractAddress = (key: string): `0x${string}` => {
        switch (key) {
            case 'indaRoot':
                return POLYGON_CONTRACTS.indaRoot;
            case 'propertyRegistry':
                return POLYGON_CONTRACTS.propertyRegistry;
            case 'indaAdminRouter':
                return currentContracts.IndaAdminRouter as `0x${string}`;
            case 'manager':
                return currentContracts.manager as `0x${string}`;
            default:
                throw new Error(`Unknown contract key: ${key}`);
        }
    };

    const getAbiForContract = (key: string) => {
        switch (key) {
            case 'indaRoot':
                return IndaRootAbi;
            case 'propertyRegistry':
                return PropertyRegistryAbi;
            case 'indaAdminRouter':
                return IndaAdminRouterAbi;
            case 'manager':
                return ManagerAbi;
            default:
                return IndaRootAbi;
        }
    };

    // Admin transfer helpers
    const getAbiForAdminContract = (abiName: string) => {
        switch (abiName) {
            case 'RouterAbi':
                return RouterAbi;
            case 'IndaAdminRouterAbi':
                return IndaAdminRouterAbi;
            case 'IndahouseRegistryAbi':
                return IndahouseRegistryAbi;
            case 'CommitFactoryAbi':
                return CommitFactoryAbi;
            case 'ManagerAbi':
                return ManagerAbi;
            case 'PropertyRegistryAbi':
                return PropertyRegistryAbi;
            case 'IndaRootAbi':
                return IndaRootAbi;
            default:
                throw new Error(`Unknown ABI: ${abiName}`);
        }
    };

    const getAdminContractAddress = (contractKey: string): `0x${string}` => {
        return currentContracts[contractKey as keyof typeof currentContracts] as `0x${string}`;
    };

    const updateAdminContract = (id: string, updates: Partial<AdminTransferContract>) => {
        setAdminContracts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const toggleAdminContract = (id: string) => {
        setAdminContracts(prev => prev.map(c =>
            c.id === id ? { ...c, selected: !c.selected } : c
        ));
    };

    const autoDetectAdminKey = async (address: string) => {
        try {
            const localstorageUser = localStorage.getItem('admin_user');
            if (!localstorageUser) return;

            const user = JSON.parse(localstorageUser);
            const userAddress = user.walletAddress;

            if (userAddress && userAddress.toLowerCase() === address.toLowerCase()) {
                const privateKey = await getPrivateKeyFromLocalStorage();
                setAdminKey(privateKey);
                setAutoDetectedAdminKey(true);
            }
        } catch (err) {
            console.error('Could not auto-detect admin key:', err);
        }
    };

    const checkAdminStatus = async () => {
        for (const contract of adminContracts) {
            updateAdminContract(contract.id, { status: 'checking' });

            try {
                const abi = getAbiForAdminContract(contract.abiName);
                const address = getAdminContractAddress(contract.contractKey);
                const publicClient = createUserPublicClient(DEFAULT_CHAIN_ID);

                // Try to get current admin
                let currentAdmin: string | undefined;
                try {
                    currentAdmin = await publicClient.readContract({
                        address,
                        abi,
                        functionName: 'defaultAdmin',
                        args: []
                    }) as string;
                } catch {
                    try {
                        currentAdmin = await publicClient.readContract({
                            address,
                            abi,
                            functionName: 'admin',
                            args: []
                        }) as string;
                    } catch (e) {
                        console.error(`Could not read admin for ${contract.label}:`, e);
                    }
                }

                // Try to get pending admin
                let pendingAdmin: string | undefined;
                try {
                    const pendingData = await publicClient.readContract({
                        address,
                        abi,
                        functionName: 'pendingDefaultAdmin',
                        args: []
                    }) as any;

                    // pendingDefaultAdmin returns (address newAdmin, uint48 schedule)
                    if (Array.isArray(pendingData)) {
                        pendingAdmin = pendingData[0];
                    } else {
                        pendingAdmin = pendingData;
                    }
                } catch (e) {
                    // No pending admin
                }

                updateAdminContract(contract.id, {
                    currentAdmin,
                    pendingAdmin,
                    status: pendingAdmin && pendingAdmin !== '0x0000000000000000000000000000000000000000' ? 'pending' : 'idle'
                });
            } catch (err) {
                console.error(`Error checking ${contract.label}:`, err);
                updateAdminContract(contract.id, { status: 'failed' });
            }
        }
    };

    const beginAdminTransfer = async () => {
        const selectedContracts = adminContracts.filter(c => c.selected);

        if (selectedContracts.length === 0) {
            setError('Please select at least one contract');
            return;
        }

        if (!deployerKey) {
            setError('Please enter the deployer private key');
            return;
        }

        if (!newAdminAddress || !isAddress(newAdminAddress)) {
            setError('Please enter a valid new admin address');
            return;
        }

        const formattedKey = deployerKey.startsWith('0x') ? deployerKey : `0x${deployerKey}`;
        if (formattedKey.length !== 66) {
            setError('Invalid deployer private key format');
            return;
        }

        setIsBeginning(true);
        setError(null);
        setSuccessMessage(null);

        let successCount = 0;
        let errorCount = 0;
        const failedContracts: string[] = [];

        for (const contract of selectedContracts) {
            updateAdminContract(contract.id, { status: 'transferring', errorMessage: undefined });

            try {
                const abi = getAbiForAdminContract(contract.abiName);
                const address = getAdminContractAddress(contract.contractKey);

                console.log(`🔄 Beginning transfer for ${contract.label}...`);

                // Manager uses beginAdminTransfer, others use beginDefaultAdminTransfer
                const functionName = contract.useCustomFunctions ? 'beginAdminTransfer' : 'beginDefaultAdminTransfer';

                const hash = await executeContractWriteWithKey({
                    privateKey: formattedKey as `0x${string}`,
                    contractAddress: address,
                    abi: abi as Abi,
                    functionName,
                    args: [newAdminAddress],
                    chainId: DEFAULT_CHAIN_ID
                });

                console.log(`✅ Transaction sent for ${contract.label}: ${hash}`);

                await waitForTransaction({ hash, chainId: DEFAULT_CHAIN_ID });

                console.log(`✅ Transfer initiated for ${contract.label}`);

                updateAdminContract(contract.id, {
                    status: 'pending',
                    pendingAdmin: newAdminAddress,
                    selected: false,
                    txHash: hash,
                    errorMessage: undefined
                });
                successCount++;
            } catch (err: any) {
                console.error(`❌ Error beginning transfer for ${contract.label}:`, err);

                const errorMsg = err.shortMessage || err.message || 'Unknown error';
                failedContracts.push(contract.label);

                updateAdminContract(contract.id, {
                    status: 'failed',
                    errorMessage: errorMsg
                });
                errorCount++;
            }
        }

        setIsBeginning(false);

        if (successCount > 0 && errorCount === 0) {
            setSuccessMessage(`✅ Successfully initiated admin transfer for ${successCount} contract(s)`);
            autoDetectAdminKey(newAdminAddress);
        } else if (successCount > 0 && errorCount > 0) {
            setError(`⚠️ ${successCount} succeeded, ${errorCount} failed: ${failedContracts.join(', ')}`);
            setSuccessMessage(`✅ ${successCount} contract(s) ready for acceptance`);
            autoDetectAdminKey(newAdminAddress);
        } else if (errorCount > 0) {
            setError(`❌ Failed to initiate transfer for: ${failedContracts.join(', ')}`);
        }
    };

    const acceptAdminTransfer = async () => {
        const pendingContracts = adminContracts.filter(c => c.status === 'pending');

        if (pendingContracts.length === 0) {
            setError('No pending admin transfers to accept');
            return;
        }

        if (!adminKey) {
            setError('Please enter the new admin private key');
            return;
        }

        const formattedKey = adminKey.startsWith('0x') ? adminKey : `0x${adminKey}`;
        if (formattedKey.length !== 66) {
            setError('Invalid admin private key format');
            return;
        }

        setIsAccepting(true);
        setError(null);
        setSuccessMessage(null);

        let successCount = 0;
        let errorCount = 0;
        const failedContracts: string[] = [];

        for (const contract of pendingContracts) {
            updateAdminContract(contract.id, { status: 'transferring', errorMessage: undefined });

            try {
                const abi = getAbiForAdminContract(contract.abiName);
                const address = getAdminContractAddress(contract.contractKey);

                console.log(`🔄 Accepting transfer for ${contract.label}...`);

                // Manager uses acceptAdminTransfer, others use acceptDefaultAdminTransfer
                const functionName = contract.useCustomFunctions ? 'acceptAdminTransfer' : 'acceptDefaultAdminTransfer';

                const hash = await executeContractWriteWithKey({
                    privateKey: formattedKey as `0x${string}`,
                    contractAddress: address,
                    abi,
                    functionName,
                    args: [],
                    chainId: DEFAULT_CHAIN_ID
                });

                console.log(`✅ Transaction sent for ${contract.label}: ${hash}`);

                await waitForTransaction({ hash, chainId: DEFAULT_CHAIN_ID });

                console.log(`✅ Transfer accepted for ${contract.label}`);

                updateAdminContract(contract.id, {
                    status: 'completed',
                    currentAdmin: contract.pendingAdmin,
                    pendingAdmin: undefined,
                    txHash: hash,
                    errorMessage: undefined
                });
                successCount++;
            } catch (err: any) {
                console.error(`❌ Error accepting transfer for ${contract.label}:`, err);

                const errorMsg = err.shortMessage || err.message || 'Unknown error';
                failedContracts.push(contract.label);

                updateAdminContract(contract.id, {
                    status: 'pending',
                    errorMessage: errorMsg
                });
                errorCount++;
            }
        }

        setIsAccepting(false);

        if (successCount > 0 && errorCount === 0) {
            setSuccessMessage(`✅ Successfully accepted admin transfer for ${successCount} contract(s)`);
        } else if (successCount > 0 && errorCount > 0) {
            setError(`⚠️ ${successCount} succeeded, ${errorCount} failed: ${failedContracts.join(', ')}`);
            setSuccessMessage(`✅ ${successCount} contract(s) completed`);
        } else if (errorCount > 0) {
            setError(`❌ Failed to accept transfer for: ${failedContracts.join(', ')}`);
        }
    };

    const getAdminStatusIcon = (status: AdminTransferStatus) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-success" />;
            case 'pending':
                return <div className="w-4 h-4 rounded-full bg-yellow-500" />;
            case 'transferring':
            case 'checking':
                return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-destructive" />;
            default:
                return <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />;
        }
    };


    const checkRoles = async () => {
        const trimmedAddress = targetAddress.trim();
        if (!trimmedAddress || !isAddress(trimmedAddress)) {
            setError('Please enter a valid target address');
            return;
        }

        setIsCheckingRoles(true);
        setError(null);

        const updatedRoles = [...roles];

        for (let i = 0; i < updatedRoles.length; i++) {
            updatedRoles[i].status = 'checking';
            setRoles([...updatedRoles]);

            try {
                const contractAddress = getContractAddress(updatedRoles[i].contractKey);
                const abi = getAbiForContract(updatedRoles[i].contractKey);

                const hasRole = await checkHasRole({
                    contractAddress,
                    abi,
                    role: updatedRoles[i].roleHash,
                    account: trimmedAddress as `0x${string}`,
                    chainId: DEFAULT_CHAIN_ID,
                });

                updatedRoles[i].status = hasRole ? 'granted' : 'not_granted';
            } catch (err) {
                console.error(`Error checking role ${updatedRoles[i].id}:`, err);
                updatedRoles[i].status = 'error';
            }

            setRoles([...updatedRoles]);
        }

        setIsCheckingRoles(false);
    };

    const toggleRole = (id: string) => {
        setRoles(prev => prev.map(role =>
            role.id === id ? { ...role, selected: !role.selected } : role
        ));
    };

    const grantSelectedRoles = async () => {
        if (!privateKey) {
            setError('Please enter the master wallet private key');
            return;
        }

        const trimmedAddress = targetAddress.trim();
        if (!trimmedAddress || !isAddress(trimmedAddress)) {
            setError('Please enter a valid target address');
            return;
        }

        const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
        if (formattedKey.length !== 66) {
            setError('Invalid private key format');
            return;
        }

        const selectedRoles = roles.filter(r => r.selected && r.status !== 'granted');
        if (selectedRoles.length === 0) {
            setError('Please select at least one role to grant (roles already granted are skipped)');
            return;
        }

        setError(null);
        setSuccessMessage(null);

        let successCount = 0;
        let errorCount = 0;

        for (const role of selectedRoles) {
            setRoles(prev => prev.map(r =>
                r.id === role.id ? { ...r, grantStatus: 'granting' } : r
            ));

            try {
                const contractAddress = getContractAddress(role.contractKey);
                const abi = getAbiForContract(role.contractKey);

                const hash = await executeContractWriteWithKey({
                    privateKey: formattedKey as `0x${string}`,
                    contractAddress,
                    abi,
                    functionName: 'grantRole',
                    args: [role.roleHash, trimmedAddress],
                    chainId: DEFAULT_CHAIN_ID,
                });

                await waitForTransaction({ hash, chainId: DEFAULT_CHAIN_ID });

                setRoles(prev => prev.map(r =>
                    r.id === role.id ? { ...r, grantStatus: 'success', status: 'granted', selected: false } : r
                ));
                successCount++;
            } catch (err: any) {
                console.error(`Error granting role ${role.id}:`, err);
                setRoles(prev => prev.map(r =>
                    r.id === role.id ? { ...r, grantStatus: 'error' } : r
                ));
                errorCount++;
            }
        }


        if (successCount > 0 && errorCount === 0) {
            setSuccessMessage(`Successfully granted ${successCount} role(s)`);
        } else if (successCount > 0 && errorCount > 0) {
            setSuccessMessage(`Granted ${successCount} role(s), ${errorCount} failed`);
        } else if (errorCount > 0) {
            setError(`Failed to grant ${errorCount} role(s)`);
        }
    };

    const getStatusIcon = (status: RoleStatus, grantStatus: GrantStatus) => {
        if (grantStatus === 'granting') {
            return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
        }
        if (grantStatus === 'success' || status === 'granted') {
            return <CheckCircle className="w-4 h-4 text-success" />;
        }
        if (grantStatus === 'error') {
            return <XCircle className="w-4 h-4 text-destructive" />;
        }
        if (status === 'checking') {
            return <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />;
        }
        if (status === 'not_granted') {
            return <XCircle className="w-4 h-4 text-muted-foreground" />;
        }
        if (status === 'error') {
            return <AlertTriangle className="w-4 h-4 text-destructive" />;
        }
        return <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />;
    };

    const selectedCount = roles.filter(r => r.selected && r.status !== 'granted').length;

    const selectedAdminCount = adminContracts.filter(c => c.selected && c.status !== 'pending').length;

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestionar Roles</h2>
                    <p className="text-muted-foreground">Transferir admin y otorgar permisos blockchain.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border">
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === 'admin'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Admin Transfer
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === 'roles'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Other Roles
                    </button>
                </div>

                {/* Admin Transfer Tab */}
                {activeTab === 'admin' && (
                    <div className="space-y-6">
                        {/* Warning */}
                        <div className="flex items-center gap-2 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            Admin transfer is irreversible after acceptance
                        </div>

                        {/* Check Status Button */}
                        <button
                            onClick={checkAdminStatus}
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Check Admin Status
                        </button>

                        {/* Step 1: Begin Transfer */}
                        <div className="bg-secondary/10 border border-border rounded-2xl p-8 space-y-6">
                            <h3 className="font-bold text-lg">Step 1: Begin Transfer</h3>

                            {/* Contract Checkboxes */}
                            <div className="space-y-3">
                                {adminContracts.map((contract) => (
                                    <div key={contract.id}>
                                        <label
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${contract.selected
                                                    ? 'bg-primary/10 border-primary'
                                                    : contract.status === 'failed'
                                                        ? 'bg-destructive/5 border-destructive/30'
                                                        : 'bg-secondary/30 border-border hover:bg-secondary/50'
                                                } ${contract.status === 'pending' || contract.status === 'completed' ? 'opacity-60' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={contract.selected}
                                                onChange={() => toggleAdminContract(contract.id)}
                                                disabled={contract.status === 'pending' || contract.status === 'completed' || contract.status === 'transferring'}
                                                className="w-4 h-4 accent-primary"
                                            />
                                            <div className="flex-1">
                                                <span className="text-sm font-medium">{contract.label}</span>
                                                {contract.currentAdmin && (
                                                    <p className="text-xs text-muted-foreground font-mono truncate">
                                                        Current: {contract.currentAdmin.slice(0, 8)}...{contract.currentAdmin.slice(-6)}
                                                    </p>
                                                )}
                                                {contract.pendingAdmin && contract.pendingAdmin !== '0x0000000000000000000000000000000000000000' && (
                                                    <p className="text-xs text-yellow-500 font-mono truncate">
                                                        Pending: {contract.pendingAdmin.slice(0, 8)}...{contract.pendingAdmin.slice(-6)}
                                                    </p>
                                                )}
                                                {contract.txHash && (
                                                    <p className="text-xs text-success font-mono truncate">
                                                        Tx: {contract.txHash.slice(0, 10)}...{contract.txHash.slice(-8)}
                                                    </p>
                                                )}
                                            </div>
                                            {getAdminStatusIcon(contract.status)}
                                        </label>
                                        {contract.errorMessage && (
                                            <div className="mt-2 ml-8 p-2 rounded-lg bg-destructive/10 border border-destructive/30">
                                                <p className="text-xs text-destructive">
                                                    {contract.errorMessage}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Deployer Key Input */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Deployer Private Key</label>
                                <div className="relative">
                                    <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="password"
                                        value={deployerKey}
                                        onChange={(e) => setDeployerKey(e.target.value)}
                                        placeholder="0x..."
                                        className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            {/* New Admin Address Input */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">New Admin Address</label>
                                <div className="relative">
                                    <Wallet className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={newAdminAddress}
                                        onChange={(e) => {
                                            setNewAdminAddress(e.target.value);
                                            if (isAddress(e.target.value)) {
                                                autoDetectAdminKey(e.target.value);
                                            }
                                        }}
                                        placeholder="0x..."
                                        className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            {/* Begin Button */}
                            <button
                                onClick={beginAdminTransfer}
                                disabled={isBeginning || selectedAdminCount === 0}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isBeginning ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        BEGINNING TRANSFER...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5" />
                                        BEGIN ADMIN TRANSFER {selectedAdminCount > 0 ? `(${selectedAdminCount})` : ''}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Step 2: Accept Transfer */}
                        <div className="bg-secondary/10 border border-border rounded-2xl p-8 space-y-6">
                            <h3 className="font-bold text-lg">Step 2: Accept Transfer</h3>

                            {/* Admin Key Input */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    Admin Private Key
                                    {autoDetectedAdminKey && (
                                        <span className="ml-2 text-xs text-success normal-case">(Auto-detected)</span>
                                    )}
                                </label>
                                <div className="relative">
                                    <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="password"
                                        value={adminKey}
                                        onChange={(e) => {
                                            setAdminKey(e.target.value);
                                            setAutoDetectedAdminKey(false);
                                        }}
                                        placeholder="0x..."
                                        className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            {/* Accept Button */}
                            <button
                                onClick={acceptAdminTransfer}
                                disabled={isAccepting || !adminKey || adminContracts.filter(c => c.status === 'pending').length === 0}
                                className="w-full bg-success hover:bg-success/90 text-success-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-success/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAccepting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        ACCEPTING TRANSFER...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        ACCEPT ADMIN TRANSFER
                                    </>
                                )}
                            </button>
                        </div>


                        {/* Error/Success Messages */}
                        {error && (
                            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="flex items-center gap-2 p-4 rounded-xl bg-success/10 border border-success/30 text-success text-sm">
                                <CheckCircle className="w-4 h-4" />
                                {successMessage}
                            </div>
                        )}
                    </div>
                )}

                {/* Other Roles Tab */}
                {activeTab === 'roles' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-secondary/10 border border-border rounded-2xl p-8 space-y-8">
                                {/* Private Key Input */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Master Wallet Private Key</label>
                                    <div className="relative">
                                        <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="password"
                                            value={privateKey}
                                            onChange={(e) => setPrivateKey(e.target.value)}
                                            placeholder="0x..."
                                            className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Target Address Input */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Target Address (Recipient)</label>
                                    <div className="relative">
                                        <Wallet className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={targetAddress}
                                            onChange={(e) => setTargetAddress(e.target.value)}
                                            placeholder="0x..."
                                            className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                        />
                                    </div>
                                    <button
                                        onClick={checkRoles}
                                        disabled={isCheckingRoles || !targetAddress}
                                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isCheckingRoles ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4" />
                                        )}
                                        Verificar roles existentes
                                    </button>
                                </div>

                                {/* Role Checkboxes */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Roles a Otorgar</label>
                                    <div className="space-y-3">
                                        {roles.map((role) => (
                                            <label
                                                key={role.id}
                                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${role.selected
                                                        ? 'bg-primary/10 border-primary'
                                                        : 'bg-secondary/30 border-border hover:bg-secondary/50'
                                                    } ${role.status === 'granted' ? 'opacity-60' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={role.selected}
                                                    onChange={() => toggleRole(role.id)}
                                                    disabled={role.status === 'granted' || role.grantStatus === 'granting'}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                <div className="flex-1">
                                                    <span className="text-sm font-medium">{role.label}</span>
                                                    <p className="text-xs text-muted-foreground">{role.description}</p>
                                                </div>
                                                {getStatusIcon(role.status, role.grantStatus)}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Error/Success Messages */}
                                {error && (
                                    <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                                        <AlertTriangle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="flex items-center gap-2 p-4 rounded-xl bg-success/10 border border-success/30 text-success text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        {successMessage}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={grantSelectedRoles}
                                    disabled={isGranting || selectedCount === 0}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGranting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            OTORGANDO ROLES...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            OTORGAR {selectedCount > 0 ? `${selectedCount} ` : ''}ROLES
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div className="space-y-6">
                            <div className="bg-secondary/10 border border-border rounded-2xl p-6 space-y-4">
                                <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Shield className="w-4 h-4 text-primary" />
                                    Casos de Uso
                                </h3>
                                <div className="text-xs text-muted-foreground space-y-3">
                                    <div>
                                        <span className="font-medium text-foreground">Crear Tokens:</span>
                                        <p>Properties Manager (PropertyRegistry)</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">Crear Campañas:</span>
                                        <p>User Manager (IndaRoot)</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">Buyouts:</span>
                                        <p>Governance (ambos contratos)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary/10 border border-border rounded-2xl p-6 space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider">Contratos (Polygon Amoy)</h3>
                                <div className="space-y-3 text-xs font-mono">
                                    <div className="bg-background p-3 rounded-lg border border-border">
                                        <span className="text-muted-foreground">IndaRoot:</span>
                                        <div className="truncate">{POLYGON_CONTRACTS.indaRoot}</div>
                                    </div>
                                    <div className="bg-background p-3 rounded-lg border border-border">
                                        <span className="text-muted-foreground">PropertyRegistry:</span>
                                        <div className="truncate">{POLYGON_CONTRACTS.propertyRegistry}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary/10 border border-border rounded-2xl p-6 space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider">Estados</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-success" />
                                        <span>Rol ya otorgado</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-muted-foreground" />
                                        <span>Rol no otorgado</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-primary" />
                                        <span>Verificando/Otorgando</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
