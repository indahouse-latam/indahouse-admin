const DEPRECATED_AMOY_RPC_HOST = 'rpc-amoy.polygon.technology';

function normalizeFqdn(name, hostname) {
    const normalized = hostname.replace(/\.+$/, '');
    const labels = normalized.split('.');
    const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

    if (
        normalized.includes(':')
        || labels.length < 2
        || labels.every((label) => /^\d+$/.test(label))
        || labels.some((label) => !validLabel.test(label))
    ) {
        throw new Error(`${name} must use an FQDN`);
    }

    return normalized;
}

function getRequiredRpcUrl(env = process.env) {
    const value = env.RPC_URL?.trim();
    if (!value) throw new Error('RPC_URL is required');

    let url;
    try {
        url = new URL(value);
    } catch {
        throw new Error('RPC_URL must be a valid URL');
    }

    if (url.protocol !== 'https:') throw new Error('RPC_URL must use HTTPS');
    const hostname = normalizeFqdn('RPC_URL', url.hostname);
    if (hostname === DEPRECATED_AMOY_RPC_HOST) {
        throw new Error("RPC_URL uses Polygon's retired Amoy RPC");
    }
    url.hostname = hostname;

    return url.toString().replace(/\/$/, '');
}

module.exports = { getRequiredRpcUrl };
