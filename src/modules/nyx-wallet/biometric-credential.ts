'use client';

import type { BiometricCredential } from 'nyx_wallet';

const DB_NAME = 'indahouse-admin-nyx-biometric';
const STORE = 'credentials';
const NYX_REGISTER_OPTIONS_PATH = '/api/nyx/webauthn/register/options';
const NYX_REGISTER_VERIFY_PATH = '/api/nyx/webauthn/register/verify';

interface StoredBiometricCredential extends BiometricCredential {
  nyxRegistered?: boolean;
}

interface NyxRegistrationOptions {
  rp: { id?: string; name: string };
  user: { id: string; name: string; displayName: string };
  challenge: string;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  excludeCredentials?: Array<{
    id: string;
    type: PublicKeyCredentialType;
    transports?: AuthenticatorTransport[];
  }>;
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  attestation?: AttestationConveyancePreference;
}

type NyxFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

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

export async function loadBiometricCredential(
  userId: string,
): Promise<StoredBiometricCredential | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(userId);
    req.onsuccess = () =>
      resolve((req.result as StoredBiometricCredential | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveBiometricCredential(
  userId: string,
  credential: StoredBiometricCredential,
): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).put(credential, userId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBuffer(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function toByteArray(value: ArrayBuffer): number[] {
  return Array.from(new Uint8Array(value));
}

function toPublicKeyCreationOptions(
  options: NyxRegistrationOptions,
): PublicKeyCredentialCreationOptions {
  return {
    rp: options.rp,
    user: {
      id: base64UrlToBuffer(options.user.id),
      name: options.user.name,
      displayName: options.user.displayName,
    },
    challenge: base64UrlToBuffer(options.challenge),
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    attestation: options.attestation,
    authenticatorSelection: options.authenticatorSelection,
    excludeCredentials: options.excludeCredentials?.map((credential) => ({
      id: base64UrlToBuffer(credential.id),
      type: credential.type,
      transports: credential.transports,
    })),
  };
}

async function extractPublicKey(
  attestation: AuthenticatorAttestationResponse,
): Promise<BiometricCredential['publicKey']> {
  if (typeof attestation.getPublicKey !== 'function') {
    throw new Error('Browser does not expose attestation public key');
  }

  const spki = attestation.getPublicKey();
  if (!spki) throw new Error('Missing attestation public key');

  const cryptoKey = await crypto.subtle.importKey(
    'spki',
    spki,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify'],
  );
  return (await crypto.subtle.exportKey('jwk', cryptoKey)) as BiometricCredential['publicKey'];
}

async function nyxJson<T>(
  fetchImpl: NyxFetch,
  path: string,
  accessToken: string,
  body?: unknown,
): Promise<T> {
  const response = await fetchImpl(path, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Nyx ${path} responded ${response.status}${text ? `: ${text}` : ''}`);
  }

  return text ? (JSON.parse(text) as T) : ({} as T);
}

export async function registerBiometricCredential(params: {
  userId: string;
  accessToken: string;
  fetch: NyxFetch;
}): Promise<StoredBiometricCredential> {
  const options = await nyxJson<NyxRegistrationOptions>(
    params.fetch,
    NYX_REGISTER_OPTIONS_PATH,
    params.accessToken,
  );

  let credential: PublicKeyCredential | null;
  try {
    credential = (await navigator.credentials.create({
      publicKey: toPublicKeyCreationOptions(options),
    })) as PublicKeyCredential | null;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'InvalidStateError') {
      throw new Error(
        'This device already has a passkey registered with Nyx, but it is missing locally. Clear site data for this origin and register again.',
      );
    }
    throw error;
  }

  if (!credential) throw new Error('WebAuthn registration was cancelled');

  const attestation = credential.response as AuthenticatorAttestationResponse;
  const transports =
    typeof attestation.getTransports === 'function' ? attestation.getTransports() : [];

  const verified = await nyxJson<{ verified: boolean }>(
    params.fetch,
    NYX_REGISTER_VERIFY_PATH,
    params.accessToken,
    {
      credential: {
        id: credential.id,
        rawId: toByteArray(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: toByteArray(attestation.clientDataJSON),
          attestationObject: toByteArray(attestation.attestationObject),
          transports,
        },
        clientExtensionResults: credential.getClientExtensionResults?.() ?? {},
      },
    },
  );

  if (!verified.verified) {
    throw new Error('Nyx rejected WebAuthn registration');
  }

  const biometricCredential: StoredBiometricCredential = {
    credentialId: credential.id || bufferToBase64Url(credential.rawId),
    publicKey: await extractPublicKey(attestation),
    nyxRegistered: true,
  };

  await saveBiometricCredential(params.userId, biometricCredential);
  return biometricCredential;
}

export async function getOrRegisterBiometricCredential(params: {
  userId: string;
  accessToken: string;
  fetch: NyxFetch;
  remoteCredential?: BiometricCredential | null;
}): Promise<BiometricCredential> {
  if (params.remoteCredential?.credentialId && params.remoteCredential.publicKey) {
    const stored: StoredBiometricCredential = {
      ...params.remoteCredential,
      nyxRegistered: true,
    };
    await saveBiometricCredential(params.userId, stored);
    return stored;
  }

  const local = await loadBiometricCredential(params.userId);
  if (local?.nyxRegistered && local.credentialId && local.publicKey) return local;

  return registerBiometricCredential({
    userId: params.userId,
    accessToken: params.accessToken,
    fetch: params.fetch,
  });
}
