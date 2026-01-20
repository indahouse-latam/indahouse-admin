'use client';

import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import {
    ShieldCheck,
    Key,
    Building2,
    User,
    Clock,
    ArrowRight
} from "lucide-react";

const mockAuthorizations = [
    {
        id: 'a1',
        property: 'Palo Alto Loft',
        from: 'Juan Perez',
        to: 'Maria Garcia',
        amount: '500 INDH',
        status: 'pending',
        date: '2024-03-20'
    }
];

export default function AuthorizationsPage() {
    const columns = [
        {
            header: 'Propiedad',
            accessor: (auth: any) => (
                <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium text-xs">{auth.property}</span>
                </div>
            )
        },
        {
            header: 'Intervinientes',
            accessor: (auth: any) => (
                <div className="flex items-center gap-2 text-[10px]">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground uppercase font-bold tracking-tighter">De:</span>
                        <span>{auth.from}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="text-muted-foreground uppercase font-bold tracking-tighter">A:</span>
                        <span>{auth.to}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Monto / Cantidad',
            accessor: (auth: any) => (
                <span className="font-mono text-xs font-bold">{auth.amount}</span>
            )
        },
        {
            header: 'Estado',
            accessor: (auth: any) => (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border bg-yellow-500/10 text-yellow-500 border-yellow-500/20 w-fit">
                    <Clock className="w-2.5 h-2.5" />
                    PENDIENTE
                </div>
            )
        },
        {
            header: 'Acciones',
            className: 'text-right',
            accessor: (auth: any) => (
                <div className="flex justify-end gap-2">
                    <button className="bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground px-3 py-1 rounded text-[10px] font-bold transition-all border border-primary/30">
                        AUTORIZAR
                    </button>
                    <button className="bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground px-3 py-1 rounded text-[10px] font-bold transition-all border border-destructive/30">
                        RECHAZAR
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Autorizaciones</h2>
                        <p className="text-muted-foreground">Gestiona las transferencias de títulos y participaciones que requieren firma del administrador.</p>
                    </div>
                </div>

                <div className="bg-secondary/10 border border-border rounded-2xl p-6">
                    <DataTable
                        data={mockAuthorizations}
                        columns={columns}
                    />
                </div>

                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold flex items-center gap-2">
                            Seguridad Multisig vinculada
                            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">WEB3</span>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                            Estas acciones interactúan directamente con los contratos Smart de Indahouse. La autorización final requerirá la firma de tu wallet conectada mediante el protocolo de transferencia garantizada.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
