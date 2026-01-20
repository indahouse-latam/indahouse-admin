'use client';

import { AdminLayout } from "@/components/AdminLayout";
import {
    Send,
    Wallet,
    Coins,
    ShieldAlert,
    ArrowRight,
    User
} from "lucide-react";
import { useState } from "react";

export default function SendTokensPage() {
    const [asset, setAsset] = useState<'USDC' | 'INDH'>('USDC');

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Enviar Tokens (Tesorería)</h2>
                    <p className="text-muted-foreground">Herramienta administrativa para transferencia de fondos y participaciones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-secondary/10 border border-border rounded-2xl p-8 space-y-8">
                            {/* Asset Selector */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Seleccionar Activo</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <AssetButton
                                        active={asset === 'USDC'}
                                        onClick={() => setAsset('USDC')}
                                        label="USDC (Stable)"
                                        icon={<div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                    />
                                    <AssetButton
                                        active={asset === 'INDH'}
                                        onClick={() => setAsset('INDH')}
                                        label="INDH (Portfolio)"
                                        icon={<div className="w-2 h-2 bg-primary rounded-full" />}
                                    />
                                </div>
                            </div>

                            {/* Recipient */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Destinatario</label>
                                <div className="relative">
                                    <Wallet className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Dirección 0x... o Email del usuario"
                                        className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Cantidad</label>
                                <div className="relative">
                                    <Coins className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-16 py-4 text-2xl font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">{asset}</span>
                                </div>
                            </div>

                            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
                                <Send className="w-5 h-5" />
                                PROCEDER AL ENVÍO
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-secondary/10 border border-border rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                                <ShieldAlert className="w-4 h-4 text-primary" />
                                Control de Auditoría
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Todos los envíos desde este módulo administrativo son grabados en el log de auditoría interna de Indahouse. Por favor, asegúrate de tener una razón válida (Devolución, Bonus, Corrección) para este movimiento.
                            </p>
                        </div>

                        <div className="bg-secondary/10 border border-border rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider">Balance Tesorería (Base)</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                                    <span className="text-xs font-medium">USDC</span>
                                    <span className="text-sm font-bold">12,450.00</span>
                                </div>
                                <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                                    <span className="text-xs font-medium">INDH</span>
                                    <span className="text-sm font-bold">1,000,000.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function AssetButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${active ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50'}`}
        >
            {icon}
            <span className="text-sm font-bold">{label}</span>
        </button>
    );
}
