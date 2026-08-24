'use client';

import { getUserOperationReceipt } from 'nyx_wallet';
import type { Hash, TransactionReceipt } from 'viem';
import { describeWebAuthnOriginError } from './biometric-credential';
import { ensureWallet, getAccountNonce, getBootstrapConfig } from './session';

export interface WalletCallTransaction {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: bigint | string;
}

function extractTransactionHash(receipt: Record<string, unknown>): string | null {
  const inner =
    receipt.receipt && typeof receipt.receipt === 'object'
      ? (receipt.receipt as Record<string, unknown>)
      : receipt;
  const candidates = [inner.transactionHash, inner.txHash, receipt.transactionHash, receipt.txHash];
  for (const value of candidates) {
    if (typeof value === 'string' && value.startsWith('0x')) return value;
  }
  return null;
}

function asTransactionReceipt(
  userOpReceipt: Record<string, unknown>,
  fallbackHash: string,
): TransactionReceipt {
  const inner =
    userOpReceipt.receipt && typeof userOpReceipt.receipt === 'object'
      ? (userOpReceipt.receipt as Record<string, unknown>)
      : userOpReceipt;
  const hash = extractTransactionHash(userOpReceipt) || fallbackHash;
  const statusRaw = inner.status;
  const reverted = statusRaw === '0x0' || statusRaw === 0 || statusRaw === 'reverted';

  return {
    ...inner,
    transactionHash: hash,
    status: reverted ? 'reverted' : 'success',
    logs: Array.isArray(inner.logs) ? inner.logs : [],
  } as TransactionReceipt;
}

export async function waitForUserOperation(
  userOpHash: string,
  options?: { timeoutMs?: number; intervalMs?: number },
): Promise<Record<string, unknown>> {
  const timeoutMs = options?.timeoutMs ?? 120_000;
  const intervalMs = options?.intervalMs ?? 2_000;
  const bootstrap = await getBootstrapConfig();
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const receipt = await getUserOperationReceipt({
      apiBaseUrl: '/api/nyx',
      accessToken: bootstrap.accessToken,
      userOpHash,
      fetch: (input, init) =>
        globalThis.fetch(input, { ...init, credentials: 'include' }),
    });
    if (receipt) return receipt;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error('Timed out waiting for user operation receipt');
}

export async function submitEncodedCall(
  transaction: WalletCallTransaction,
): Promise<{ hash: Hash; receipt: TransactionReceipt }> {
  const { wallet } = await ensureWallet();
  const nonce = await getAccountNonce(wallet.address);

  let result: { userOpHash: string };
  try {
    result = await wallet.sendFunds({
      to: transaction.to,
      data: transaction.data || '0x',
      value: transaction.value != null ? String(transaction.value) : '0',
      nonce,
    });
  } catch (error) {
    if (error instanceof DOMException) {
      const bootstrap = await getBootstrapConfig();
      throw new Error(describeWebAuthnOriginError(bootstrap.biometricRpId));
    }
    throw error;
  }

  const userOpReceipt = await waitForUserOperation(result.userOpHash);
  const receipt = asTransactionReceipt(userOpReceipt, result.userOpHash);
  if (receipt.status === 'reverted') {
    throw new Error('Transaction reverted');
  }

  return {
    hash: receipt.transactionHash as Hash,
    receipt,
  };
}

export async function submitWalletCall(
  _walletId: string,
  _chainId: number,
  transaction: WalletCallTransaction,
): Promise<string> {
  const { hash } = await submitEncodedCall(transaction);
  return hash;
}
