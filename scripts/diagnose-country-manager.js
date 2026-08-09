/* eslint-disable @typescript-eslint/no-require-imports */
const { getRequiredRpcUrl } = require('./required-rpc');

const RPC_URL = getRequiredRpcUrl();

const { createPublicClient, createWalletClient, http, parseAbi } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { polygonAmoy } = require('viem/chains');

/**
 * Diagnose why createCertificate fails for a country manager.
 *
 * Usage (read-only):
 *   COUNTRY_CODE=AR ACCOUNT=0x7C95... node scripts/diagnose-country-manager.js
 *
 * Optional grant (if ACCOUNT lacks CERTIFICATE_MANAGER_ROLE and ADMIN_KEY is admin):
 *   ADMIN_KEY=0x... COUNTRY_CODE=AR ACCOUNT=0x7C95... FIX=1 node scripts/diagnose-country-manager.js
 *
 * Env:
 *   RPC_URL (required)
 *   COUNTRY_CODE (default AR)
 *   ACCOUNT (wallet that calls createCertificate; default executor used in app)
 *   MANAGER (optional override; else resolved via IndahouseRegistry.getManager)
 *   INDAHOUSE_REGISTRY (default from contracts.ts polygonAmoy)
 *   ADMIN_KEY + FIX=1 to grant CERTIFICATE_MANAGER_ROLE
 */

const CONFIG = {
    INDAHOUSE_REGISTRY:
        process.env.INDAHOUSE_REGISTRY || '0xec375793e3628b25547CE375Ea3B1598D85cd362',
    INDA_ROOT: process.env.INDA_ROOT || '0x543F7dF0EBD524b3bE66277E18514B44BAC4b4e1',
    BASE_TOKEN: process.env.BASE_TOKEN || '0x6C9A47762AAE694067903F4A7aB65E074488c625',
    COUNTRY_CODE: (process.env.COUNTRY_CODE || 'AR').toUpperCase(),
    ACCOUNT: process.env.ACCOUNT || '0x7C95D69E13335E80846F79aFeE69D50aF9fF1e00',
    MANAGER: process.env.MANAGER || null,
};

const ZERO = '0x0000000000000000000000000000000000000000';

const ROLE = {
    DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
    CERTIFICATE_MANAGER_ROLE: '0x793fafc4216e31eb47b95467a5d6c852611bb7e4df768602288844840c234392',
    OPERATOR_ROLE: '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929',
};

const problems = [];
const actions = [];

function check(condition, label, detailIfFail) {
    if (condition) {
        console.log(`[OK]   ${label}`);
        return true;
    }
    console.log(`[FAIL] ${label} -> ${detailIfFail}`);
    problems.push(`${label}: ${detailIfFail}`);
    return false;
}

function info(label, value) {
    console.log(`[INFO] ${label}: ${value}`);
}

function countryCodeToBytes32(code) {
    const upper = code.toUpperCase();
    return `0x${upper
        .split('')
        .map((c) => c.charCodeAt(0).toString(16))
        .join('')
        .padEnd(64, '0')}`;
}

function roleName(role) {
    if (role === ROLE.DEFAULT_ADMIN_ROLE) return 'DEFAULT_ADMIN_ROLE';
    if (role === ROLE.CERTIFICATE_MANAGER_ROLE) return 'CERTIFICATE_MANAGER_ROLE';
    if (role === ROLE.OPERATOR_ROLE) return 'OPERATOR_ROLE';
    return role;
}

async function main() {
    const publicClient = createPublicClient({ chain: polygonAmoy, transport: http(RPC_URL) });
    const countryBytes32 = countryCodeToBytes32(CONFIG.COUNTRY_CODE);
    const account = CONFIG.ACCOUNT;

    console.log('='.repeat(80));
    console.log(' DIAGNOSE COUNTRY MANAGER');
    console.log('='.repeat(80));
    info('RPC', RPC_URL.replace(/\/v2\/.+$/, '/v2/***'));
    info('Country', CONFIG.COUNTRY_CODE);
    info('Country bytes32', countryBytes32);
    info('Account (caller)', account);
    info('Registry', CONFIG.INDAHOUSE_REGISTRY);
    console.log('');

    const registryAbi = parseAbi([
        'function getManager(bytes32 countryCode) view returns (address)',
        'function hasRole(bytes32 role, address account) view returns (bool)',
        'function defaultAdmin() view returns (address)',
    ]);
    const managerAbi = parseAbi([
        'function hasRole(bytes32 role, address account) view returns (bool)',
        'function getRoleAdmin(bytes32 role) view returns (bytes32)',
        'function grantRole(bytes32 role, address account)',
        'function userCertificates(address user) view returns (address)',
        'function createCertificate(address user)',
        'function indaRoot() view returns (address)',
        'function getPoolInfo() view returns (address,address,address,bool)',
        'function initializePool(address baseToken, address _indaRoot)',
    ]);

    // 1) Resolve manager
    let managerAddress = CONFIG.MANAGER;
    if (!managerAddress) {
        managerAddress = await publicClient.readContract({
            address: CONFIG.INDAHOUSE_REGISTRY,
            abi: registryAbi,
            functionName: 'getManager',
            args: [countryBytes32],
        });
    }
    info('Manager', managerAddress);

    const managerExists = managerAddress && managerAddress.toLowerCase() !== ZERO;
    check(managerExists, 'Manager registered for country', 'getManager returned zero address — run createManager');

    if (!managerExists) {
        actions.push(`ADMIN with DEFAULT_ADMIN_ROLE on registry must call createManager(${CONFIG.COUNTRY_CODE})`);
        printSummary();
        process.exitCode = 1;
        return;
    }

    // 2) Roles on Manager for ACCOUNT
    console.log('\n--- Roles on Manager for ACCOUNT ---');
    const [hasCertRole, hasOperatorRole, hasAdminRole, certRoleAdmin] = await Promise.all([
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'hasRole',
            args: [ROLE.CERTIFICATE_MANAGER_ROLE, account],
        }),
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'hasRole',
            args: [ROLE.OPERATOR_ROLE, account],
        }),
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'hasRole',
            args: [ROLE.DEFAULT_ADMIN_ROLE, account],
        }),
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'getRoleAdmin',
            args: [ROLE.CERTIFICATE_MANAGER_ROLE],
        }),
    ]);

    check(hasCertRole, 'ACCOUNT has CERTIFICATE_MANAGER_ROLE', 'required to call createCertificate');
    info('ACCOUNT has OPERATOR_ROLE', hasOperatorRole);
    info('ACCOUNT has DEFAULT_ADMIN_ROLE on Manager', hasAdminRole);
    info('Admin role of CERTIFICATE_MANAGER_ROLE', roleName(certRoleAdmin));

    // 2b) Registry defaultAdmin (who received roles at Manager.initialize)
    console.log('\n--- Registry defaultAdmin (Manager bootstrap admin) ---');
    const registryDefaultAdmin = await publicClient.readContract({
        address: CONFIG.INDAHOUSE_REGISTRY,
        abi: registryAbi,
        functionName: 'defaultAdmin',
    });
    info('Registry.defaultAdmin()', registryDefaultAdmin);
    const [adminHasCert, adminHasOp, adminHasDefault] = await Promise.all([
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'hasRole',
            args: [ROLE.CERTIFICATE_MANAGER_ROLE, registryDefaultAdmin],
        }),
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'hasRole',
            args: [ROLE.OPERATOR_ROLE, registryDefaultAdmin],
        }),
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'hasRole',
            args: [ROLE.DEFAULT_ADMIN_ROLE, registryDefaultAdmin],
        }),
    ]);
    info('defaultAdmin has CERT on Manager', adminHasCert);
    info('defaultAdmin has OPERATOR on Manager', adminHasOp);
    info('defaultAdmin has DEFAULT_ADMIN on Manager', adminHasDefault);
    if (!hasCertRole && adminHasOp) {
        actions.push(
            `Use private key of Registry.defaultAdmin ${registryDefaultAdmin} to grant CERTIFICATE_MANAGER_ROLE to ${account}`
        );
        actions.push(
            `ADMIN_KEY=<pk-of-${registryDefaultAdmin}> FIX=1 COUNTRY_CODE=${CONFIG.COUNTRY_CODE} ACCOUNT=${account} node scripts/diagnose-country-manager.js`
        );
    }

    // 2c) Pool / IndaRoot wiring (separate from createCertificate, needed later)
    console.log('\n--- Pool / IndaRoot wiring ---');
    const [indaRootAddr, poolInfo] = await Promise.all([
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'indaRoot',
        }),
        publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'getPoolInfo',
        }),
    ]);
    info('Manager.indaRoot()', indaRootAddr);
    info('Expected IndaRoot', CONFIG.INDA_ROOT);
    info('Pool initialized', poolInfo[3]);
    info('poolToken', poolInfo[0]);
    const hasIndaRoot = indaRootAddr && indaRootAddr.toLowerCase() !== ZERO;
    check(
        hasIndaRoot && indaRootAddr.toLowerCase() === CONFIG.INDA_ROOT.toLowerCase(),
        'Manager.indaRoot matches expected',
        hasIndaRoot
            ? `got ${indaRootAddr}`
            : 'indaRoot is zero — call initializePool(baseToken, indaRoot) with DEFAULT_ADMIN on Manager'
    );
    if (!hasIndaRoot || !poolInfo[3]) {
        actions.push(
            `After roles: DEFAULT_ADMIN ${registryDefaultAdmin} must call initializePool(${CONFIG.BASE_TOKEN}, ${CONFIG.INDA_ROOT}) on Manager`
        );
    }

    // 3) Existing certificate
    console.log('\n--- Certificate state ---');
    const existingCert = await publicClient.readContract({
        address: managerAddress,
        abi: managerAbi,
        functionName: 'userCertificates',
        args: [account],
    });
    info('userCertificates(ACCOUNT)', existingCert);
    if (existingCert && existingCert.toLowerCase() !== ZERO) {
        check(true, 'Certificate already exists', '');
    } else {
        info('Certificate', 'missing — createCertificate will be needed');
    }

    // 4) Simulate createCertificate if missing cert + missing role explains the revert
    if (!existingCert || existingCert.toLowerCase() === ZERO) {
        console.log('\n--- Simulate createCertificate ---');
        try {
            await publicClient.simulateContract({
                account,
                address: managerAddress,
                abi: managerAbi,
                functionName: 'createCertificate',
                args: [account],
            });
            check(true, 'eth_call createCertificate', 'would succeed');
        } catch (error) {
            const msg = error?.shortMessage || error?.message || String(error);
            check(false, 'eth_call createCertificate', msg);
            if (String(msg).includes('AccessControlUnauthorizedAccount') || String(msg).includes('0x793fafc4')) {
                actions.push(
                    `Grant CERTIFICATE_MANAGER_ROLE on Manager ${managerAddress} to ${account}`
                );
                actions.push(
                    `Who can grant: any address with role ${roleName(certRoleAdmin)} on that Manager`
                );
                actions.push(
                    `FIX: ADMIN_KEY=<pk-of-${roleName(certRoleAdmin)}> FIX=1 node scripts/diagnose-country-manager.js`
                );
            }
        }
    }

    // 5) Registry admin hint
    console.log('\n--- Registry admin (can create managers) ---');
    const accountIsRegistryAdmin = await publicClient.readContract({
        address: CONFIG.INDAHOUSE_REGISTRY,
        abi: registryAbi,
        functionName: 'hasRole',
        args: [ROLE.DEFAULT_ADMIN_ROLE, account],
    });
    info('ACCOUNT has DEFAULT_ADMIN_ROLE on Registry', accountIsRegistryAdmin);

    // 6) Optional fix
    if (process.env.FIX === '1' && !hasCertRole) {
        console.log('\n--- FIX: grant CERTIFICATE_MANAGER_ROLE ---');
        const adminKeyRaw = process.env.ADMIN_KEY;
        if (!adminKeyRaw) {
            console.error('FIX=1 requires ADMIN_KEY');
            process.exitCode = 1;
            printSummary();
            return;
        }

        const adminKey = adminKeyRaw.startsWith('0x') ? adminKeyRaw : `0x${adminKeyRaw}`;
        const adminAccount = privateKeyToAccount(adminKey);
        const walletClient = createWalletClient({
            account: adminAccount,
            chain: polygonAmoy,
            transport: http(RPC_URL),
        });

        info('Granting from', adminAccount.address);

        const granterHasAdmin = await publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'hasRole',
            args: [certRoleAdmin, adminAccount.address],
        });
        check(
            granterHasAdmin,
            `ADMIN_KEY has ${roleName(certRoleAdmin)} on Manager`,
            'cannot grant CERTIFICATE_MANAGER_ROLE with this key'
        );

        if (!granterHasAdmin) {
            process.exitCode = 1;
            printSummary();
            return;
        }

        const hash = await walletClient.writeContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'grantRole',
            args: [ROLE.CERTIFICATE_MANAGER_ROLE, account],
        });
        info('tx', hash);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        check(receipt.status === 'success', 'grantRole confirmed', `status=${receipt.status}`);

        const hasAfter = await publicClient.readContract({
            address: managerAddress,
            abi: managerAbi,
            functionName: 'hasRole',
            args: [ROLE.CERTIFICATE_MANAGER_ROLE, account],
        });
        check(hasAfter, 'ACCOUNT now has CERTIFICATE_MANAGER_ROLE', 'grant did not stick');
    }

    printSummary();
    if (problems.length > 0) process.exitCode = 1;
}

function printSummary() {
    console.log('\n' + '='.repeat(80));
    if (problems.length === 0) {
        console.log('READY');
        console.log('Manager roles look correct for createCertificate.');
    } else {
        console.log('NOT_READY');
        console.log('Issues:');
        problems.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
        if (actions.length > 0) {
            console.log('\nRequired configuration:');
            actions.forEach((a, i) => console.log(`  ${i + 1}. ${a}`));
        }
    }
    console.log('='.repeat(80));
}

main().catch((error) => {
    console.error(error?.shortMessage || error?.message || error);
    process.exit(1);
});
