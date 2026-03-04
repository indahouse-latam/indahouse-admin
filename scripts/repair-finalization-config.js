/* eslint-disable @typescript-eslint/no-require-imports */
const { createPublicClient, createWalletClient, http, parseAbi } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { polygonAmoy } = require('viem/chains');

/**
 * Direct repair script for finalization wiring/permissions.
 *
 * Usage:
 *   ADMIN_KEY=0x... node scripts/repair-finalization-config.js
 *
 * Optional env vars:
 *   RPC_URL, INDA_ADMIN_ROUTER, INDA_ROOT, BASE_TOKEN, MANAGER, CAMPAIGN_ADDR, TOKEN_ADDR, COUNTRY_CODE
 */

const CONFIG = {
    RPC_URL: process.env.RPC_URL || 'https://rpc-amoy.polygon.technology',
    INDA_ADMIN_ROUTER: process.env.INDA_ADMIN_ROUTER || '0x524BEfC17B4c8BE2d1d31ed7d5E0A5260c83a6b1',
    INDA_ROOT: process.env.INDA_ROOT || '0xA19006C5Fe8baa747317b811c9D127cc762A5878',
    BASE_TOKEN: process.env.BASE_TOKEN || '0x6C9A47762AAE694067903F4A7aB65E074488c625',
    MANAGER: process.env.MANAGER || '0xe48399f36Db6b3591dCb1002b7cFC67091374BB7',
    CAMPAIGN_ADDR: process.env.CAMPAIGN_ADDR || '0x8afbc022f0f415c399ea50b16d26a6b6dc93c804',
    TOKEN_ADDR: process.env.TOKEN_ADDR || '0x242438bc5c8dd28bc872492c709048dcf740b7e5',
    COUNTRY_CODE:
        process.env.COUNTRY_CODE ||
        '0x434f000000000000000000000000000000000000000000000000000000000000',
};

const ROLE = {
    OPERATOR_ROLE: '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929',
    USERS_MANAGER_ROLE: '0x5ebedfa6104e4963a67c17c9b73e50a627c5307e1a07c68dd391bb0e4fc974d3',
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

function fmt(label, value) {
    console.log(`${label}: ${value}`);
}

async function main() {
    const adminKeyRaw = process.env.ADMIN_KEY;
    if (!adminKeyRaw) {
        console.error('Missing ADMIN_KEY env var.');
        console.error('Usage: ADMIN_KEY=0x... node scripts/repair-finalization-config.js');
        process.exit(1);
    }

    const adminKey = adminKeyRaw.startsWith('0x') ? adminKeyRaw : `0x${adminKeyRaw}`;
    const account = privateKeyToAccount(adminKey);
    const publicClient = createPublicClient({ chain: polygonAmoy, transport: http(CONFIG.RPC_URL) });
    const walletClient = createWalletClient({ account, chain: polygonAmoy, transport: http(CONFIG.RPC_URL) });

    const hasRoleAbi = parseAbi(['function hasRole(bytes32 role,address account) view returns (bool)']);
    const managerAbi = parseAbi([
        'function getPoolInfo() view returns (address,address,address,bool)',
        'function registeredCampaigns(address) view returns (bool)',
        'function registerCampaign(address)',
        'function individualTokens(address) view returns (address,address,string,bool,uint256,uint256,uint256,uint256)',
        'function registerIndividualToken(address,address,string)',
        'function userCertificates(address) view returns (address)',
    ]);
    const tokenAbi = parseAbi([
        'function owner() view returns (address)',
        'function indaDistributor() view returns (address)',
        'function symbol() view returns (string)',
    ]);
    const distributorAbi = parseAbi([
        'function initialize(address,address,address,string)',
        'function shareToken() view returns (address)',
        'function rewardToken() view returns (address)',
        'function indaRoot() view returns (address)',
    ]);
    const indaRootAbi = parseAbi([
        'function whitelist(address) view returns (bool)',
        'function _setToWhitelist(address[],bool[])',
    ]);
    const campaignAbi = parseAbi([
        'function totalCommitted() view returns (uint256)',
        'function getInvestors() view returns (address[])',
        'function approveFunds(address,uint256)',
    ]);
    const erc20Abi = parseAbi(['function allowance(address owner,address spender) view returns (uint256)']);

    console.log('='.repeat(80));
    console.log(' REPAIR FINALIZATION CONFIG (DIRECT FIX)');
    console.log('='.repeat(80));
    fmt('Signer', account.address);
    fmt('Token', CONFIG.TOKEN_ADDR);
    fmt('Campaign', CONFIG.CAMPAIGN_ADDR);
    fmt('Manager', CONFIG.MANAGER);

    // 1) Distributor initialization and wiring
    console.log('\n--- 1) Distributor checks / fix ---');
    const tokenDistributor = await publicClient.readContract({
        address: CONFIG.TOKEN_ADDR,
        abi: tokenAbi,
        functionName: 'indaDistributor',
    });
    fmt('Token.indaDistributor', tokenDistributor);

    const tokenDistributorCode = await publicClient.getBytecode({ address: tokenDistributor });
    if (!tokenDistributorCode || tokenDistributorCode === '0x') {
        throw new Error(`Distributor has no bytecode: ${tokenDistributor}`);
    }

    const shareToken = await publicClient.readContract({
        address: tokenDistributor,
        abi: distributorAbi,
        functionName: 'shareToken',
    });
    const indaRootOnDistributor = await publicClient.readContract({
        address: tokenDistributor,
        abi: distributorAbi,
        functionName: 'indaRoot',
    });
    const rewardTokenOnDistributor = await publicClient.readContract({
        address: tokenDistributor,
        abi: distributorAbi,
        functionName: 'rewardToken',
    });

    fmt('Distributor.shareToken', shareToken);
    fmt('Distributor.rewardToken', rewardTokenOnDistributor);
    fmt('Distributor.indaRoot', indaRootOnDistributor);

    if (shareToken === ZERO_ADDRESS || indaRootOnDistributor === ZERO_ADDRESS || rewardTokenOnDistributor === ZERO_ADDRESS) {
        console.log('Applying fix: initialize distributor...');
        const tx = await walletClient.writeContract({
            address: tokenDistributor,
            abi: distributorAbi,
            functionName: 'initialize',
            args: [CONFIG.TOKEN_ADDR, CONFIG.BASE_TOKEN, CONFIG.INDA_ROOT, `Distributor-${CONFIG.TOKEN_ADDR.slice(0, 10)}`],
        });
        console.log(`  tx: ${tx}`);
        await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log('  Distributor initialized.');
    } else {
        console.log('Distributor already initialized.');
    }

    // 2) Manager token registration alignment
    console.log('\n--- 2) Manager token registration alignment ---');
    const managerTokenInfo = await publicClient.readContract({
        address: CONFIG.MANAGER,
        abi: managerAbi,
        functionName: 'individualTokens',
        args: [CONFIG.TOKEN_ADDR],
    });
    const managerDistributor = managerTokenInfo[1];
    const managerIsActive = managerTokenInfo[3];
    const managerSymbol = managerTokenInfo[2] || (await publicClient.readContract({
        address: CONFIG.TOKEN_ADDR,
        abi: tokenAbi,
        functionName: 'symbol',
    }));

    fmt('Manager.distributor(token)', managerDistributor);
    fmt('Manager.isActive(token)', managerIsActive);
    fmt('Manager.symbol(token)', managerSymbol);

    const hasOperatorOnManager = await publicClient.readContract({
        address: CONFIG.MANAGER,
        abi: hasRoleAbi,
        functionName: 'hasRole',
        args: [ROLE.OPERATOR_ROLE, account.address],
    });
    fmt('Signer has OPERATOR_ROLE on Manager', hasOperatorOnManager);

    if ((!managerIsActive || managerDistributor.toLowerCase() !== tokenDistributor.toLowerCase()) && hasOperatorOnManager) {
        console.log('Applying fix: register/update token in Manager...');
        const tx = await walletClient.writeContract({
            address: CONFIG.MANAGER,
            abi: managerAbi,
            functionName: 'registerIndividualToken',
            args: [CONFIG.TOKEN_ADDR, tokenDistributor, managerSymbol],
        });
        console.log(`  tx: ${tx}`);
        await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log('  Manager token registration aligned.');
    } else if (!hasOperatorOnManager) {
        console.log('Skipped Manager token alignment: signer lacks OPERATOR_ROLE on Manager.');
    } else {
        console.log('Manager token registration already aligned.');
    }

    // 3) Campaign registration in Manager
    console.log('\n--- 3) Campaign registration check ---');
    const isCampaignRegistered = await publicClient.readContract({
        address: CONFIG.MANAGER,
        abi: managerAbi,
        functionName: 'registeredCampaigns',
        args: [CONFIG.CAMPAIGN_ADDR],
    });
    fmt('Manager.registeredCampaigns(campaign)', isCampaignRegistered);

    if (!isCampaignRegistered && hasOperatorOnManager) {
        console.log('Applying fix: register campaign in Manager...');
        const tx = await walletClient.writeContract({
            address: CONFIG.MANAGER,
            abi: managerAbi,
            functionName: 'registerCampaign',
            args: [CONFIG.CAMPAIGN_ADDR],
        });
        console.log(`  tx: ${tx}`);
        await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log('  Campaign registered.');
    } else if (!hasOperatorOnManager) {
        console.log('Skipped campaign registration: signer lacks OPERATOR_ROLE on Manager.');
    } else {
        console.log('Campaign already registered.');
    }

    // 4) Whitelist critical actors
    console.log('\n--- 4) Whitelist critical actors in IndaRoot ---');
    const hasUsersManagerRole = await publicClient.readContract({
        address: CONFIG.INDA_ROOT,
        abi: hasRoleAbi,
        functionName: 'hasRole',
        args: [ROLE.USERS_MANAGER_ROLE, account.address],
    });
    fmt('Signer has USERS_MANAGER_ROLE on IndaRoot', hasUsersManagerRole);

    const poolInfo = await publicClient.readContract({
        address: CONFIG.MANAGER,
        abi: managerAbi,
        functionName: 'getPoolInfo',
    });
    const poolVault = poolInfo[2];

    const criticalAddresses = [CONFIG.INDA_ADMIN_ROUTER, CONFIG.CAMPAIGN_ADDR, poolVault].filter(
        (a) => a && a !== ZERO_ADDRESS
    );

    const investors = await publicClient.readContract({
        address: CONFIG.CAMPAIGN_ADDR,
        abi: campaignAbi,
        functionName: 'getInvestors',
    });

    for (const inv of investors) {
        criticalAddresses.push(inv);
        const cmd = await publicClient.readContract({
            address: CONFIG.MANAGER,
            abi: managerAbi,
            functionName: 'userCertificates',
            args: [inv],
        });
        if (cmd && cmd !== ZERO_ADDRESS) criticalAddresses.push(cmd);
    }

    const uniqueAddresses = [...new Set(criticalAddresses.map((a) => a.toLowerCase()))];
    const missingWhitelist = [];
    for (const addr of uniqueAddresses) {
        const wl = await publicClient.readContract({
            address: CONFIG.INDA_ROOT,
            abi: indaRootAbi,
            functionName: 'whitelist',
            args: [addr],
        });
        if (!wl) missingWhitelist.push(addr);
    }
    fmt('Missing whitelist count', missingWhitelist.length);

    if (missingWhitelist.length > 0 && hasUsersManagerRole) {
        console.log('Applying fix: whitelist missing addresses...');
        const tx = await walletClient.writeContract({
            address: CONFIG.INDA_ROOT,
            abi: indaRootAbi,
            functionName: '_setToWhitelist',
            args: [missingWhitelist, new Array(missingWhitelist.length).fill(true)],
        });
        console.log(`  tx: ${tx}`);
        await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log('  Whitelist updated.');
    } else if (missingWhitelist.length > 0) {
        console.log('Skipped whitelist fix: signer lacks USERS_MANAGER_ROLE on IndaRoot.');
    } else {
        console.log('All critical addresses already whitelisted.');
    }

    // 5) Campaign approveFunds if allowance missing
    console.log('\n--- 5) Campaign approveFunds check ---');
    const totalCommitted = await publicClient.readContract({
        address: CONFIG.CAMPAIGN_ADDR,
        abi: campaignAbi,
        functionName: 'totalCommitted',
    });
    const allowance = await publicClient.readContract({
        address: CONFIG.BASE_TOKEN,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [CONFIG.CAMPAIGN_ADDR, CONFIG.INDA_ADMIN_ROUTER],
    });
    fmt('Campaign totalCommitted', totalCommitted);
    fmt('Campaign->Router allowance', allowance);

    if (allowance < totalCommitted) {
        console.log('Applying fix: campaign.approveFunds(router, totalCommitted)...');
        const tx = await walletClient.writeContract({
            address: CONFIG.CAMPAIGN_ADDR,
            abi: campaignAbi,
            functionName: 'approveFunds',
            args: [CONFIG.INDA_ADMIN_ROUTER, totalCommitted],
        });
        console.log(`  tx: ${tx}`);
        await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log('  approveFunds executed.');
    } else {
        console.log('Allowance already sufficient.');
    }

    console.log('\n' + '='.repeat(80));
    console.log(' Repair script completed.');
    console.log(' Next: run node scripts/validate-finalization-ready.js');
    console.log('='.repeat(80));
}

main().catch((error) => {
    console.error('\nRepair script failed.');
    console.error(error?.shortMessage || error?.message || error);
    process.exit(1);
});

