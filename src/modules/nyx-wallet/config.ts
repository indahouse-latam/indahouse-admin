'use client';

import { fetchApi } from '@/utils/api';
import type { NyxWalletBootstrapConfig } from './types';

export async function fetchWalletBootstrap(): Promise<NyxWalletBootstrapConfig> {
  return fetchApi('/auth/wallet/bootstrap', { method: 'GET' });
}

export async function registerV3Wallet(payload: {
  walletId: string;
  address: string;
  walletName?: string;
}): Promise<{
  wallet: {
    address: string;
    wallet_name?: string;
    active: boolean;
    external_id: string;
  };
}> {
  return fetchApi('/auth/wallet/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchNyxAccessToken(): Promise<string> {
  const data = await fetchApi('/auth/wallet-token', { method: 'GET' });
  if (!data?.token) throw new Error('No Nyx access token available');
  return data.token;
}
