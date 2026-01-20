'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface Property {
    id: number;
    name_reference: string;
    status: string;
    valuation: number;
    location: {
        address: string;
        city: string;
        department: string;
    };
}

export function useMarkets() {
    return useQuery({
        queryKey: ['markets'],
        queryFn: async () => {
            try {
                // The resource name is "properties"
                const propertiesResponse = await fetchApi('/properties?status=VERIFIED');
                const statsResponse = await fetchApi('/totalValuation');

                return {
                    properties: (propertiesResponse.properties || []) as Property[],
                    totalValuation: (statsResponse.data?.totalValuation || 0) as number,
                };
            } catch (error) {
                console.error('Failed to fetch markets:', error);
                return {
                    properties: [] as Property[],
                    totalValuation: 0,
                };
            }
        },
    });
}
