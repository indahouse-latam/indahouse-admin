'use client';

import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { useOnboarding, OnboardingStatus } from "@/modules/onboarding/hooks/useOnboarding";
import {
    UserCheck,
    UserX,
    Loader2,
    AlertCircle,
    RefreshCw,
    Search
} from "lucide-react";

export default function OnboardingPage() {
    const { data: statuses, isLoading } = useOnboarding();
    const pendingCount = statuses?.filter(s => s.status === 'pending').length || 0;
    const failedCount = statuses?.filter(s => s.status === 'failed').length || 0;

    const columns = [
        {
            header: 'Usuario',
            accessor: (status: OnboardingStatus) => (
                <div className="flex flex-col">
                    <span className="font-medium text-xs">{status.userName}</span>
                    <span className="text-[10px] text-muted-foreground">{status.userEmail}</span>
                </div>
            )
        },
        {
            header: 'Paso Actual',
            accessor: (status: OnboardingStatus) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{status.currentStep}</span>
                    <span className="text-[10px] text-muted-foreground">{status.stepMessage}</span>
                </div>
            )
        },
        {
            header: 'Progreso',
            accessor: (status: OnboardingStatus) => (
                <div className="w-32 space-y-1">
                    <div className="flex justify-between text-[8px] font-bold">
                        <span>{status.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary/30 h-1 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 rounded-full ${status.status === 'failed' ? 'bg-destructive' : 'bg-primary'}`}
                            style={{ width: `${status.progress}%` }}
                        />
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (status: OnboardingStatus) => (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border w-fit ${getStatusStyles(status.status)}`}>
                    {status.status === 'completed' && <UserCheck className="w-2.5 h-2.5" />}
                    {status.status === 'failed' && <UserX className="w-2.5 h-2.5" />}
                    {status.status === 'pending' && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                    {status.status.toUpperCase()}
                </div>
            )
        },
        {
            header: 'Error / Nota',
            accessor: (status: OnboardingStatus) => (
                <span className="text-[10px] text-destructive max-w-[150px] truncate block">
                    {status.error || '-'}
                </span>
            )
        },
        {
            header: 'Acciones',
            className: 'text-right',
            accessor: (status: OnboardingStatus) => (
                <button className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-primary transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Onboarding Funnel</h2>
                        <p className="text-muted-foreground">Monitorea el progreso de nuevos usuarios en tiempo real.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-secondary/10 border border-border px-4 py-2 rounded-lg flex items-center gap-3">
                            <Stat mini label="En curso" value={pendingCount.toString()} />
                            <div className="w-px h-8 bg-border" />
                            <Stat mini label="Fallidos" value={failedCount.toString()} isAlert />
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/10 border border-border rounded-2xl p-6">
                    <DataTable
                        data={statuses || []}
                        columns={columns}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

function Stat({ label, value, mini, isAlert }: { label: string; value: string; mini?: boolean; isAlert?: boolean }) {
    return (
        <div className="text-center md:text-left">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isAlert ? 'text-destructive' : 'text-muted-foreground'}`}>{label}</p>
            <p className={`font-bold ${mini ? 'text-lg' : 'text-2xl'}`}>{value}</p>
        </div>
    );
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'pending': return 'bg-primary/10 text-primary border-primary/20';
        case 'failed': return 'bg-destructive/10 text-destructive border-destructive/20';
        default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
}
