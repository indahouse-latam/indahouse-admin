const { createWalletClient, createPublicClient, http } = require('viem');
const { polygonAmoy } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');

// ============================================================================
// WHITELIST INDA ADMIN ROUTER ON INDA ROOT
// ============================================================================
// Adds IndaAdminRouter to IndaRoot whitelist so batched finalization works.
// Requires USER_MANAGER_ROLE on IndaRoot.
//
// Usage: node scripts/whitelist-router.js <PRIVATE_KEY>
// ============================================================================

const RPC_URL = 'https://rpc-amoy.polygon.technology';
const INDA_ROOT = '0xA19006C5Fe8baa747317b811c9D127cc762A5878';
const INDA_ADMIN_ROUTER = '0x524BEfC17B4c8BE2d1d31ed7d5E0A5260c83a6b1';

const setToWhitelistAbi = [{
    type: 'function', name: '_setToWhitelist',
    inputs: [
        { name: '_addresses', type: 'address[]' },
        { name: '_isWhitelisted', type: 'bool[]' }
    ],
    outputs: [], stateMutability: 'nonpayable'
}];

const whitelistAbi = [{
    type: 'function', name: 'whitelist',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'isWhitelisted', type: 'bool' }], stateMutability: 'view'
}];

async function main() {
    const privateKey = process.argv[2];
    if (!privateKey) {
        console.error('Usage: node scripts/whitelist-router.js <PRIVATE_KEY>');
        process.exit(1);
    }

    const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    const account = privateKeyToAccount(formattedKey);

    const publicClient = createPublicClient({
        chain: polygonAmoy,
        transport: http(RPC_URL),
    });

    const walletClient = createWalletClient({
        account,
        chain: polygonAmoy,
        transport: http(RPC_URL),
    });

    console.log(`\nSender: ${account.address}`);
    console.log(`IndaRoot: ${INDA_ROOT}`);
    console.log(`IndaAdminRouter: ${INDA_ADMIN_ROUTER}\n`);

    // Check current whitelist status
    console.log('Checking current whitelist status...');
    const isBefore = await publicClient.readContract({
        address: INDA_ROOT,
        abi: whitelistAbi,
        functionName: 'whitelist',
        args: [INDA_ADMIN_ROUTER],
    });

    if (isBefore) {
        console.log('IndaAdminRouter is already whitelisted. Nothing to do.\n');
        return;
    }

    console.log('IndaAdminRouter is NOT whitelisted. Adding...\n');

    const hash = await walletClient.writeContract({
        address: INDA_ROOT,
        abi: setToWhitelistAbi,
        functionName: '_setToWhitelist',
        args: [[INDA_ADMIN_ROUTER], [true]],
    });

    console.log(`Tx sent: ${hash}`);
    console.log(`Explorer: https://amoy.polygonscan.com/tx/${hash}`);
    console.log('Waiting for confirmation...');

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Confirmed in block ${receipt.blockNumber} (${receipt.status})\n`);

    // Verify
    const isAfter = await publicClient.readContract({
        address: INDA_ROOT,
        abi: whitelistAbi,
        functionName: 'whitelist',
        args: [INDA_ADMIN_ROUTER],
    });

    console.log(`IndaAdminRouter whitelisted: ${isAfter ? 'YES' : 'NO'}\n`);
}

main().catch(console.error);
