'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface Country {
    id: string;
    name: string;
    code: string;
}

export function useCountries() {
    return useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            try {
                const response = await fetchApi('/master-countries');
                // Handle different response structures
                return (response.countries || response.data || response || []) as Country[];
            } catch (error) {
                console.error('Failed to fetch countries:', error);
                return [] as Country[];
            }
        },
    });
}
