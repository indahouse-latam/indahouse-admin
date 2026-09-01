'use client';

import {
  createDeviceStore,
  createPasskeyRecoveryKeyProvider,
  createWallet,
  openWallet,
  recoverWalletWithPasskey,
  type BiometricCredential,
  type Wallet,
} from 'nyx_wallet';
import { ethers } from 'ethers';
import { POLYGON_AMOY_RPC_URL } from '@/config/env';
import { fetchApi } from '@/utils/api';
import { getMemorySession, setMemorySession } from '@/utils/auth-session';
import { createAppRecoveryVault } from './recovery-vault';
import {
  describeWebAuthnOriginError,
  isWebAuthnRpCompatible,
  probeNyxPasskey,
  registerBiometricCredential,
  resolveStoredBiometricCredential,
} from './biometric-credential';
import {
  fetchNyxAccessToken,
  fetchWalletBootstrap,
  registerV3Wallet,
} from './config';
import type { ActiveNyxWallet, NyxWalletBootstrapConfig } from './types';

let activeWallet: ActiveNyxWallet | null = null;

const ENTRY_POINT_GET_NONCE_ABI = [
  'function getNonce(address sender, uint192 key) view returns (uint256)',
] as const;

function assertBrowser(): void {
  if (typeof window === 'undefined') {
    throw new Error('Nyx wallet SDK can only run in the browser');
  }
}

async function nyxBffFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return globalThis.fetch(input, {
    ...init,
    credentials: 'include',
  });
}

function rpcUrlForChain(chainId: number): string {
  if (chainId === 80002) return POLYGON_AMOY_RPC_URL;
  return 'https://polygon-rpc.com';
}

async function whitelistSafeAddress(address: string): Promise<void> {
  try {
    await fetchApi('/whitelistWallets', {
      method: 'POST',
      body: JSON.stringify({
        params: { address, status: true },
      }),
    });
  } catch (error) {
    console.warn('Could not whitelist V3 Safe after register:', error);
  }
}

async function buildSdkConfig(
  bootstrap: NyxWalletBootstrapConfig,
  userId: string,
  biometricCredential: BiometricCredential,
) {
  const accessToken = bootstrap.accessToken || (await fetchNyxAccessToken());

  return {
    apiBaseUrl: '/api/nyx',
    accessToken,
    deviceStore: createDeviceStore({ userId }),
    recoveryVault: createAppRecoveryVault(),
    recoveryKeyProvider: createPasskeyRecoveryKeyProvider(),
    biometricCredential,
    biometricRpId: bootstrap.biometricRpId,
    fetch: nyxBffFetch,
  };
}

async function recoverDeviceShare(
  sdkConfig: {
    apiBaseUrl: string;
    accessToken: string;
    recoveryKeyProvider: ReturnType<typeof createPasskeyRecoveryKeyProvider>;
    fetch: typeof nyxBffFetch;
    deviceStore: { write: (walletId: string, share: string) => Promise<void> };
  },
  walletId: string,
  deployment: NyxWalletBootstrapConfig['deployment'],
): Promise<void> {
  const recovered = await recoverWalletWithPasskey(
    {
      apiBaseUrl: sdkConfig.apiBaseUrl,
      accessToken: sdkConfig.accessToken,
      keyProvider: sdkConfig.recoveryKeyProvider,
      deployment,
      fetch: sdkConfig.fetch,
    },
    walletId,
  );
  if (recovered.status === 'needs-guardians') {
    throw new Error(`Wallet recovery requires guardians: ${recovered.detail}`);
  }
  await sdkConfig.deviceStore.write(walletId, recovered.material.device);
}

export async function ensureWallet(): Promise<ActiveNyxWallet> {
  assertBrowser();
  if (activeWallet) return activeWallet;

  const session = getMemorySession();
  if (!session?.id) throw new Error('User session required to open wallet');

  const bootstrap = await fetchWalletBootstrap();
  const accessToken = bootstrap.accessToken || (await fetchNyxAccessToken());

  try {
    const probe = await probeNyxPasskey({ fetch: nyxBffFetch, accessToken });
    const rpId = probe.rpId || bootstrap.biometricRpId;
    if (rpId && !isWebAuthnRpCompatible(rpId)) {
      throw new Error(describeWebAuthnOriginError(rpId));
    }

    let biometric = await resolveStoredBiometricCredential({
      userId: session.id,
      remoteCredential: bootstrap.biometricCredential,
    });
    if (!biometric && !probe.exists) {
      biometric = await registerBiometricCredential({
        userId: session.id,
        accessToken,
        fetch: nyxBffFetch,
      });
    }

    let wallet: Wallet;
    let walletId = bootstrap.walletId;

    if (walletId) {
      if (!biometric) {
        await recoverDeviceShare(
          {
            apiBaseUrl: '/api/nyx',
            accessToken,
            recoveryKeyProvider: createPasskeyRecoveryKeyProvider(),
            fetch: nyxBffFetch,
            deviceStore: createDeviceStore({ userId: session.id }),
          },
          walletId,
          bootstrap.deployment,
        );
        throw new Error(
          'Passkey recovered the device share, but nyx_wallet still needs biometricCredential.publicKey (JWK P-256) to open and sign. POST /webauthn/authenticate/options only returns credentialId in allowCredentials.',
        );
      }

      const sdkConfig = await buildSdkConfig(bootstrap, session.id, biometric);
      try {
        wallet = await openWallet(sdkConfig, walletId, {
          deployment: bootstrap.deployment,
        });
      } catch {
        await recoverDeviceShare(sdkConfig, walletId, bootstrap.deployment);
        wallet = await openWallet(sdkConfig, walletId, {
          deployment: bootstrap.deployment,
        });
      }
    } else if (probe.exists) {
      throw new Error(
        'Nyx already has a passkey for this email. Recover that wallet instead of creating another passkey.',
      );
    } else {
      if (!biometric) throw new Error('Passkey registration did not return a credential');
      const sdkConfig = await buildSdkConfig(bootstrap, session.id, biometric);
      const walletName = session.email || 'Indahouse Admin Wallet';
      wallet = await createWallet(sdkConfig, {
        name: walletName,
        blockchain: 'polygon',
        network: bootstrap.network,
        deployment: bootstrap.deployment,
      });
      walletId = wallet.walletId;
      await registerV3Wallet({
        walletId: wallet.walletId,
        address: wallet.address,
        walletName,
      });
      await whitelistSafeAddress(wallet.address);
      setMemorySession({
        ...session,
        walletId: wallet.walletId,
        walletAddress: wallet.address,
      });
    }

    activeWallet = {
      wallet,
      walletId: walletId!,
      address: wallet.address,
    };
    return activeWallet;
  } catch (error) {
    if (error instanceof DOMException) {
      throw new Error(describeWebAuthnOriginError(bootstrap.biometricRpId));
    }
    throw error;
  }
}

/** Address already known from session/Safe. Does not open the SDK or prompt WebAuthn. */
export function peekSessionWalletAddress(): `0x${string}` | null {
  if (activeWallet?.address) return activeWallet.address as `0x${string}`;
  const session = getMemorySession();
  if (session?.walletAddress) return session.walletAddress as `0x${string}`;
  return null;
}

export async function getSessionWalletAddress(): Promise<`0x${string}`> {
  const known = peekSessionWalletAddress();
  if (known) return known;
  const { address } = await ensureWallet();
  return address as `0x${string}`;
}

export function closeWallet(): void {
  if (activeWallet) {
    try {
      activeWallet.wallet.close();
    } catch {
      // ignore
    }
  }
  activeWallet = null;
}

export function getActiveWallet(): ActiveNyxWallet | null {
  return activeWallet;
}

export async function getAccountNonce(accountAddress?: string): Promise<string> {
  const bootstrap = await fetchWalletBootstrap();
  const address = accountAddress || activeWallet?.address || bootstrap.address;
  if (!address) throw new Error('No wallet address available for nonce lookup');

  const provider = new ethers.JsonRpcProvider(rpcUrlForChain(bootstrap.chainId));
  const entryPoint = new ethers.Contract(
    bootstrap.deployment.entryPoint,
    ENTRY_POINT_GET_NONCE_ABI,
    provider,
  );
  const nonce: bigint = await entryPoint.getNonce(address, 0);
  return nonce.toString();
}

export async function getBootstrapConfig(): Promise<NyxWalletBootstrapConfig> {
  return fetchWalletBootstrap();
}
