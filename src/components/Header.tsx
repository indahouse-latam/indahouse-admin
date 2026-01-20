import { Bell, Search, UserCircle } from 'lucide-react';

export function Header() {
    return (
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Buscar..."
                        className="w-full bg-secondary/50 rounded-md py-2 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                </button>

                <div className="h-8 w-[1px] bg-border mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">Super Administrador</p>
                    </div>
                    <UserCircle className="w-8 h-8 text-muted-foreground" />
                </div>
            </div>
        </header>
    );
}
