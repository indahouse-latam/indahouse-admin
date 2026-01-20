'use client';

import { useState, Suspense, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { ShieldCheck, Mail, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, verifyGoogleToken } = useAuth();
    const searchParams = useSearchParams();

    // Handle Google Callback
    useEffect(() => {
        const token = searchParams.get('token') || searchParams.get('sessionToken');
        if (token) {
            const handleToken = async () => {
                setIsGoogleLoading(true);
                try {
                    await verifyGoogleToken(token);
                } catch (err: any) {
                    setError(err.message || 'Error en autenticación con Google.');
                    setIsGoogleLoading(false);
                }
            };
            handleToken();
        }
    }, [searchParams, verifyGoogleToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (!email || !email.includes('@')) {
                throw new Error('Por favor, ingresa un correo electrónico válido.');
            }
            await login(email);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        const walletUrl = process.env.NEXT_PUBLIC_WALLET_URL;
        const apiKey = process.env.NEXT_PUBLIC_WALLET_API_KEY;
        const googleAuthUrl = `${walletUrl}/api/auth/google?apiKey=${apiKey}&source=indahouse-admin`;
        window.location.href = googleAuthUrl;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-[#0a0a0a] to-[#0a0a0a]">
            <div className="w-full max-w-md p-8 bg-zinc-900/50 border border-border backdrop-blur-xl rounded-2xl shadow-2xl space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="p-3 bg-primary/20 rounded-xl">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Acceso Administrativo</h1>
                    <p className="text-muted-foreground text-sm">
                        Ingresa tu correo autorizado para continuar.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Google Login Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || isSubmitting}
                        className="w-full bg-white text-black hover:bg-gray-100 font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        {isGoogleLoading ? 'Autenticando...' : 'Iniciar con Google'}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#121212] px-2 text-muted-foreground">O usar correo (Legacy)</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-400">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@indahouse.com.co"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-lg py-2.5 pl-11 pr-4 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-primary/20"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Continuar
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        Solo personal autorizado. Todas las acciones son registradas.
                    </p>
                </div>
            </div>
        </div>
    );
}
