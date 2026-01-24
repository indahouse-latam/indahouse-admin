'use client';

import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { useMarkets, Property } from "@/modules/markets/hooks/useMarkets";
import {
    Building,
    MapPin,
    DollarSign,
    PieChart,
    Navigation
} from "lucide-react";

export default function MarketsPage() {
    const { data, isLoading } = useMarkets();

    const columns = [
        {
            header: 'Propiedad',
            accessor: (prop: Property) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Building className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{prop.nameReference || prop.name_reference}</span>
                </div>
            )
        },
        {
            header: 'Ubicación',
            accessor: (prop: Property) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{prop.location?.city}, {prop.location?.department}</span>
                </div>
            )
        },
        {
            header: 'Valuación',
            accessor: (prop: Property) => (
                <span className="font-mono text-primary font-bold">
                    ${prop.valuation?.toLocaleString()} USDC
                </span>
            )
        },
        {
            header: 'Tipo',
            accessor: () => (
                <span className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground font-medium lowercase">
                    Individual
                </span>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Mercados Operativos</h2>
                        <p className="text-muted-foreground">Visualiza el portafolio de propiedades y mercados activos.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MarketStat
                        title="Valor Total Portfolio"
                        value={`$${data?.totalValuation?.toLocaleString() || '0'} USDC`}
                        icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
                    />
                    <MarketStat
                        title="Propiedades Verificadas"
                        value={data?.properties?.length?.toString() || '0'}
                        icon={<Building className="w-5 h-5 text-blue-500" />}
                    />
                    <MarketStat
                        title="Ciudades Activas"
                        value="3"
                        icon={<Navigation className="w-5 h-5 text-orange-500" />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-secondary/10 border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-primary" />
                                Portafolio de Propiedades
                            </h3>
                        </div>
                        <DataTable
                            data={data?.properties || []}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="bg-secondary/10 border border-border rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="p-4 bg-primary/20 rounded-full animate-pulse">
                            <MapPin className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold">Visualización Geográfica</h4>
                            <p className="text-sm text-muted-foreground mt-1 px-4">
                                El mapa interactivo de mercados estará disponible próximamente con integración a Mapbox.
                            </p>
                        </div>
                        <button className="text-primary text-sm font-bold hover:underline cursor-not-allowed opacity-50">
                            Ver Mapa Pantalla Completa
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function MarketStat({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-secondary/20 border border-border rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-background rounded-lg border border-border shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{title}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
}
