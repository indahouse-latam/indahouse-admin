'use client';

import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { useUsers, User } from "@/modules/users/hooks/useUsers";
import {
    CheckCircle2,
    XCircle,
    Clock,
    UserPlus,
    Mail,
    Phone
} from "lucide-react";

export default function UsersPage() {
    const useUsersResult = useUsers();
    const { data: users, isLoading, toggleAuthorization, isToggling } = useUsersResult;

    const columns = [
        {
            header: 'Usuario',
            accessor: (user: User) => (
                <div className="flex flex-col">
                    <span className="font-medium">{user.name} {user.lastname}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            )
        },
        {
            header: 'Contacto',
            accessor: (user: User) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span>{user.email}</span>
                    </div>
                    {user.phone && (
                        <div className="flex items-center gap-1.5 text-xs">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span>{user.phone}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Onboarding',
            accessor: (user: User) => (
                <StatusBadge
                    status={user.onboarding_finished ? 'completed' : 'pending'}
                    label={user.onboarding_finished ? 'Finalizado' : 'Pendiente'}
                />
            )
        },
        {
            header: 'KYC / KillB',
            accessor: (user: User) => (
                <StatusBadge
                    status={user.is_kyc_verified ? 'completed' : 'pending'}
                    label={user.is_kyc_verified ? 'Verificado' : 'En espera'}
                />
            )
        },
        {
            header: 'Autorización',
            accessor: (user: User) => (
                <StatusBadge
                    status={user.user_authorized ? 'completed' : 'blocked'}
                    label={user.user_authorized ? 'Autorizado' : 'Bloqueado'}
                />
            )
        },
        {
            header: 'Acciones',
            accessor: (user: User) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (user.id) {
                            toggleAuthorization({ id: user.id, authorized: !user.user_authorized });
                        }
                    }}
                    disabled={isToggling}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${user.user_authorized
                            ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                >
                    {user.user_authorized ? 'Desautorizar' : 'Autorizar'}
                </button>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
                        <p className="text-muted-foreground">Monitorea el estado de registro y verificación de los usuarios.</p>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        Exportar Usuarios
                    </button>
                </div>

                <div className="bg-secondary/10 border border-border rounded-2xl p-6">
                    <DataTable
                        data={users || []}
                        columns={columns}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

function StatusBadge({ status, label }: { status: 'completed' | 'pending' | 'blocked'; label: string }) {
    const styles = {
        completed: 'bg-primary/10 text-primary border-primary/20',
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        blocked: 'bg-destructive/10 text-destructive border-destructive/20',
    };

    const icons = {
        completed: <CheckCircle2 className="w-3 h-3" />,
        pending: <Clock className="w-3 h-3" />,
        blocked: <XCircle className="w-3 h-3" />,
    };

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border w-fit ${styles[status]}`}>
            {icons[status]}
            {label}
        </div>
    );
}
