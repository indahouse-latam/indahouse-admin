import type { BiometricCredential, SafeDeployment, Wallet } from 'nyx_wallet';

export interface NyxWalletBootstrapConfig {
  apiBaseUrl: string;
  accessToken: string;
  biometricRpId: string;
  deployment: SafeDeployment;
  network: 'testnet' | 'mainnet';
  chainId: number;
  needsWalletBootstrap: boolean;
  walletId?: string;
  address?: string;
  biometricCredential?: BiometricCredential | null;
}

export interface RegisterV3WalletPayload {
  walletId: string;
  address: string;
  walletName?: string;
}

export interface ActiveNyxWallet {
  wallet: Wallet;
  walletId: string;
  address: string;
}

export type { BiometricCredential, SafeDeployment, Wallet };
