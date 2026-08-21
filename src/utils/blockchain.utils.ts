import { createWalletClient, createPublicClient, http, encodeFunctionData, type Hash, type TransactionReceipt, type Abi, ContractFunctionRevertedError } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia, base, polygonAmoy, polygon } from 'viem/chains';
import { DEFAULT_CHAIN_ID } from '@/config/contracts';
import { POLYGON_AMOY_RPC_URL } from '@/config/env';

export const parseContractError = (error: unknown): string => {
    if (error instanceof ContractFunctionRevertedError) {
        return error.reason || error.errorName || 'Transaction reverted';
    }
    if (error instanceof Error) {
        if (error.message.includes('Internal JSON-RPC error')) {
            const reasonMatch = error.message.match(/"reason":"([^"]+)"/);
            if (reasonMatch) return reasonMatch[1];
            return 'Transaction failed on chain';
        }
        return error.message;
    }
    return 'Unknown error occurred';
};

const getRpcUrl = (chainId: number) => {
    if (chainId === 84532) return 'https://sepolia.base.org';
    if (chainId === 80002) return POLYGON_AMOY_RPC_URL;
    if (chainId === 137) return 'https://polygon.drpc.org';
    return 'https://mainnet.base.org';
};

const getChain = (chainId: number) => {
    if (chainId === 84532) return baseSepolia;
    if (chainId === 80002) return polygonAmoy;
    if (chainId === 137) return polygon;
    return base;
};

export const createUserPublicClient = (chainId: number = DEFAULT_CHAIN_ID) => {
    const chain = getChain(chainId);

    return createPublicClient({
        chain,
        transport: http(getRpcUrl(chainId)),
    });
};

async function executeSessionWalletWrite<TAbi extends Abi>(params: {
    contractAddress: `0x${string}`;
    abi: TAbi;
    functionName: string;
    args: unknown[];
}): Promise<{ hash: Hash; receipt: TransactionReceipt }> {
    if (typeof window === 'undefined') {
        throw new Error('Session wallet writes must run in the browser');
    }

    const { submitEncodedCall } = await import('@/modules/nyx-wallet');
    const data = encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName as never,
        args: params.args as never,
    });

    return submitEncodedCall({
        to: params.contractAddress,
        data,
    });
}

export const executeContractWrite = async <TAbi extends Abi>(params: {
    contractAddress: `0x${string}`;
    abi: TAbi;
    functionName: string;
    args: any[];
    chainId?: number;
    gasLimit?: bigint;
}) => {
    const { hash } = await executeSessionWalletWrite(params);
    return hash;
};

export const waitForTransaction = async (params: {
    hash: Hash;
    chainId?: number;
    confirmations?: number;
}): Promise<TransactionReceipt> => {
    const { hash, chainId = DEFAULT_CHAIN_ID, confirmations = 1 } = params;

    const publicClient = createUserPublicClient(chainId);

    return publicClient.waitForTransactionReceipt({
        hash,
        confirmations,
    });
};

export const executeAndWaitForTransaction = async <TAbi extends Abi>(params: {
    contractAddress: `0x${string}`;
    abi: TAbi;
    functionName: string;
    args: any[];
    chainId?: number;
    gasLimit?: bigint;
    confirmations?: number;
    privateKey?: `0x${string}`;
}) => {
    const { confirmations = 1, privateKey, ...writeParams } = params;

    if (privateKey) {
        const hash = await executeContractWriteWithKey({ ...writeParams, privateKey });
        const receipt = await waitForTransaction({
            hash,
            chainId: params.chainId,
            confirmations,
        });

        if (receipt.status === 'reverted') {
            throw new Error('Transaction reverted');
        }

        return { hash, receipt };
    }

    return executeSessionWalletWrite(writeParams);
};

export const createWalletClientWithKey = (privateKey: `0x${string}`, chainId: number = DEFAULT_CHAIN_ID) => {
    const account = privateKeyToAccount(privateKey);
    const chain = getChain(chainId);

    return createWalletClient({
        account,
        chain,
        transport: http(getRpcUrl(chainId)),
    });
};

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
