const test = require('node:test');
const assert = require('node:assert/strict');
const { getRequiredRpcUrl } = require('./required-rpc');

test('requires RPC_URL', () => {
    assert.throws(() => getRequiredRpcUrl({}), /RPC_URL is required/);
});

test('rejects whitespace-only RPC_URL', () => {
    assert.throws(() => getRequiredRpcUrl({ RPC_URL: '   ' }), /RPC_URL is required/);
});

test('rejects malformed RPC_URL', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: 'not a url' }),
        /must be a valid URL/,
    );
});

test('requires HTTPS', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: 'http://polygon-amoy.drpc.org' }),
        /must use HTTPS/,
    );
});

test('rejects retired Polygon Amoy RPC', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: 'https://rpc-amoy.polygon.technology' }),
        /retired Amoy RPC/,
    );
});

test('rejects retired Polygon Amoy RPC with a trailing dot', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: 'https://rpc-amoy.polygon.technology.' }),
        /retired Amoy RPC/,
    );
});

test('requires an FQDN', () => {
    for (const hostname of ['localhost', 'polygon-amoy']) {
        assert.throws(
            () => getRequiredRpcUrl({ RPC_URL: `https://${hostname}` }),
            /must use an FQDN/,
        );
    }
});

test('rejects an all-numeric IPv4 hostname', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: 'https://127.0.0.1' }),
        /must use an FQDN/,
    );
});

test('rejects an IPv6 hostname', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: 'https://[::1]' }),
        /must use an FQDN/,
    );
});

test('rejects an empty hostname label', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: 'https://polygon-amoy..drpc.org' }),
        /must use an FQDN/,
    );
});

test('rejects invalid hostname label characters and boundaries', () => {
    for (const hostname of ['-polygon.example', 'polygon-.example', 'polygon_amoy.example']) {
        assert.throws(
            () => getRequiredRpcUrl({ RPC_URL: `https://${hostname}` }),
            /must use an FQDN/,
        );
    }
});

test('enforces the 63-character hostname label limit', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: `https://${'a'.repeat(64)}.example` }),
        /must use an FQDN/,
    );
    assert.equal(
        getRequiredRpcUrl({ RPC_URL: `https://${'a'.repeat(63)}.example` }),
        `https://${'a'.repeat(63)}.example`,
    );
});

test('allows a valid punycode hostname', () => {
    assert.equal(
        getRequiredRpcUrl({ RPC_URL: 'https://xn--bcher-kva.example' }),
        'https://xn--bcher-kva.example',
    );
});

test('rejects retired Polygon Amoy RPC with multiple trailing dots', () => {
    assert.throws(
        () => getRequiredRpcUrl({ RPC_URL: 'https://rpc-amoy.polygon.technology...' }),
        /retired Amoy RPC/,
    );
});

test('normalizes multiple trailing dots from an approved RPC', () => {
    assert.equal(
        getRequiredRpcUrl({ RPC_URL: 'https://polygon-amoy.drpc.org...' }),
        'https://polygon-amoy.drpc.org',
    );
});

test('normalizes approved RPC', () => {
    assert.equal(
        getRequiredRpcUrl({ RPC_URL: 'https://polygon-amoy.drpc.org/' }),
        'https://polygon-amoy.drpc.org',
    );
});
