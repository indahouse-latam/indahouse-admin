'use client';

import { useState } from 'react';
import { X, DollarSign, Home, Layout, Plus, Trash2, Loader2, Building2, Image as ImageIcon, FileText, List } from 'lucide-react';
import { useUsers } from '@/modules/users/hooks/useUsers';
import { fetchApi } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { DragDropUpload } from '@/components/DragDropUpload';
import { BucketService } from '@/services/BucketService';
import { toast } from 'sonner';
import { LocationFields, type LocationData } from '@/components/LocationFields';

interface RegisterPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'general' | 'details' | 'multimedia' | 'location';

export function RegisterPropertyModal({ isOpen, onClose }: RegisterPropertyModalProps) {
    const { data: usersResponse } = useUsers();
    const users = usersResponse || [];
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('general');

    const [formData, setFormData] = useState({
        user_id: '',
        name_reference: '',
        description: '',
        price: '',
        valuation: '',
        property_type: '1',
        stratum: '4',
        built_time: '1',
        buyback_time: '12',
        location: {
            address: '',
            full_location: '',
            short_location: '',
            latitude: undefined,
            longitude: undefined
        } as LocationData,
        main_characteristics: [
            { label: 'Habitaciones', value: '2', icon: 'bed' },
            { label: 'Baños', value: '2', icon: 'bath' },
            { label: 'Area (m2)', value: '65', icon: 'maximize' },
            { label: 'Parqueaderos', value: '1', icon: 'car' }
        ],
        extra_characteristics: [] as { label: string }[],
        monthly_expenses: [
            { label: 'Administración', amount: '250000' }
        ],
        payment_plan: {
            booking_amount: '5000000',
            installments: '12'
        },
        files: {
            images: [] as File[],
            documents: [] as File[]
        }
    });

    if (!isOpen) return null;

    const handleImageDrop = (files: File[]) => {
        setFormData(prev => ({
            ...prev,
            files: {
                ...prev.files,
                images: [...prev.files.images, ...files]
            }
        }));
    };

    const removeFile = (type: 'images' | 'documents', index: number) => {
        setFormData(prev => ({
            ...prev,
            files: {
                ...prev.files,
                [type]: prev.files[type].filter((_, i) => i !== index)
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.user_id) {
            toast.error("Selecciona un propietario");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload Images/Docs first if any
            let uploadedImages: string[] = [];

            if (formData.files.images.length > 0) {
                const bucketService = new BucketService(formData.user_id);
                // Retrieve token from admin_user object in localStorage
                const storedUser = localStorage.getItem('admin_user');
                const user = storedUser ? JSON.parse(storedUser) : null;
                const token = user?.token || '';
                uploadedImages = await bucketService.uploadImages(formData.files.images, token);
            }

            const formattedFiles = uploadedImages.map(url => ({
                resource_link: url,
                resource_type: 1 // Image
            }));

            // 2. Create Property
            const payload = {
                user_id: formData.user_id,
                name_reference: formData.name_reference,
                description: formData.description,
                price: Number.parseFloat(formData.price),
                valuation: Number.parseFloat(formData.valuation),
                property_type: Number.parseInt(formData.property_type),
                stratum: Number.parseInt(formData.stratum),
                built_time: Number.parseInt(formData.built_time.toString()),
                status: 'VERIFIED',
                location: {
                    address: formData.location.address,
                    full_location: formData.location.full_location,
                    short_location: formData.location.short_location,
                    ...(formData.location.latitude && { latitude: formData.location.latitude }),
                    ...(formData.location.longitude && { longitude: formData.location.longitude })
                },
                main_characteristics: formData.main_characteristics.map(char => ({
                    name: char.label,
                    description: char.value
                })),
                extra_characteristics: formData.extra_characteristics.map(char => ({
                    name: char.label,
                    description: 'Yes'
                })),
                monthly_expenses: formData.monthly_expenses.map(expense => ({
                    name: expense.label,
                    price: Number.parseFloat(expense.amount),
                    icon: 'dollar-sign'
                })),
                files: formattedFiles
            };

            console.log('📦 Payload to be sent:', payload);
            console.log('📸 Uploaded images:', uploadedImages);

            await fetchApi('/properties', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            queryClient.invalidateQueries({ queryKey: ['markets'] });
            toast.success("Propiedad registrada exitosamente");
            onClose();
        } catch (error) {
            console.error('❌ Failed to register property:', {
                error,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                errorStack: error instanceof Error ? error.stack : undefined,
                formData: {
                    user_id: formData.user_id,
                    name_reference: formData.name_reference,
                    price: formData.price,
                    valuation: formData.valuation,
                    property_type: formData.property_type,
                    stratum: formData.stratum,
                    built_time: formData.built_time,
                    location: formData.location,
                    main_characteristics: formData.main_characteristics,
                    extra_characteristics: formData.extra_characteristics,
                    monthly_expenses: formData.monthly_expenses,
                    images_count: formData.files.images.length
                }
            });
            
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(`Error al registrar la propiedad: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addCharacteristic = () => {
        setFormData({
            ...formData,
            main_characteristics: [...formData.main_characteristics, { label: '', value: '', icon: 'star' }]
        });
    };

    const addExtraCharacteristic = (label: string) => {
        if (!label) return;
        setFormData({
            ...formData,
            extra_characteristics: [...formData.extra_characteristics, { label }]
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
                            <h3 className="text-xl font-bold">Registrar Nuevo Activo</h3>
                            <p className="text-xs text-muted-foreground">Ingresa los detalles técnicos y financieros de la propiedad.</p>
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
                        onClick={() => setActiveTab('multimedia')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'multimedia' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Multimedia
                    </button>
                    <button
                        onClick={() => setActiveTab('location')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'location' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Ubicación
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                    <div className="mb-8 space-y-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                        <label className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
                            Landowner (Propietario)
                        </label>
                        <select
                            className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={formData.user_id}
                            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                            required
                        >
                            <option value="" disabled>Seleccione el propietario legal...</option>
                            {users.map((user: any) => (
                                <option key={user.id} value={user.id}>{user.name} {user.lastname} ({user.email})</option>
                            ))}
                        </select>
                    </div>

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
                                        {formData.extra_characteristics.length === 0 && (
                                            <p className="text-xs text-muted-foreground italic">No hay características adicionales.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'multimedia' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-primary" />
                                    Imágenes de la Propiedad
                                </h4>
                                <DragDropUpload
                                    title="Arrastra imágenes aquí"
                                    onFilesDrop={handleImageDrop}
                                    fileTypeDescription="(.jpg, .png)"
                                />
                                {formData.files.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        {formData.files.images.map((file, i) => (
                                            <div key={i} className="relative aspect-video bg-secondary/30 rounded-lg overflow-hidden border border-border group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile('images', i)}
                                                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <span className="absolute bottom-1 left-2 text-[10px] text-white drop-shadow-md truncate w-[90%]">
                                                    {file.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
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

                </form>

                <div className="p-6 border-t border-border flex justify-end gap-4 bg-background z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-bold"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.user_id}
                        className="px-8 py-2.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-500/20"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Registrando...
                            </>
                        ) : (
                            'Registrar Propiedad'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
