"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import {
    LayoutDashboard,
    Users,
    Building2,
    History,
    Settings,
    LogOut,
    Landmark,
    ShieldCheck,
    UserPlus,
    Globe,
    Send,
    FileText,
    Shield
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
    { name: 'Usuarios', icon: <Users className="w-5 h-5" />, path: '/users' },
    { name: 'Onboarding', icon: <UserPlus className="w-5 h-5" />, path: '/onboarding' },
    { name: 'Activos & Campañas', icon: <Building2 className="w-5 h-5" />, path: '/assets' },
    { name: 'Propiedades', icon: <Building2 className="w-5 h-5" />, path: '/properties' },
    { name: 'Mercados', icon: <Globe className="w-5 h-5" />, path: '/markets' },
    { name: 'Autorizaciones', icon: <ShieldCheck className="w-5 h-5" />, path: '/authorizations' },
    { name: 'Roles', icon: <Shield className="w-5 h-5" />, path: '/roles' },
    { name: 'Enviar Tokens', icon: <Send className="w-5 h-5" />, path: '/send-tokens' },
    { name: 'Historial', icon: <History className="w-5 h-5" />, path: '/history' },
    { name: 'Logs', icon: <FileText className="w-5 h-5" />, path: '/history/logs' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    return (
        <aside className="w-64 bg-secondary/50 border-r border-border h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    Indahouse <span className="text-foreground text-xs font-normal opacity-50">Admin</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                }`}
                        >
                            <span className={`${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-destructive/10 hover:text-destructive w-full text-muted-foreground"
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
