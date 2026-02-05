'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Home, Layout, Plus, Trash2, Loader2, Building2, FileText, List } from 'lucide-react';
import { toast } from 'sonner';
import { LocationFields, type LocationData } from '@/components/LocationFields';
import { PropertyMultimediaSection } from '@/modules/campaigns/components/PropertyMultimediaSection';
import { FinancialDocumentsSection } from './FinancialDocumentsSection';
import { Property } from '../hooks/useProperties';
import { useProperties } from '../hooks/useProperties';

interface EditPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: Property;
}

type TabType = 'general' | 'details' | 'location' | 'multimedia' | 'financial';

export function EditPropertyModal({ isOpen, onClose, property }: EditPropertyModalProps) {
    const { updateProperty, isUpdating } = useProperties();
    const [activeTab, setActiveTab] = useState<TabType>('general');

    const [formData, setFormData] = useState({
        name_reference: '',
        description: '',
        price: '',
        valuation: '',
        property_type: '1',
        stratum: '4',
        built_time: '1',
        buyback_time: '12',
        status: 'VERIFIED' as 'VERIFIED' | 'CREATED' | 'PENDING' | 'IN_PROGRESS' | 'DENIED' | 'BOUGHT' | 'BLOCKED',
        location: {
            id: undefined as string | undefined,
            address: '',
            full_location: '',
            short_location: '',
            latitude: undefined,
            longitude: undefined
        } as LocationData & { id?: string },
        main_characteristics: [] as { id?: string; label: string; value: string; icon: string }[],
        extra_characteristics: [] as { id?: string; label: string }[],
        monthly_expenses: [] as { id?: string; label: string; amount: string }[],
    });

    useEffect(() => {
        if (property) {
            const nameRef = property.nameReference || property.name_reference || '';
            const propType = property.propertyType || property.property_type || 1;
            const builtTime = property.builtTime || property.built_time || 1;
            const buybackTime = property.buybackTime || property.buyback_time;
            const shortLoc = property.location?.shortLocation || property.location?.short_location || '';
            const fullLoc = property.location?.fullLocation || property.location?.full_location || property.location?.address || '';

            setFormData({
                name_reference: nameRef,
                description: property.description || '',
                price: typeof property.price === 'string' ? property.price : property.price?.toString() || '',
                valuation: typeof property.valuation === 'string' ? property.valuation : property.valuation?.toString() || '',
                property_type: propType.toString(),
                stratum: property.stratum?.toString() || '4',
                built_time: builtTime.toString(),
                buyback_time: buybackTime?.toString() || '12',
                status: property.status || 'VERIFIED',
                location: {
                    id: (property.location as any)?.id,
                    address: property.location?.address || '',
                    full_location: fullLoc,
                    short_location: shortLoc,
                    latitude: property.location?.latitude ? Number(property.location.latitude) : undefined,
                    longitude: property.location?.longitude ? Number(property.location.longitude) : undefined
                },
                main_characteristics: property.main_characteristics?.map(c => ({
                    id: c.id,
                    label: c.name,
                    value: c.description,
                    icon: 'star'
                })) || [],
                extra_characteristics: property.extra_characteristics?.map(c => ({
                    id: c.id,
                    label: c.name
                })) || [],
                monthly_expenses: property.monthly_expenses?.map(e => ({
                    id: e.id,
                    label: e.name,
                    amount: typeof e.price === 'string' ? e.price : e.price?.toString() || '0'
                })) || []
            });
        }
    }, [property]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            id: property.id,
            name_reference: formData.name_reference,
            description: formData.description,
            price: Number.parseFloat(formData.price),
            valuation: Number.parseFloat(formData.valuation),
            property_type: Number.parseInt(formData.property_type),
            stratum: Number.parseInt(formData.stratum),
            built_time: Number.parseInt(formData.built_time.toString()),
            buyback_time: formData.buyback_time ? Number.parseInt(formData.buyback_time.toString()) : undefined,
            status: formData.status,
            location: {
                id: formData.location.id || crypto.randomUUID(),
                address: formData.location.address,
                full_location: formData.location.full_location,
                short_location: formData.location.short_location,
                ...(formData.location.latitude && { latitude: formData.location.latitude }),
                ...(formData.location.longitude && { longitude: formData.location.longitude })
            } as any,
            main_characteristics: formData.main_characteristics
                .filter(char => char.label && char.value)
                .map(char => ({
                    id: char.id || crypto.randomUUID(),
                    name: char.label,
                    description: char.value
                })),
            extra_characteristics: formData.extra_characteristics
                .filter(char => char.label)
                .map(char => ({
                    id: char.id || crypto.randomUUID(),
                    name: char.label,
                    description: 'Yes'
                })),
            monthly_expenses: formData.monthly_expenses
                .filter(expense => expense.label && expense.amount)
                .map(expense => ({
                    id: expense.id || crypto.randomUUID(),
                    name: expense.label,
                    price: Number.parseFloat(expense.amount),
                    icon: 'dollar-sign'
                }))
        };

        console.log('📦 Payload enviado:', JSON.stringify(payload, null, 2));

        updateProperty(
            { id: property.id, data: payload },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    const addCharacteristic = () => {
        setFormData({
            ...formData,
            main_characteristics: [
                ...formData.main_characteristics,
                { id: crypto.randomUUID(), label: '', value: '', icon: 'star' }
            ]
        });
    };

    const addExtraCharacteristic = (label: string) => {
        if (!label) return;
        setFormData({
            ...formData,
            extra_characteristics: [
                ...formData.extra_characteristics,
                { id: crypto.randomUUID(), label }
            ]
        });
    };

    const addMonthlyExpense = () => {
        setFormData({
            ...formData,
            monthly_expenses: [
                ...formData.monthly_expenses,
                { id: crypto.randomUUID(), label: '', amount: '0' }
            ]
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-foreground">
            <div className="bg-background border border-border w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2.5 rounded-xl">
                            <Building2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Editar Propiedad</h3>
                            <p className="text-xs text-muted-foreground">
                                {property.nameReference || property.name_reference} - ID: {property.id.substring(0, 8)}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Detalles
                    </button>
                    <button
                        onClick={() => setActiveTab('location')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'location' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Ubicación
                    </button>
                    <button
                        onClick={() => setActiveTab('multimedia')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'multimedia' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Multimedia
                    </button>
                    <button
                        onClick={() => setActiveTab('financial')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'financial' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Documentos
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
                                    <Layout className="w-4 h-4 text-primary" />
                                    Información Básica
                                </h4>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Nombre de Referencia</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="Ej: Apartamento 402 - Living"
                                        value={formData.name_reference}
                                        onChange={(e) => setFormData({ ...formData, name_reference: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Precio (USDC)</label>
                                        <div className="relative">
                                            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="number"
                                                required
                                                className="w-full bg-secondary-100 border border-secondary-300 rounded-lg pl-10 pr-4 py-2 text-sm text-success-600 font-bold focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Valuación (USDC)</label>
                                        <div className="relative">
                                            <Home className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="number"
                                                required
                                                className="w-full bg-secondary-100 border border-secondary-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                value={formData.valuation}
                                                onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Antigüedad (Años)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            value={formData.built_time}
                                            onChange={(e) => setFormData({ ...formData, built_time: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Tiempo Recompra (Meses)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            value={formData.buyback_time}
                                            onChange={(e) => setFormData({ ...formData, buyback_time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Estado de la Propiedad</label>
                                    <select
                                        className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                                        required
                                    >
                                        <option value="CREATED">Creada</option>
                                        <option value="IN_PROGRESS">En Progreso</option>
                                        <option value="PENDING">Pendiente</option>
                                        <option value="DENIED">Denegada</option>
                                        <option value="BOUGHT">Comprada</option>
                                        <option value="VERIFIED">Verificada</option>
                                        <option value="BLOCKED">Bloqueada</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Descripción
                                </h4>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Descripción Completa</label>
                                    <textarea
                                        className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm h-40 resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="Describe la propiedad en detalle..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
                                    <Layout className="w-4 h-4 text-primary" />
                                    Características Principales
                                </h4>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Valores Numéricos</label>
                                        <button type="button" onClick={addCharacteristic} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Añadir
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                        {formData.main_characteristics.map((char, index) => (
                                            <div key={index} className="flex gap-2 group">
                                                <input
                                                    className="flex-1 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                    placeholder="Etiqueta (ej: Baños)"
                                                    value={char.label}
                                                    onChange={(e) => {
                                                        const newChars = [...formData.main_characteristics];
                                                        newChars[index].label = e.target.value;
                                                        setFormData({ ...formData, main_characteristics: newChars });
                                                    }}
                                                />
                                                <input
                                                    className="w-24 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-1.5 text-xs text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                    placeholder="Valor"
                                                    value={char.value}
                                                    onChange={(e) => {
                                                        const newChars = [...formData.main_characteristics];
                                                        newChars[index].value = e.target.value;
                                                        setFormData({ ...formData, main_characteristics: newChars });
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newChars = formData.main_characteristics.filter((_, i) => i !== index);
                                                        setFormData({ ...formData, main_characteristics: newChars });
                                                    }}
                                                    className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
                                        <DollarSign className="w-4 h-4 text-primary" />
                                        Gastos Mensuales
                                    </h4>
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Costos Recurrentes</label>
                                        <button type="button" onClick={addMonthlyExpense} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Añadir
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                        {formData.monthly_expenses.map((expense, index) => (
                                            <div key={index} className="flex gap-2 group">
                                                <input
                                                    className="flex-1 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                    placeholder="Concepto"
                                                    value={expense.label}
                                                    onChange={(e) => {
                                                        const newExpenses = [...formData.monthly_expenses];
                                                        newExpenses[index].label = e.target.value;
                                                        setFormData({ ...formData, monthly_expenses: newExpenses });
                                                    }}
                                                />
                                                <input
                                                    type="number"
                                                    className="w-32 bg-secondary-100 border border-secondary-300 rounded-lg px-3 py-1.5 text-xs text-center focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                    placeholder="Monto"
                                                    value={expense.amount}
                                                    onChange={(e) => {
                                                        const newExpenses = [...formData.monthly_expenses];
                                                        newExpenses[index].amount = e.target.value;
                                                        setFormData({ ...formData, monthly_expenses: newExpenses });
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newExpenses = formData.monthly_expenses.filter((_, i) => i !== index);
                                                        setFormData({ ...formData, monthly_expenses: newExpenses });
                                                    }}
                                                    className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-2">
                                    <List className="w-4 h-4 text-primary" />
                                    Adicionales (Chips)
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            id="new-extra"
                                            className="flex-1 bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            placeholder="Ej: Piscina, Gimnasio (Enter para agregar)"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addExtraCharacteristic(e.currentTarget.value);
                                                    e.currentTarget.value = '';
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const input = document.getElementById('new-extra') as HTMLInputElement;
                                                addExtraCharacteristic(input.value);
                                                input.value = '';
                                            }}
                                            className="px-4 bg-secondary/50 rounded-lg hover:bg-secondary"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {formData.extra_characteristics.map((char, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">
                                                {char.label}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newExt = formData.extra_characteristics.filter((_, index) => index !== i);
                                                        setFormData({ ...formData, extra_characteristics: newExt });
                                                    }}
                                                    className="hover:text-destructive"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'location' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <LocationFields
                                value={formData.location}
                                onChange={(location) => setFormData({ ...formData, location })}
                            />
                        </div>
                    )}

                    {activeTab === 'multimedia' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <PropertyMultimediaSection
                                propertyId={property.id}
                                onComplete={() => { }}
                            />
                        </div>
                    )}

                    {activeTab === 'financial' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <FinancialDocumentsSection property={property} />
                        </div>
                    )}
                </form>

                {activeTab !== 'multimedia' && (
                    <div className="p-6 border-t border-border flex justify-end gap-3 bg-secondary/5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUpdating}
                            className="px-6 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isUpdating}
                            className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
