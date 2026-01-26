'use client';

import { useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { PlacePrediction, usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';

export interface LocationData {
    address: string;
    full_location: string;
    short_location: string;
    latitude?: number;
    longitude?: number;
}

interface LocationFieldsProps {
    value: LocationData;
    onChange: (location: LocationData) => void;
}

export function LocationFields({ value, onChange }: LocationFieldsProps) {
    const suggestionBoxRef = useRef<HTMLDivElement>(null);

    const {
        isLoaded,
        inputValue,
        setInputValue,
        suggestions,
        isLoading,
        showSuggestions,
        setShowSuggestions,
        handleInputChange,
        selectPlace,
    } = usePlacesAutocomplete({
        debounceMs: 300,
        componentRestrictions: { country: ['co', 'us'] },
    });

    // Sync inputValue with value.address when value changes externally
    useEffect(() => {
        if (value.address && inputValue !== value.address) {
            setInputValue(value.address);
        }
    }, [value.address, inputValue, setInputValue]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowSuggestions]);

    const handlePlaceSelect = async (prediction: PlacePrediction) => {
        try {
            const addressComponents = await selectPlace(prediction);
            
            // Update all fields with the parsed address components
            onChange({
                address: addressComponents.street,
                full_location: addressComponents.fullAddress,
                short_location: addressComponents.shortLocation,
                latitude: addressComponents.latitude,
                longitude: addressComponents.longitude,
            });
        } catch (error) {
            console.error('Error getting place details:', error);
        }
    };

    const handleManualAddressChange = (address: string) => {
        handleInputChange(address);
        onChange({
            ...value,
            address,
        });
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Cargando Google Maps...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Address Field with Autocomplete */}
            <div className="space-y-2 relative" ref={suggestionBoxRef}>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Dirección *
                </label>
                <div className="relative">
                    <input
                        type="text"
                        required
                        className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Buscar dirección..."
                        value={inputValue}
                        onChange={(e) => handleManualAddressChange(e.target.value)}
                        onFocus={() => {
                            if (suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                    />
                    {isLoading && (
                        <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.placeId}
                                type="button"
                                className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0 flex items-start gap-3"
                                onClick={() => handlePlaceSelect(suggestion)}
                            >
                                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{suggestion.mainText}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {suggestion.secondaryText}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Short Location */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Ubicación Corta *
                </label>
                <input
                    type="text"
                    required
                    className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Ej: El Poblado, Medellín"
                    value={value.short_location}
                    onChange={(e) => onChange({ ...value, short_location: e.target.value })}
                />
            </div>

            {/* Full Location */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Ubicación Completa *
                </label>
                <input
                    type="text"
                    required
                    className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Ej: Calle 10 #45-30, Apto 402, El Poblado, Medellín, Antioquia, Colombia"
                    value={value.full_location}
                    onChange={(e) => onChange({ ...value, full_location: e.target.value })}
                />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">
                        Latitud (Opcional)
                    </label>
                    <input
                        type="number"
                        step="any"
                        className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Ej: 6.2442"
                        value={value.latitude || ''}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                latitude: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">
                        Longitud (Opcional)
                    </label>
                    <input
                        type="number"
                        step="any"
                        className="w-full bg-secondary-100 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Ej: -75.5812"
                        value={value.longitude || ''}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                longitude: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                            })
                        }
                    />
                </div>
            </div>

            {/* Info Message */}
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs">
                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-medium mb-1">Autocompletado con Google Places</p>
                        <p className="text-indigo-300/80">
                            Empieza a escribir la dirección y selecciona de las sugerencias. Los campos se
                            llenarán automáticamente pero puedes editarlos manualmente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
