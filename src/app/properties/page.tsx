'use client';

import { useState } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { DataTable } from "@/components/DataTable";
import { useProperties, Property } from "@/modules/properties/hooks/useProperties";
import { EditPropertyModal } from "@/modules/properties/components/EditPropertyModal";
import { MapPin } from "lucide-react";

export default function PropertiesPage() {
    const [selectedStatus, setSelectedStatus] = useState<string>('VERIFIED');
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data: properties, isLoading } = useProperties(selectedStatus);

    const columns = [
        {
            header: 'Propiedad',
            accessor: (property: Property) => (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {property.nameReference || property.name_reference || 'Sin nombre'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                        ID: {property.id.substring(0, 8)}...
                    </span>
                </div>
            )
        },
        {
            header: 'Ubicación',
            accessor: (property: Property) => {
                const shortLocation = property.location?.shortLocation || property.location?.short_location;
                const address = property.location?.address;
                const displayLocation = shortLocation || address || 'N/A';

                return (
                    <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[11px]">{displayLocation}</span>
                    </div>
                );
            }
        },
        {
            header: 'Precio / Valuación',
            accessor: (property: Property) => {
                const price = typeof property.price === 'string'
                    ? parseFloat(property.price)
                    : (property.price || 0);
                const valuation = typeof property.valuation === 'string'
                    ? parseFloat(property.valuation)
                    : (property.valuation || 0);

                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-success-600">
                            ${price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            Val: ${valuation.toLocaleString()}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Estado',
            accessor: (property: Property) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(property.status)}`}>
                    {property.status}
                </span>
            )
        }
    ];

    const handleRowClick = (property: Property) => {
        setSelectedProperty(property);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedProperty(null);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Propiedades</h2>
                        <p className="text-muted-foreground">Gestiona las propiedades registradas en el sistema.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-muted-foreground">Filtrar por estado:</label>
                        <select
                            className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="VERIFIED">VERIFIED</option>
                            <option value="CREATED">CREATED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="DENIED">DENIED</option>
                            <option value="BOUGHT">BOUGHT</option>
                            <option value="BLOCKED">BLOCKED</option>
                        </select>
                    </div>
                </div>

                <div className="bg-secondary/10 border border-border rounded-2xl p-6">
                    <DataTable
                        data={properties || []}
                        columns={columns}
                        isLoading={isLoading}
                        onRowClick={handleRowClick}
                    />
                </div>
            </div>

            {selectedProperty && (
                <EditPropertyModal
                    property={selectedProperty}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </AdminLayout>
    );
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'VERIFIED':
            return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'CREATED':
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'PENDING':
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'IN_PROGRESS':
            return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
        case 'DENIED':
            return 'bg-destructive/10 text-destructive border-destructive/20';
        case 'BOUGHT':
            return 'bg-primary/10 text-primary border-primary/20';
        case 'BLOCKED':
            return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        default:
            return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
}