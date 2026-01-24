'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface PropertyDetails {
    id: string;
    name_reference?: string;
    nameReference?: string;
}

export function usePropertyDetails(propertyUuid: string | undefined) {
    return useQuery({
        queryKey: ['property-details', propertyUuid],
        queryFn: async () => {
            if (!propertyUuid) return null;
            try {
                const response = await fetchApi(`/properties/${propertyUuid}`);
                return response as PropertyDetails;
            } catch (error) {
                console.error(`Failed to fetch property ${propertyUuid}:`, error);
                return null;
            }
        },
        enabled: !!propertyUuid,
    });
}
