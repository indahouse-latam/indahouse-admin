import { NextRequest, NextResponse } from 'next/server';
import { createUserPublicClient, executeAndWaitForTransaction } from '@/utils/blockchain.utils';
import { currentContracts, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { IndahouseRegistryAbi, ManagerAbi } from '@/config/abis';
import { isAddress } from 'viem';

const ROLE_HASHES = {
    CERTIFICATE_MANAGER_ROLE: '0x793fafc4216e31eb47b95467a5d6c852611bb7e4df768602288844840c234392' as const,
};

function countryCodeToBytes32(code: string): `0x${string}` {
    const upperCode = code.toUpperCase();
    return `0x${upperCode
        .split('')
        .map(c => c.charCodeAt(0).toString(16))
        .join('')
        .padEnd(64, '0')}` as `0x${string}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { countryCode, adminAddress, privateKey } = body;

        if (!countryCode || !adminAddress || !privateKey) {
            return NextResponse.json(
                { error: 'Missing required fields: countryCode, adminAddress, privateKey' },
                { status: 400 }
            );
        }

        if (!isAddress(adminAddress)) {
            return NextResponse.json(
                { error: 'Invalid adminAddress' },
                { status: 400 }
            );
        }

        const formattedKey = privateKey.startsWith('0x') ? privateKey as `0x${string}` : `0x${privateKey}` as `0x${string}`;

        const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
        const chainId = DEFAULT_CHAIN_ID;

        const publicClient = createUserPublicClient(chainId);
        const countryCodeBytes32 = countryCodeToBytes32(countryCode);

        console.log(`🌐 Checking if manager exists for country ${countryCode}...`);

        const existingManager = await publicClient.readContract({
            address: registryAddress,
            abi: IndahouseRegistryAbi,
            functionName: 'getManager',
            args: [countryCodeBytes32],
        }) as `0x${string}`;

        const zeroAddress = '0x0000000000000000000000000000000000000000' as const;

        if (existingManager && existingManager !== zeroAddress) {
            console.log(`✅ Manager already exists for ${countryCode}: ${existingManager}`);

            const hasCertRole = await publicClient.readContract({
                address: existingManager,
                abi: ManagerAbi,
                functionName: 'hasRole',
                args: [ROLE_HASHES.CERTIFICATE_MANAGER_ROLE, adminAddress],
            }) as boolean;

            if (hasCertRole) {
                return NextResponse.json({
                    success: true,
                    message: `Manager already exists for ${countryCode} and admin has required role`,
                    managerAddress: existingManager,
                    wasAlreadyConfigured: true,
                });
            }

            console.log(`🔑 Granting CERTIFICATE_MANAGER_ROLE to ${adminAddress}...`);
            const grantHash = await executeAndWaitForTransaction({
                contractAddress: existingManager,
                abi: ManagerAbi,
                functionName: 'grantRole',
                args: [ROLE_HASHES.CERTIFICATE_MANAGER_ROLE, adminAddress],
                chainId,
                privateKey: formattedKey,
            });

            return NextResponse.json({
                success: true,
                message: `Manager exists for ${countryCode}. CERTIFICATE_MANAGER_ROLE granted to admin.`,
                managerAddress: existingManager,
                grantTxHash: grantHash.hash,
                wasAlreadyConfigured: true,
            });
        }

        console.log(`📦 No manager found for ${countryCode}. Creating via registry...`);

        const createHash = await executeAndWaitForTransaction({
            contractAddress: registryAddress,
            abi: IndahouseRegistryAbi,
            functionName: 'createManager',
            args: [countryCodeBytes32],
            chainId,
            privateKey: formattedKey,
        });

        console.log(`✅ Manager creation tx: ${createHash.hash}`);

        const newManager = await publicClient.readContract({
            address: registryAddress,
            abi: IndahouseRegistryAbi,
            functionName: 'getManager',
            args: [countryCodeBytes32],
        }) as `0x${string}`;

        if (!newManager || newManager === zeroAddress) {
            throw new Error('Manager was not created successfully');
        }

        console.log(`🎯 New manager created for ${countryCode}: ${newManager}`);

        console.log(`🔑 Granting CERTIFICATE_MANAGER_ROLE to ${adminAddress}...`);
        const grantHash = await executeAndWaitForTransaction({
            contractAddress: newManager,
            abi: ManagerAbi,
            functionName: 'grantRole',
            args: [ROLE_HASHES.CERTIFICATE_MANAGER_ROLE, adminAddress],
            chainId,
            privateKey: formattedKey,
        });

        console.log(`✅ CERTIFICATE_MANAGER_ROLE granted: ${grantHash.hash}`);

        return NextResponse.json({
            success: true,
            message: `Manager created for ${countryCode} and configured successfully`,
            managerAddress: newManager,
            createTxHash: createHash.hash,
            grantTxHash: grantHash.hash,
            wasAlreadyConfigured: false,
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`❌ Error creating manager:`, error);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
