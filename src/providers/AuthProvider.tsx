"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/utils/api";
import {
  fetchAuthMe,
  logoutSessionApi,
  meResponseToMemory,
  setMemorySession,
} from "@/utils/auth-session";

export type AdminUser = {
  email: string;
  id: string;
  walletId?: string;
  walletAddress?: string;
};

/** @deprecated Usar AdminUser; el token ya no se persiste en cliente */
export type LocalStorageUser = AdminUser & { token?: string };

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string) => Promise<void>;
  verifyGoogleToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LEGACY_STORAGE_KEY = "admin_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const verificationAttempted = useRef(false);

  const applySessionFromMe = useCallback(() => {
    return fetchAuthMe().then((res) => {
      if (!res.ok) {
        setUser(null);
        setMemorySession(null);
        return false;
      }
      const mem = meResponseToMemory(res.data);
      setMemorySession(mem);
      setUser({
        email: mem.email,
        id: mem.id,
        walletId: mem.walletId,
        walletAddress: mem.walletAddress,
      });
      return true;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (typeof window !== "undefined" && localStorage.getItem(LEGACY_STORAGE_KEY)) {
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
        await applySessionFromMe();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applySessionFromMe]);

  const verifyGoogleToken = useCallback(
    async (sessionToken: string) => {
      const result = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ sessionToken, userType: "ADMIN" }),
      });

      if (result.code === "USER-200" && result.user) {
        const mem = meResponseToMemory(
          {
            user: result.user,
            wallet: result.wallet ?? null,
          },
          sessionToken,
        );
        setMemorySession(mem);
        setUser({
          email: mem.email,
          id: mem.id,
          walletId: mem.walletId,
          walletAddress: mem.walletAddress,
        });
      } else {
        throw new Error(result.message || "Error en la respuesta del servidor");
      }
    },
    [],
  );

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("sessionToken");

    if (token && !verificationAttempted.current) {
      verificationAttempted.current = true;
      setIsValidating(true);

      const performVerification = async () => {
        try {
          await verifyGoogleToken(token);
          window.history.replaceState({}, "", pathname);
          toast.success("Sesión iniciada correctamente");
          router.replace("/");
        } catch (error: unknown) {
          console.error("Verification failed:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Error al validar la sesión de Google",
          );
          router.push("/login");
        } finally {
          setIsValidating(false);
          verificationAttempted.current = false;
        }
      };

      performVerification();
    }
  }, [searchParams, pathname, router, verifyGoogleToken]);

  useEffect(() => {
    if (!isLoading && !isValidating && !user && pathname !== "/login") {
      const token = searchParams.get("token") || searchParams.get("sessionToken");
      if (!token) {
        router.push("/login");
      }
    }
  }, [user, isLoading, isValidating, pathname, router, searchParams]);

  useEffect(() => {
    if (!isLoading && !isValidating && user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, isLoading, isValidating, pathname, router]);

  const login = async (_email: string) => {
    throw new Error(
      "El acceso por correo sin Google está deshabilitado. Usa «Iniciar con Google» para obtener sesión segura en el servidor.",
    );
  };

  const logout = async () => {
    await logoutSessionApi();
    setMemorySession(null);
    setUser(null);
    router.push("/login");
  };

  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse mx-auto"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isValidating ? "Validando Credenciales" : "Cargando"}
            </h2>
            <p className="text-zinc-500 text-sm animate-pulse">
              Por favor espera un momento...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, login, verifyGoogleToken, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
