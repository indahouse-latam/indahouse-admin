const { createWalletClient, createPublicClient, http, parseEther } = require('viem');
const { polygonAmoy } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');

const DEPLOYER_KEY = '';
const RECIPIENT = '';
const AMOUNT_POL = '10'; // 10 POL

async function sendPOL() {
    console.log('\n💰 Sending POL on Polygon Amoy...\n');

    // Create account from private key
    const account = privateKeyToAccount(DEPLOYER_KEY);
    console.log(`From: ${account.address}`);
    console.log(`To: ${RECIPIENT}`);
    console.log(`Amount: ${AMOUNT_POL} POL\n`);

    // Create wallet client
    const walletClient = createWalletClient({
        account,
        chain: polygonAmoy,
        transport: http('https://rpc-amoy.polygon.technology'),
    });

    // Create public client for checking balance
    const publicClient = createPublicClient({
        chain: polygonAmoy,
        transport: http('https://rpc-amoy.polygon.technology'),
    });

    try {
        // Check sender balance
        const balance = await publicClient.getBalance({ address: account.address });
        const balancePOL = Number(balance) / 1e18;
        console.log(`Current balance: ${balancePOL.toFixed(4)} POL`);

        if (balancePOL < parseFloat(AMOUNT_POL)) {
            console.log(`❌ Insufficient balance. Need ${AMOUNT_POL} POL but only have ${balancePOL.toFixed(4)} POL\n`);
            return;
        }

        // Send transaction
        console.log('\n🔄 Sending transaction...');
        const hash = await walletClient.sendTransaction({
            to: RECIPIENT,
            value: parseEther(AMOUNT_POL),
        });

        console.log(`✅ Transaction sent!`);
        console.log(`   Hash: ${hash}`);
        console.log(`   Explorer: https://amoy.polygonscan.com/tx/${hash}`);

        // Wait for confirmation
        console.log('\n⏳ Waiting for confirmation...');
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        console.log(`✅ Transaction confirmed!`);
        console.log(`   Block: ${receipt.blockNumber}`);
        console.log(`   Gas used: ${receipt.gasUsed}`);
        console.log(`   Status: ${receipt.status === 'success' ? 'Success ✅' : 'Failed ❌'}\n`);

        // Check new balances
        const newSenderBalance = await publicClient.getBalance({ address: account.address });
        const newRecipientBalance = await publicClient.getBalance({ address: RECIPIENT });

        console.log('Final balances:');
        console.log(`   Sender: ${(Number(newSenderBalance) / 1e18).toFixed(4)} POL`);
        console.log(`   Recipient: ${(Number(newRecipientBalance) / 1e18).toFixed(4)} POL\n`);

    } catch (error) {
        console.error('\n❌ Error sending transaction:', error.message);
        if (error.shortMessage) {
            console.error(`   Details: ${error.shortMessage}\n`);
        }
    }
}

sendPOL().catch(console.error);
