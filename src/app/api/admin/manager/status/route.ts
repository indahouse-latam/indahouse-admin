import { NextRequest, NextResponse } from 'next/server';
import { createUserPublicClient } from '@/utils/blockchain.utils';
import { currentContracts, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { IndahouseRegistryAbi, ManagerAbi } from '@/config/abis';

const CERTIFICATE_MANAGER_ROLE = '0x793fafc4216e31eb47b95467a5d6c852611bb7e4df768602288844840c234392' as const;

function countryCodeToBytes32(code: string): `0x${string}` {
    const upperCode = code.toUpperCase();
    return `0x${upperCode
        .split('')
        .map(c => c.charCodeAt(0).toString(16))
        .join('')
        .padEnd(64, '0')}` as `0x${string}`;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const countryCode = searchParams.get('countryCode');
        const adminAddress = searchParams.get('adminAddress');

        if (!countryCode) {
            return NextResponse.json(
                { error: 'Missing countryCode parameter' },
                { status: 400 }
            );
        }

        const registryAddress = currentContracts.indahouseRegistry as `0x${string}`;
        const chainId = DEFAULT_CHAIN_ID;
        const publicClient = createUserPublicClient(chainId);
        const countryCodeBytes32 = countryCodeToBytes32(countryCode);
        const zeroAddress = '0x0000000000000000000000000000000000000000' as const;

        const managerAddress = await publicClient.readContract({
            address: registryAddress,
            abi: IndahouseRegistryAbi,
            functionName: 'getManager',
            args: [countryCodeBytes32],
        }) as `0x${string}`;

        const hasManager = managerAddress && managerAddress !== zeroAddress;

        let hasCertificateRole = false;
        if (hasManager && adminAddress) {
            hasCertificateRole = await publicClient.readContract({
                address: managerAddress,
                abi: ManagerAbi,
                functionName: 'hasRole',
                args: [CERTIFICATE_MANAGER_ROLE, adminAddress as `0x${string}`],
            }) as boolean;
        }

        return NextResponse.json({
            countryCode,
            managerAddress: hasManager ? managerAddress : null,
            hasManager,
            hasCertificateRole,
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`❌ Error checking manager status:`, error);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
