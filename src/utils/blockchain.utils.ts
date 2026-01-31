import { createWalletClient, createPublicClient, http, type Hash, type TransactionReceipt, type Abi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia, base, polygonAmoy } from 'viem/chains';
import { getPrivateKey } from './nyx-wallet.ultils';
import { LocalStorageUser } from '@/providers/AuthProvider';
import { DEFAULT_CHAIN_ID } from '@/config/contracts';

// Get RPC URL based on chain
const getRpcUrl = (chainId: number) => {
    if (chainId === 84532) { // Base Sepolia
        return 'https://sepolia.base.org';
    }
    if (chainId === 80002) { // Polygon Amoy
        return 'https://rpc-amoy.polygon.technology';
    }
    return 'https://mainnet.base.org'; // Base mainnet
};

// Get chain based on chain ID
const getChain = (chainId: number) => {
    if (chainId === 84532) return baseSepolia;
    if (chainId === 80002) return polygonAmoy;
    return base;
};

/**
 * Creates a wallet client using the user's private key from localStorage
 */
export const createUserWalletClient = async (chainId: number = DEFAULT_CHAIN_ID) => {
    const localstorageUser = localStorage.getItem('admin_user');
    if (!localstorageUser) {
        throw new Error('User not authenticated');
    }

    const user: LocalStorageUser = JSON.parse(localstorageUser);
    const privateKey = await getPrivateKey(user.walletId, user.token);

    if (!privateKey.startsWith('0x')) {
        throw new Error('Invalid private key format');
    }


    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const chain = getChain(chainId);

    const walletClient = createWalletClient({
        account,
        chain,
        transport: http(getRpcUrl(chainId)),
    });

    return walletClient;
};

/**
 * Creates a public client for reading blockchain data
 */
export const createUserPublicClient = (chainId: number = DEFAULT_CHAIN_ID) => {
    const chain = getChain(chainId);

    return createPublicClient({
        chain,
        transport: http(getRpcUrl(chainId)),
    });
};

/**
 * Executes a contract write transaction
 */
export const executeContractWrite = async <TAbi extends Abi>(params: {
    contractAddress: `0x${string}`;
    abi: TAbi;
    functionName: string;
    args: any[];
    chainId?: number;
    gasLimit?: bigint;
}) => {
    const { contractAddress, abi, functionName, args, chainId = DEFAULT_CHAIN_ID, gasLimit } = params;

    const walletClient = await createUserWalletClient(chainId);

    const hash = await walletClient.writeContract({
        address: contractAddress,
        abi,
        functionName,
        args,
        gas: gasLimit,
    });

    return hash;
};

/**
 * Waits for a transaction to be confirmed and returns the receipt
 */
export const waitForTransaction = async (params: {
    hash: Hash;
    chainId?: number;
    confirmations?: number;
}): Promise<TransactionReceipt> => {
    const { hash, chainId = DEFAULT_CHAIN_ID, confirmations = 1 } = params;

    const publicClient = createUserPublicClient(chainId);

    const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations,
    });

    return receipt;
};

/**
 * Executes a contract write and waits for confirmation
 */
export const executeAndWaitForTransaction = async <TAbi extends Abi>(params: {
    contractAddress: `0x${string}`;
    abi: TAbi;
    functionName: string;
    args: any[];
    chainId?: number;
    gasLimit?: bigint;
    confirmations?: number;
}) => {
    const { confirmations = 1, ...writeParams } = params;

    // Execute transaction
    const hash = await executeContractWrite(writeParams);

    // Wait for confirmation
    const receipt = await waitForTransaction({
        hash,
        chainId: params.chainId,
        confirmations,
    });

    return { hash, receipt };
};

/**
 * Creates a wallet client using a custom private key (for admin operations)
 */
export const createWalletClientWithKey = (privateKey: `0x${string}`, chainId: number = DEFAULT_CHAIN_ID) => {
    const account = privateKeyToAccount(privateKey);
    const chain = getChain(chainId);

    return createWalletClient({
        account,
        chain,
        transport: http(getRpcUrl(chainId)),
    });
};

/**
 * Executes a contract write transaction with a custom private key
 */
export const executeContractWriteWithKey = async <TAbi extends Abi>(params: {
    privateKey: `0x${string}`;
    contractAddress: `0x${string}`;
    abi: TAbi;
    functionName: string;
    args: any[];
    chainId?: number;
    gasLimit?: bigint;
}) => {
    const { privateKey, contractAddress, abi, functionName, args, chainId = DEFAULT_CHAIN_ID, gasLimit } = params;

    const walletClient = createWalletClientWithKey(privateKey, chainId);

    const hash = await walletClient.writeContract({
        address: contractAddress,
        abi,
        functionName,
        args,
        gas: gasLimit,
    });

    return hash;
};

/**
 * Checks if an address has a specific role on a contract
 */
export const checkHasRole = async (params: {
    contractAddress: `0x${string}`;
    abi: Abi;
    role: `0x${string}`;
    account: `0x${string}`;
    chainId?: number;
}): Promise<boolean> => {
    const { contractAddress, abi, role, account, chainId = DEFAULT_CHAIN_ID } = params;

    const publicClient = createUserPublicClient(chainId);

    const hasRole = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: 'hasRole',
        args: [role, account],
    });

    return hasRole as boolean;
};
