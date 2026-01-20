'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface RentClaim {
    id: string;
    user_id: string;
    amount: number;
    property_id: string;
    status: string;
    type: string;
    created_at: string;
    user?: {
        name: string;
        lastname: string;
    };
    property?: {
        name_reference: string;
    };
}

export function useRentClaims() {
    return useQuery({
        queryKey: ['rent-claims'],
        queryFn: async () => {
            try {
                const response = await fetchApi('/rent-claims');
                // The API returns { code: "RC-200", rentClaims: { data: [...] } }
                return (response.rentClaims?.data || []) as RentClaim[];
            } catch (error) {
                console.error('Failed to fetch rent claims:', error);
                return [] as RentClaim[];
            }
        },
    });
}
