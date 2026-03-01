/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('node:child_process');

/**
 * Bootstrap script to prepare finalization prerequisites.
 *
 * Usage:
 *   ADMIN_KEY=0x... node scripts/bootstrap-finalization-prereqs.js
 *
 * It runs:
 *  1) repair-finalization-config.js (direct on-chain fixes)
 *  2) validate-finalization-ready.js (READY/NOT_READY gate)
 */

function run(command, label) {
    console.log(`\n--- ${label} ---`);
    execSync(command, {
        stdio: 'inherit',
        env: process.env,
    });
}

function main() {
    if (!process.env.ADMIN_KEY) {
        console.error('Missing ADMIN_KEY env var.');
        console.error('Usage: ADMIN_KEY=0x... node scripts/bootstrap-finalization-prereqs.js');
        process.exit(1);
    }

    console.log('='.repeat(80));
    console.log(' BOOTSTRAP FINALIZATION PREREQS');
    console.log('='.repeat(80));

    run('node "scripts/repair-finalization-config.js"', 'Phase 1: Repair Wiring/Permissions');
    run('node "scripts/validate-finalization-ready.js"', 'Phase 2: Validate READY/NOT_READY');

    console.log('\n' + '='.repeat(80));
    console.log(' Bootstrap complete.');
    console.log(' If READY, you can run: node scripts/debug-finalization.js');
    console.log('='.repeat(80));
}

try {
    main();
} catch (error) {
    console.error('\nBootstrap failed.');
    console.error(error?.message || error);
    process.exit(1);
}

