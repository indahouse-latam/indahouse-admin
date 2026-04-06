const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export type MemorySession = {
  id: string;
  email: string;
  walletId?: string;
  walletAddress?: string;
  /** JWT de Nyx solo en memoria (post-login); las peticiones API usan cookie HttpOnly cuando aplica */
  nyxToken?: string;
};

let memorySession: MemorySession | null = null;

export function setMemorySession(session: MemorySession | null) {
  memorySession = session;
}

export function getMemorySession(): MemorySession | null {
  return memorySession;
}

function apiUrl(path: string) {
  const base = API_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function fetchAuthMe(): Promise<{ ok: true; data: AuthMeResponse } | { ok: false }> {
  if (!API_URL) return { ok: false };
  const res = await fetch(apiUrl("/auth/me"), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
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
 * Credenciales para Nyx (proxy de clave privada). Requiere cookie de sesión válida.
 */
export async function fetchWalletCredentials(): Promise<{ walletId: string; token: string }> {
  const token = await fetchWalletToken();
  if (!token) {
    throw new Error("No hay token de wallet (sesión inválida o expirada). Vuelve a iniciar sesión.");
  }

  let walletId = getMemorySession()?.walletId;
  if (!walletId) {
    const me = await fetchAuthMe();
    if (!me.ok) {
      throw new Error("No autenticado");
    }
    walletId = me.data.wallet?.external_id;
  }
  if (!walletId) {
    throw new Error("No hay wallet asociada a la cuenta.");
  }

  return { walletId, token };
}
