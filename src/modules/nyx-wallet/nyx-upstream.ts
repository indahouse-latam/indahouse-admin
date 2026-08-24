/**
 * Server-only Nyx V3 upstream config.
 * Login and custody must hit the SAME Nyx host as indahouse-api (JWT secret is per-instance).
 */
export function getNyxV3Upstream(): { baseUrl: string; apiKey: string } {
  const baseUrl = (
    process.env.NYX_API_BASE ||
    process.env.NEXT_PUBLIC_NYX_V3_API_BASE_URL ||
    'https://nyx-wallet-api-v3.ledgit.tech/api'
  ).replace(/\/+$/, '');

  const apiKey = process.env.NYX_V3_CLIENT_API_KEY || '';

  return { baseUrl, apiKey };
}
