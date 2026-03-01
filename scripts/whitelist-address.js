const { createWalletClient, createPublicClient, http } = require('viem');
const { polygonAmoy } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');

// ============================================================================
// WHITELIST ADDRESS ON INDA ROOT
// ============================================================================
// Usage: node scripts/whitelist-address.js <PRIVATE_KEY> <ADDRESS_TO_WHITELIST>
//   Multiple addresses: node scripts/whitelist-address.js <KEY> <ADDR1> <ADDR2> ...
// ============================================================================

const RPC_URL = 'https://rpc-amoy.polygon.technology';
const INDA_ROOT = '0xA19006C5Fe8baa747317b811c9D127cc762A5878';

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
    const addresses = process.argv.slice(3);

    if (!privateKey || addresses.length === 0) {
        console.error('Usage: node scripts/whitelist-address.js <PRIVATE_KEY> <ADDRESS1> [ADDRESS2] ...');
        process.exit(1);
    }

    const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    const account = privateKeyToAccount(formattedKey);

    const publicClient = createPublicClient({ chain: polygonAmoy, transport: http(RPC_URL) });
    const walletClient = createWalletClient({ account, chain: polygonAmoy, transport: http(RPC_URL) });

    console.log(`\nSender: ${account.address}`);
    console.log(`Addresses to whitelist: ${addresses.join(', ')}\n`);

    // Check current status
    const needsWhitelist = [];
    for (const addr of addresses) {
        const is = await publicClient.readContract({
            address: INDA_ROOT, abi: whitelistAbi, functionName: 'whitelist', args: [addr]
        });
        console.log(`  ${addr}: ${is ? 'already whitelisted' : 'NOT whitelisted'}`);
        if (!is) needsWhitelist.push(addr);
    }

    if (needsWhitelist.length === 0) {
        console.log('\nAll addresses already whitelisted. Nothing to do.\n');
        return;
    }

    console.log(`\nWhitelisting ${needsWhitelist.length} address(es)...`);

    const hash = await walletClient.writeContract({
        address: INDA_ROOT,
        abi: setToWhitelistAbi,
        functionName: '_setToWhitelist',
        args: [needsWhitelist, needsWhitelist.map(() => true)],
    });

    console.log(`Tx: ${hash}`);
    console.log(`Explorer: https://amoy.polygonscan.com/tx/${hash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Confirmed in block ${receipt.blockNumber} (${receipt.status})\n`);

    // Verify
    for (const addr of needsWhitelist) {
        const is = await publicClient.readContract({
            address: INDA_ROOT, abi: whitelistAbi, functionName: 'whitelist', args: [addr]
        });
        console.log(`  ${addr}: ${is ? 'YES' : 'FAILED'}`);
    }
    console.log('');
}

main().catch(console.error);
