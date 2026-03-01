/* eslint-disable @typescript-eslint/no-require-imports */
const { createPublicClient, http, parseAbi, encodeFunctionData, decodeAbiParameters } = require('viem');
const { polygonAmoy } = require('viem/chains');

/**
 * Post-fix validator for finalization flow.
 *
 * Usage:
 *   node scripts/validate-finalization-ready.js
 */

const CONFIG = {
    RPC_URL: process.env.RPC_URL || 'https://rpc-amoy.polygon.technology',
    ALCHEMY_RPC:
        process.env.ALCHEMY_RPC || 'https://polygon-amoy.g.alchemy.com/v2/qH_uhB7EN-Dm4gagZOnioXIsXcV5q6C2',
    INDA_ADMIN_ROUTER: process.env.INDA_ADMIN_ROUTER || '0x524BEfC17B4c8BE2d1d31ed7d5E0A5260c83a6b1',
    INDA_ROOT: process.env.INDA_ROOT || '0xA19006C5Fe8baa747317b811c9D127cc762A5878',
    BASE_TOKEN: process.env.BASE_TOKEN || '0x6C9A47762AAE694067903F4A7aB65E074488c625',
    MANAGER: process.env.MANAGER || '0xe48399f36Db6b3591dCb1002b7cFC67091374BB7',
    CAMPAIGN_ADDR: process.env.CAMPAIGN_ADDR || '0x8afbc022f0f415c399ea50b16d26a6b6dc93c804',
    TOKEN_ADDR: process.env.TOKEN_ADDR || '0x242438bc5c8dd28bc872492c709048dcf740b7e5',
    EXECUTOR: process.env.EXECUTOR || '0x7C95D69E13335E80846F79aFeE69D50aF9fF1e00',
    COUNTRY_CODE:
        process.env.COUNTRY_CODE ||
        '0x434f000000000000000000000000000000000000000000000000000000000000',
};

const ZERO = '0x0000000000000000000000000000000000000000';
const problems = [];

function check(condition, label, detailIfFail) {
    if (condition) {
        console.log(`[OK] ${label}`);
        return;
    }
    console.log(`[FAIL] ${label} -> ${detailIfFail}`);
    problems.push(`${label}: ${detailIfFail}`);
}

function decodeRevert(data) {
    if (!data || data === '0x') return 'EMPTY_REVERT_0x';
    const selector = data.slice(0, 10);
    if (selector === '0x08c379a0') {
        try {
            const decoded = decodeAbiParameters([{ type: 'string' }], `0x${data.slice(10)}`);
            return `Error(string): ${decoded[0]}`;
        } catch {
            return 'Error(string): decode failed';
        }
    }
    if (selector === '0x4e487b71') {
        return 'Panic(uint256)';
    }
    return `CustomOrUnknown(${selector})`;
}

async function rawEthCall(rpcUrl, from, to, data, gasHex = '0x1C9C380') {
    const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_call',
            params: [{ from, to, data, gas: gasHex }, 'latest'],
        }),
    });
    return response.json();
}

async function main() {
    const publicClient = createPublicClient({ chain: polygonAmoy, transport: http(CONFIG.ALCHEMY_RPC) });
    console.log('='.repeat(80));
    console.log(' VALIDATE FINALIZATION READY');
    console.log('='.repeat(80));

    const tokenAbi = parseAbi(['function indaDistributor() view returns (address)', 'function owner() view returns (address)']);
    const distributorAbi = parseAbi([
        'function shareToken() view returns (address)',
        'function rewardToken() view returns (address)',
        'function indaRoot() view returns (address)',
    ]);
    const managerAbi = parseAbi([
        'function individualTokens(address) view returns (address,address,string,bool,uint256,uint256,uint256,uint256)',
        'function getPoolInfo() view returns (address,address,address,bool)',
        'function registeredCampaigns(address) view returns (bool)',
        'function userCertificates(address) view returns (address)',
    ]);
    const campaignAbi = parseAbi([
        'function totalCommitted() view returns (uint256)',
        'function getInvestors() view returns (address[])',
        'function committed(address) view returns (uint256)',
        'function investorFeeBP(address) view returns (uint16)',
        'function investorPoolPercentage(address) view returns (uint256)',
    ]);
    const rootAbi = parseAbi([
        'function whitelist(address) view returns (bool)',
        'function propertyRegistry() view returns (address)',
    ]);
    const propertyAbi = parseAbi([
        'function tokenToPropertyId(address) view returns (uint256)',
        'function getProperty(uint256) view returns ((address,bytes32,string,uint256,uint256,uint64,uint64,uint120,uint8,uint256,uint256,uint256))',
    ]);

    // Distributor checks
    const tokenDistributor = await publicClient.readContract({
        address: CONFIG.TOKEN_ADDR,
        abi: tokenAbi,
        functionName: 'indaDistributor',
    });
    const dShare = await publicClient.readContract({ address: tokenDistributor, abi: distributorAbi, functionName: 'shareToken' });
    const dReward = await publicClient.readContract({ address: tokenDistributor, abi: distributorAbi, functionName: 'rewardToken' });
    const dRoot = await publicClient.readContract({ address: tokenDistributor, abi: distributorAbi, functionName: 'indaRoot' });
    check(dShare.toLowerCase() === CONFIG.TOKEN_ADDR.toLowerCase(), 'Individual distributor shareToken', `${dShare} != ${CONFIG.TOKEN_ADDR}`);
    check(dReward.toLowerCase() === CONFIG.BASE_TOKEN.toLowerCase(), 'Individual distributor rewardToken', `${dReward} != ${CONFIG.BASE_TOKEN}`);
    check(dRoot.toLowerCase() === CONFIG.INDA_ROOT.toLowerCase(), 'Individual distributor indaRoot', `${dRoot} != ${CONFIG.INDA_ROOT}`);

    // Manager checks
    const managerTokenInfo = await publicClient.readContract({
        address: CONFIG.MANAGER,
        abi: managerAbi,
        functionName: 'individualTokens',
        args: [CONFIG.TOKEN_ADDR],
    });
    check(managerTokenInfo[3] === true, 'Manager individual token isActive', `isActive=${managerTokenInfo[3]}`);
    check(
        managerTokenInfo[1].toLowerCase() === tokenDistributor.toLowerCase(),
        'Manager distributor matches token distributor',
        `${managerTokenInfo[1]} != ${tokenDistributor}`
    );
    const campaignRegistered = await publicClient.readContract({
        address: CONFIG.MANAGER,
        abi: managerAbi,
        functionName: 'registeredCampaigns',
        args: [CONFIG.CAMPAIGN_ADDR],
    });
    check(campaignRegistered === true, 'Campaign registered in manager', `registered=${campaignRegistered}`);

    // Property checks
    const propertyRegistry = await publicClient.readContract({
        address: CONFIG.INDA_ROOT,
        abi: rootAbi,
        functionName: 'propertyRegistry',
    });
    const propertyId = await publicClient.readContract({
        address: propertyRegistry,
        abi: propertyAbi,
        functionName: 'tokenToPropertyId',
        args: [CONFIG.TOKEN_ADDR],
    });
    const property = await publicClient.readContract({
        address: propertyRegistry,
        abi: propertyAbi,
        functionName: 'getProperty',
        args: [propertyId],
    });
    check(propertyId > 0n, 'Property mapping exists', `propertyId=${propertyId}`);
    check(property[4] > 0n, 'Property pricePerToken > 0', `price=${property[4]}`);
    check(property[8] === 1, 'Property status ACTIVE(1)', `status=${property[8]}`);

    // Whitelist checks
    const poolInfo = await publicClient.readContract({
        address: CONFIG.MANAGER,
        abi: managerAbi,
        functionName: 'getPoolInfo',
    });
    const critical = [CONFIG.INDA_ADMIN_ROUTER, CONFIG.CAMPAIGN_ADDR, poolInfo[2]].filter((a) => a && a !== ZERO);
    for (const addr of critical) {
        const wl = await publicClient.readContract({ address: CONFIG.INDA_ROOT, abi: rootAbi, functionName: 'whitelist', args: [addr] });
        check(wl === true, `Whitelist ${addr.slice(0, 10)}...`, 'not whitelisted');
    }

    const investors = await publicClient.readContract({
        address: CONFIG.CAMPAIGN_ADDR,
        abi: campaignAbi,
        functionName: 'getInvestors',
    });
    const investments = [];
    for (const inv of investors) {
        const cmd = await publicClient.readContract({
            address: CONFIG.MANAGER,
            abi: managerAbi,
            functionName: 'userCertificates',
            args: [inv],
        });
        check(cmd !== ZERO, `Investor CMD ${inv.slice(0, 10)}...`, 'missing CMD');
        const iwl = await publicClient.readContract({ address: CONFIG.INDA_ROOT, abi: rootAbi, functionName: 'whitelist', args: [inv] });
        check(iwl === true, `Investor whitelist ${inv.slice(0, 10)}...`, 'not whitelisted');
        if (cmd !== ZERO) {
            const cwl = await publicClient.readContract({ address: CONFIG.INDA_ROOT, abi: rootAbi, functionName: 'whitelist', args: [cmd] });
            check(cwl === true, `CMD whitelist ${cmd.slice(0, 10)}...`, 'not whitelisted');
        }
        const usdcAmount = await publicClient.readContract({
            address: CONFIG.CAMPAIGN_ADDR,
            abi: campaignAbi,
            functionName: 'committed',
            args: [inv],
        });
        const feeBP = await publicClient.readContract({
            address: CONFIG.CAMPAIGN_ADDR,
            abi: campaignAbi,
            functionName: 'investorFeeBP',
            args: [inv],
        });
        const poolPct = await publicClient.readContract({
            address: CONFIG.CAMPAIGN_ADDR,
            abi: campaignAbi,
            functionName: 'investorPoolPercentage',
            args: [inv],
        });
        investments.push({
            userEOA: inv,
            userCMD: cmd,
            individualToken: CONFIG.TOKEN_ADDR,
            poolToken: poolInfo[0],
            usdcAmount,
            poolPercentage: poolPct,
            countryCode: CONFIG.COUNTRY_CODE,
            feePercentage: Number(feeBP),
        });
    }

    // Simulate mint
    const mintAbi = [{
        type: 'function',
        name: 'mintINDHWithBase',
        stateMutability: 'nonpayable',
        inputs: [{
            name: 'investments',
            type: 'tuple[]',
            components: [
                { name: 'userEOA', type: 'address' },
                { name: 'userCMD', type: 'address' },
                { name: 'individualToken', type: 'address' },
                { name: 'poolToken', type: 'address' },
                { name: 'usdcAmount', type: 'uint256' },
                { name: 'poolPercentage', type: 'uint256' },
                { name: 'countryCode', type: 'bytes32' },
                { name: 'feePercentage', type: 'uint16' },
            ],
        }],
        outputs: [{ type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }],
    }];
    const mintCalldata = encodeFunctionData({ abi: mintAbi, functionName: 'mintINDHWithBase', args: [investments] });
    const mintCall = await rawEthCall(CONFIG.ALCHEMY_RPC, CONFIG.INDA_ADMIN_ROUTER, CONFIG.INDA_ROOT, mintCalldata);
    check(!mintCall.error, 'eth_call mintINDHWithBase', mintCall.error ? decodeRevert(mintCall.error.data) : 'ok');

    // Simulate finalize
    const finalizeAbi = parseAbi([
        'function finalizeAndDistributeCampaignBatched(address,bytes32,address,address,address,uint256,uint256)',
    ]);
    const finalizeData = encodeFunctionData({
        abi: finalizeAbi,
        functionName: 'finalizeAndDistributeCampaignBatched',
        args: [CONFIG.CAMPAIGN_ADDR, CONFIG.COUNTRY_CODE, CONFIG.TOKEN_ADDR, CONFIG.BASE_TOKEN, CONFIG.INDA_ROOT, 0n, 1n],
    });
    const finalizeCall = await rawEthCall(CONFIG.ALCHEMY_RPC, CONFIG.EXECUTOR, CONFIG.INDA_ADMIN_ROUTER, finalizeData);
    check(!finalizeCall.error, 'eth_call finalizeAndDistributeCampaignBatched', finalizeCall.error ? decodeRevert(finalizeCall.error.data) : 'ok');

    console.log('\n' + '='.repeat(80));
    if (problems.length === 0) {
        console.log('READY');
        console.log('All checks passed. Finalization path is ready.');
    } else {
        console.log('NOT_READY');
        console.log('Issues:');
        problems.forEach((p, i) => console.log(`${i + 1}. ${p}`));
        process.exitCode = 1;
    }
    console.log('='.repeat(80));
}

main().catch((error) => {
    console.error(error?.shortMessage || error?.message || error);
    process.exit(1);
});

