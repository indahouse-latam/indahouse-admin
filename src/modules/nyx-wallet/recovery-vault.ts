'use client';

import type { RecoveryVault } from 'nyx_wallet';

const DB_NAME = 'indahouse-admin-nyx-recovery';
const STORE = 'vault';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function createAppRecoveryVault(): RecoveryVault {
  return {
    async read(walletId: string): Promise<string | null> {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).get(walletId);
        req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
        req.onerror = () => reject(req.error);
      });
    },
    async write(walletId: string, raw: string): Promise<void> {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        const req = tx.objectStore(STORE).put(raw, walletId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },
    async wipe(walletId: string): Promise<void> {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        const req = tx.objectStore(STORE).delete(walletId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },
  };
}
