'use client';

import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import {
    FileText,
    User,
    Shield,
    Calendar,
    Info
} from "lucide-react";

const mockLogs = [
    {
        id: 'l1',
        admin: 'admin@indahouse.com',
        action: 'TERMINAR_CAMPANA',
        target: 'Campaña PA-01 (Palo Alto Loft)',
        status: 'success',
        date: '2024-03-20 14:30:22',
    },
    {
        id: 'l2',
        admin: 'admin@indahouse.com',
        action: 'ENVIAR_TOKENS',
        target: '500 USDC -> 0xabc...def',
        status: 'success',
        date: '2024-03-20 12:15:05',
    }
];

export default function LogsPage() {
    const columns = [
        {
            header: 'Fecha / Hora',
            accessor: (log: any) => (
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <Calendar className="w-3 h-3" />
                    {log.date}
                </div>
            )
        },
        {
            header: 'Administrador',
            accessor: (log: any) => (
                <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary/70" />
                    <span className="text-xs font-medium">{log.admin}</span>
                </div>
            )
        },
        {
            header: 'Acción',
            accessor: (log: any) => (
                <span className="text-[10px] font-bold bg-secondary px-2 py-0.5 rounded border border-border">
                    {log.action}
                </span>
            )
        },
        {
            header: 'Objetivo / Detalle',
            accessor: (log: any) => (
                <span className="text-xs text-muted-foreground">{log.target}</span>
            )
        },
        {
            header: 'Resultado',
            accessor: (log: any) => (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 w-fit">
                    <Shield className="w-2.5 h-2.5" />
                    COMPLETADO
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Logs de Auditoría</h2>
                        <p className="text-muted-foreground">Registro inmutable de acciones realizadas por administradores.</p>
                    </div>
                </div>

                <div className="bg-secondary/10 border border-border rounded-2xl p-6">
                    <DataTable
                        data={mockLogs}
                        columns={columns}
                    />
                </div>

                <div className="p-4 bg-secondary/5 border border-border rounded-xl flex items-center gap-3">
                    <Info className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">
                        Este registro es para propósitos de auditoría interna y no sustituye los logs de eventos en la blockchain para transacciones Web3.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
