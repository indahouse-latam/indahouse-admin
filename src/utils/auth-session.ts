const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export type MemorySession = {
  id: string;
  email: string;
  walletId?: string;
  walletAddress?: string;
  /** JWT de Nyx solo en memoria (post-login); las peticiones API usan cookie HttpOnly cuando aplica */
  nyxToken?: string;
};

const SESSION_KEY = "indahouse_session";

let memorySession: MemorySession | null = null;

function isBrowser() {
  return globalThis.window !== undefined;
}

export function setMemorySession(session: MemorySession | null) {
  if (!isBrowser()) {
    memorySession = session;
    return;
  }
  if (session === null) {
    memorySession = null;
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  const prev = sessionStorage.getItem(SESSION_KEY);
  const prevData: Partial<MemorySession> = prev ? JSON.parse(prev) : {};
  const merged = { ...prevData, ...session, nyxToken: session.nyxToken ?? prevData.nyxToken };
  memorySession = merged as MemorySession;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(merged));
}

export function getMemorySession(): MemorySession | null {
  if (memorySession) return memorySession;
  if (!isBrowser()) return null;
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    memorySession = JSON.parse(stored) as MemorySession;
    return memorySession;
  } catch {
    return null;
  }
}

function apiUrl(path: string) {
  const base = API_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function fetchAuthMe(): Promise<{ ok: true; data: AuthMeResponse } | { ok: false }> {
  if (!API_URL) return { ok: false };

  const mem = getMemorySession();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (mem?.nyxToken) headers.Authorization = `Bearer ${mem.nyxToken}`;
  if (mem?.id) headers.UserId = mem.id;

  const res = await fetch(apiUrl("/auth/me"), {
    method: "GET",
    credentials: "include",
    headers,
  });
  if (!res.ok) return { ok: false };
  const data = (await res.json()) as AuthMeResponse;
  return { ok: true, data };
}

export type AuthMeResponse = {
  code?: string;
  user: {
    id: string | number;
    email: string;
    [key: string]: unknown;
  };
  wallet?: {
    external_id?: string;
    address?: string;
    [key: string]: unknown;
  } | null;
};

export function meResponseToMemory(data: AuthMeResponse, nyxToken?: string): MemorySession {
  const w = data.wallet;
  return {
    id: String(data.user.id),
    email: data.user.email,
    walletId: w?.external_id,
    walletAddress: w?.address,
    nyxToken,
  };
}

export async function fetchWalletToken(): Promise<string | null> {
  const mem = getMemorySession();
  if (mem?.nyxToken) return mem.nyxToken;

  if (!API_URL) return null;

  const res = await fetch(apiUrl("/auth/wallet-token"), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { token?: string };
  return typeof data.token === "string" ? data.token : null;
}

export async function logoutSessionApi(): Promise<void> {
  if (!API_URL) return;
  try {
    await fetch(apiUrl("/auth/logout"), {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  } catch {
    /* ignore */
  }
}

/**
 * Credenciales para Nyx (proxy de clave privada).
 * Prioriza la sesión en memoria (post-login); si no hay nyxToken cae al endpoint /auth/wallet-token.
 */
export async function fetchWalletCredentials(): Promise<{ walletId: string; token: string }> {
  const mem = getMemorySession();

  if (mem?.nyxToken && mem?.walletId) {
    return { walletId: mem.walletId, token: mem.nyxToken };
  }

  const token = await fetchWalletToken();
  if (!token) {
    throw new Error("No hay token de wallet (sesión inválida o expirada). Vuelve a iniciar sesión.");
  }

  let walletId = mem?.walletId;
  if (!walletId) {
    const me = await fetchAuthMe();
    if (!me.ok) {
      throw new Error("No autenticado");
    }
    walletId = me.data.wallet?.external_id;
    if (me.data.user) {
      setMemorySession(meResponseToMemory(me.data, token));
    }
  }
  if (!walletId) {
    throw new Error("No hay wallet asociada a la cuenta.");
  }

  return { walletId, token };
}
