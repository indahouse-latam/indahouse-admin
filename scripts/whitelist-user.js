const { createWalletClient, createPublicClient, http, isAddress } = require('viem');
const { polygonAmoy } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');
const { IndaRootAbi } = require('../src/config/abis/inda-root.abi.ts');
const { currentContracts } = require('../src/config/contracts.ts');

// Configuracion
const ADMIN_PRIVATE_KEY = ''; // Coloca aqui la private key del admin con USERS_MANAGER_ROLE
const USER_TO_WHITELIST = ''; // Direccion del usuario a whitelistear
const WHITELIST_STATUS = true; // true = agregar a whitelist, false = remover

async function whitelistUser() {
    if (!ADMIN_PRIVATE_KEY) {
        console.error('❌ Error: ADMIN_PRIVATE_KEY not configured');
        console.log('Please set ADMIN_PRIVATE_KEY in the script\n');
        return;
    }

    if (!USER_TO_WHITELIST) {
        console.error('❌ Error: USER_TO_WHITELIST not configured');
        console.log('Please set USER_TO_WHITELIST in the script\n');
        return;
    }

    if (!isAddress(USER_TO_WHITELIST)) {
        console.error('❌ Error: USER_TO_WHITELIST is not a valid address\n');
        return;
    }

    const account = privateKeyToAccount(ADMIN_PRIVATE_KEY);
    const indaRootAddress = currentContracts.indaRoot;

    console.log(`IndaRoot Contract: ${indaRootAddress}`);
    console.log(`Executing from: ${account.address}`);
    console.log(`User: ${USER_TO_WHITELIST}`);
    console.log(`New whitelist status: ${WHITELIST_STATUS ? 'true (add)' : 'false (remove)'}\n`);

    const walletClient = createWalletClient({
        account,
        chain: polygonAmoy,
        transport: http('https://rpc-amoy.polygon.technology'),
    });

    const publicClient = createPublicClient({
        chain: polygonAmoy,
        transport: http('https://rpc-amoy.polygon.technology'),
    });

    try {
        const balance = await publicClient.getBalance({ address: account.address });
        const balancePOL = Number(balance) / 1e18;
        console.log(`Current balance: ${balancePOL.toFixed(4)} POL`);

        if (balancePOL < 0.01) {
            console.log('⚠️  Warning: Low balance. You may need more POL for gas fees.\n');
        }

        console.log('\n🔍 Checking whitelist status before...');
        const isWhitelistedBefore = await publicClient.readContract({
            address: indaRootAddress,
            abi: IndaRootAbi,
            functionName: 'whitelist',
            args: [USER_TO_WHITELIST],
        });

        console.log(`Whitelisted before: ${isWhitelistedBefore ? 'Yes ✅' : 'No ❌'}`);

        if (isWhitelistedBefore === WHITELIST_STATUS) {
            console.log('\n✅ User already has the target whitelist status. Nothing to do.\n');
            return;
        }

        console.log('\n🔄 Executing _setToWhitelist transaction...');
        const hash = await walletClient.writeContract({
            address: indaRootAddress,
            abi: IndaRootAbi,
            functionName: '_setToWhitelist',
            args: [[USER_TO_WHITELIST], [WHITELIST_STATUS]],
        });

        console.log('✅ Transaction sent!');
        console.log(`   Hash: ${hash}`);
        console.log(`   Explorer: https://amoy.polygonscan.com/tx/${hash}`);

        console.log('\n⏳ Waiting for confirmation...');
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        console.log('✅ Transaction confirmed!');
        console.log(`   Block: ${receipt.blockNumber}`);
        console.log(`   Gas used: ${receipt.gasUsed}`);
        console.log(`   Status: ${receipt.status === 'success' ? 'Success ✅' : 'Failed ❌'}`);

        if (receipt.status !== 'success') {
            console.error('\n❌ Transaction failed!\n');
            return;
        }

        console.log('\n🔍 Verifying whitelist status after...');
        const isWhitelistedAfter = await publicClient.readContract({
            address: indaRootAddress,
            abi: IndaRootAbi,
            functionName: 'whitelist',
            args: [USER_TO_WHITELIST],
        });

        console.log(`Whitelisted after: ${isWhitelistedAfter ? 'Yes ✅' : 'No ❌'}`);

        if (isWhitelistedAfter === WHITELIST_STATUS) {
            console.log('\n✅ Whitelist updated successfully!\n');
        } else {
            console.log('\n❌ Whitelist verification failed. Check transaction details.\n');
        }

        const newBalance = await publicClient.getBalance({ address: account.address });
        const newBalancePOL = Number(newBalance) / 1e18;
        const gasUsed = balancePOL - newBalancePOL;

        console.log('Final balance:');
        console.log(`   Sender: ${newBalancePOL.toFixed(4)} POL`);
        console.log(`   Gas cost: ${gasUsed.toFixed(6)} POL\n`);
    } catch (error) {
        console.error('\n❌ Error executing transaction:', error.message);
        if (error.shortMessage) {
            console.error(`   Details: ${error.shortMessage}`);
        }
        if (error.cause) {
            console.error(`   Cause: ${error.cause.message || error.cause}`);
        }
        console.log('\nPossible issues:');
        console.log('1. The sender does not have USERS_MANAGER_ROLE on IndaRoot');
        console.log('2. User address is invalid');
        console.log('3. Insufficient POL balance for gas');
        console.log('4. Network connection issues\n');
    }
}

whitelistUser().catch(console.error);
