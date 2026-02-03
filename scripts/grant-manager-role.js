const { createWalletClient, createPublicClient, http } = require('viem');
const { polygonAmoy } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');
const { ManagerAbi } = require('../src/config/abis/manager.abi.ts');
const { CONTRACTS, DEFAULT_CHAIN_ID } = require('../src/config/contracts.ts');

// Configuración
const ADMIN_PRIVATE_KEY = '0xe5c8067535f80762f1b6522f4d48d12a5ee09382541ec29d2690f090e749a1c4'; // Coloca aquí la private key del admin actual
const ROLE_TO_GRANT = '0x0000000000000000000000000000000000000000000000000000000000000000'; // DEFAULT_ADMIN_ROLE
const ACCOUNT_TO_GRANT = '0x3c8Cd6b391AE58608405927A4c85155c67EC9844'; // Dirección que recibirá el rol

async function grantManagerRole() {
    console.log('\n🔐 Granting Manager Role on Polygon Amoy...\n');

    // Validar que la private key esté configurada
    if (!ADMIN_PRIVATE_KEY) {
        console.error('❌ Error: ADMIN_PRIVATE_KEY not configured');
        console.log('Please set ADMIN_PRIVATE_KEY in the script\n');
        return;
    }

    // Crear cuenta desde private key
    const account = privateKeyToAccount(ADMIN_PRIVATE_KEY);
    const managerAddress = CONTRACTS.polygonAmoy.manager;

    console.log(`Manager Contract: ${managerAddress}`);
    console.log(`Granting from: ${account.address}`);
    console.log(`Role: ${ROLE_TO_GRANT} (DEFAULT_ADMIN_ROLE)`);
    console.log(`To account: ${ACCOUNT_TO_GRANT}\n`);

    // Crear wallet client
    const walletClient = createWalletClient({
        account,
        chain: polygonAmoy,
        transport: http('https://rpc-amoy.polygon.technology'),
    });

    // Crear public client para verificación
    const publicClient = createPublicClient({
        chain: polygonAmoy,
        transport: http('https://rpc-amoy.polygon.technology'),
    });

    try {
        // Verificar balance del sender
        const balance = await publicClient.getBalance({ address: account.address });
        const balancePOL = Number(balance) / 1e18;
        console.log(`Current balance: ${balancePOL.toFixed(4)} POL`);

        if (balancePOL < 0.01) {
            console.log(`⚠️  Warning: Low balance. You may need more POL for gas fees.\n`);
        }

        // Verificar si ya tiene el rol
        console.log('\n🔍 Checking current role status...');
        const hasRoleBefore = await publicClient.readContract({
            address: managerAddress,
            abi: ManagerAbi,
            functionName: 'hasRole',
            args: [ROLE_TO_GRANT, ACCOUNT_TO_GRANT],
        });

        console.log(`Has role before: ${hasRoleBefore ? 'Yes ✅' : 'No ❌'}`);

        if (hasRoleBefore) {
            console.log('\n✅ Account already has this role. Nothing to do.\n');
            return;
        }

        // Ejecutar grantRole
        console.log('\n🔄 Executing grantRole transaction...');
        const hash = await walletClient.writeContract({
            address: managerAddress,
            abi: ManagerAbi,
            functionName: 'grantRole',
            args: [ROLE_TO_GRANT, ACCOUNT_TO_GRANT],
        });

        console.log(`✅ Transaction sent!`);
        console.log(`   Hash: ${hash}`);
        console.log(`   Explorer: https://amoy.polygonscan.com/tx/${hash}`);

        // Esperar confirmación
        console.log('\n⏳ Waiting for confirmation...');
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        console.log(`✅ Transaction confirmed!`);
        console.log(`   Block: ${receipt.blockNumber}`);
        console.log(`   Gas used: ${receipt.gasUsed}`);
        console.log(`   Status: ${receipt.status === 'success' ? 'Success ✅' : 'Failed ❌'}`);

        if (receipt.status !== 'success') {
            console.error('\n❌ Transaction failed!\n');
            return;
        }

        // Verificar que el rol se otorgó correctamente
        console.log('\n🔍 Verifying role was granted...');
        const hasRoleAfter = await publicClient.readContract({
            address: managerAddress,
            abi: ManagerAbi,
            functionName: 'hasRole',
            args: [ROLE_TO_GRANT, ACCOUNT_TO_GRANT],
        });

        console.log(`Has role after: ${hasRoleAfter ? 'Yes ✅' : 'No ❌'}`);

        if (hasRoleAfter) {
            console.log('\n✅ Role granted successfully!\n');
        } else {
            console.log('\n❌ Role verification failed. Check transaction details.\n');
        }

        // Verificar nuevo balance
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
        console.log('1. The sender does not have DEFAULT_ADMIN_ROLE on the Manager contract');
        console.log('2. Insufficient POL balance for gas');
        console.log('3. Network connection issues\n');
    }
}

grantManagerRole().catch(console.error);
