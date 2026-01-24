'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

export interface PlacePrediction {
    placeId: string;
    description: string;
    mainText: string;
    secondaryText: string;
}

export interface AddressComponents {
    street: string;
    fullAddress: string;
    shortLocation: string;
    latitude?: number;
    longitude?: number;
}

interface UsePlacesAutocompleteOptions {
    debounceMs?: number;
    componentRestrictions?: { country: string | string[] };
}

const libraries: ('places')[] = ['places'];

export const usePlacesAutocomplete = (options: UsePlacesAutocompleteOptions = {}) => {
    const { debounceMs = 300, componentRestrictions } = options;

    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
        libraries,
    });

    useEffect(() => {
        if (isLoaded) {
            autocompleteServiceRef.current ??= new google.maps.places.AutocompleteService();
            if (!placesServiceRef.current) {
                const div = document.createElement('div');
                placesServiceRef.current = new google.maps.places.PlacesService(div);
            }
        }
    }, [isLoaded]);

    const fetchPredictions = useCallback(
        (input: string) => {
            if (!autocompleteServiceRef.current || !input.trim()) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoading(true);

            const request: google.maps.places.AutocompletionRequest = {
                input,
                types: ['address'],
                ...(componentRestrictions && { componentRestrictions }),
            };

            autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
                setIsLoading(false);

                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    const formattedPredictions: PlacePrediction[] = predictions.map((p) => ({
                        placeId: p.place_id,
                        description: p.description,
                        mainText: p.structured_formatting.main_text,
                        secondaryText: p.structured_formatting.secondary_text || '',
                    }));
                    setSuggestions(formattedPredictions);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            });
        },
        [componentRestrictions]
    );

    const handleInputChange = useCallback(
        (value: string) => {
            setInputValue(value);

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            if (!value.trim()) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            debounceTimerRef.current = setTimeout(() => {
                fetchPredictions(value);
            }, debounceMs);
        },
        [fetchPredictions, debounceMs]
    );

    const extractAddressComponents = useCallback((place: google.maps.places.PlaceResult): AddressComponents => {
        const components = place.address_components || [];
        
        let city = '';
        let state = '';
        let streetNumber = '';
        let route = '';

        components.forEach((component) => {
            const types = component.types;
            
            if (types.includes('street_number')) streetNumber = component.long_name;
            if (types.includes('route')) route = component.long_name;
            if (types.includes('administrative_area_level_1')) state = component.short_name;
            if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                if (!city) city = component.long_name;
            }
        });

        const street = place.formatted_address?.split(',')[0].trim() 
            || [streetNumber, route].filter(Boolean).join(' ').trim()
            || components[0]?.long_name || '';

        const latitude = place.geometry?.location?.lat();
        const longitude = place.geometry?.location?.lng();
        const shortLocation = [city, state].filter(Boolean).join(', ');
        const fullAddress = place.formatted_address || '';

        return {
            street,
            fullAddress,
            shortLocation,
            latitude,
            longitude,
        };
    }, []);

    const getPlaceDetails = useCallback(
        (placeId: string): Promise<AddressComponents> => {
            return new Promise((resolve, reject) => {
                if (!placesServiceRef.current) {
                    reject(new Error('PlacesService not initialized'));
                    return;
                }

                const request: google.maps.places.PlaceDetailsRequest = {
                    placeId,
                    fields: ['formatted_address', 'address_components', 'geometry'],
                };

                placesServiceRef.current.getDetails(request, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                        const addressComponents = extractAddressComponents(place);
                        resolve(addressComponents);
                    } else {
                        reject(new Error(`Failed to get place details: ${status}`));
                    }
                });
            });
        },
        [extractAddressComponents]
    );

    const selectPlace = useCallback(
        async (prediction: PlacePrediction): Promise<AddressComponents> => {
            setInputValue(prediction.description);
            setSuggestions([]);
            setShowSuggestions(false);
            return await getPlaceDetails(prediction.placeId);
        },
        [getPlaceDetails]
    );

    return {
        isLoaded,
        inputValue,
        setInputValue,
        suggestions,
        isLoading,
        showSuggestions,
        setShowSuggestions,
        handleInputChange,
        selectPlace,
    };
};
