'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { fetchApi } from '@/utils/api';

interface AuthContextType {
    user: { email: string, id: string, token: string } | null;
    login: (email: string) => Promise<void>;
    verifyGoogleToken: (token: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

export interface LocalStorageUser {
    email: string;
    id: string;
    token: string;
    walletId: string;
    walletAddress: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ email: string, id: string, token: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isValidating, setIsValidating] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const verificationAttempted = useRef(false);

    // Initial load from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing stored user", e);
                localStorage.removeItem('admin_user');
            }
        }
        setIsLoading(false);
    }, []);

    // Token verification from URL
    useEffect(() => {
        const token = searchParams.get('token') || searchParams.get('sessionToken');

        if (token && !verificationAttempted.current) {
            verificationAttempted.current = true;
            setIsValidating(true);

            const performVerification = async () => {
                try {
                    await verifyGoogleToken(token);
                    // verifyGoogleToken already calls setUser and localStorage.setItem
                    // We might want to remove the token from the URL to keep it clean
                    window.history.replaceState({}, '', pathname);
                    toast.success('Sesión iniciada correctamente');
                } catch (error: any) {
                    console.error('Verification failed:', error);
                    toast.error(error.message || 'Error al validar la sesión de Google');
                    // If we have no user, redirect to login
                    if (!user) {
                        router.push('/login');
                    }
                } finally {
                    setIsValidating(false);
                    verificationAttempted.current = false; // Reset for future params if any
                }
            };

            performVerification();
        }
    }, [searchParams, pathname, user]);

    // Route Protection
    useEffect(() => {
        // Only run protection logic after initial load and if not currently validating a token
        if (!isLoading && !isValidating && !user && pathname !== '/login') {
            // Check if there is a token in the URL before redirecting to login
            const token = searchParams.get('token') || searchParams.get('sessionToken');
            if (!token) {
                router.push('/login');
            }
        }
    }, [user, isLoading, isValidating, pathname, router, searchParams]);

    const login = async (email: string) => {
        setIsLoading(true);
        try {
            // Legacy/Dev bypass method
            const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
            const payload = btoa(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + 86400 }));
            const forgedToken = `${header}.${payload}.signature`;

            const userData = { email, token: forgedToken, id: '1' };
            setUser(userData);
            localStorage.setItem('admin_user', JSON.stringify(userData));
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyGoogleToken = async (sessionToken: string) => {
        const result = await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ sessionToken, userType: 'ADMIN' })
        });

        console.log('result', result);
        if (result.code === 'USER-200' && result.user) {
            const userData: LocalStorageUser = {
                email: result.user.email,
                id: String(result.user.id),
                token: sessionToken,
                walletId: result.wallet.external_id,
                walletAddress: result.wallet.address
            };

            setUser(userData);
            localStorage.setItem('admin_user', JSON.stringify(userData));
        } else {
            throw new Error(result.message || 'Error en la respuesta del servidor');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('admin_user');
        router.push('/login');
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
                            {isValidating ? 'Validando Credenciales' : 'Cargando'}
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
        <AuthContext.Provider value={{ user, login, verifyGoogleToken, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
