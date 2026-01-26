'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface PropertyToken {
    id: string;
    tokenAddress: string;
    token_address?: string; // Alias for compatibility
    distributor_address: string;
    country_id: string;
    symbol: string;
    name: string;
    status: 'active' | 'inactive';
    property_uuid: string;
    propertyUuid?: string; // Alias for compatibility
    created_at: string;
    updated_at: string;
}

interface CreatePropertyTokenPayload {
    token_address: string;
    distributor_address: string;
    country_id: string;
    symbol: string;
    name: string;
    status: 'active';
    property_uuid: string;
}

export function usePropertyTokens() {
    const queryClient = useQueryClient();

    const propertyTokensQuery = useQuery({
        queryKey: ['property-tokens'],
        queryFn: async () => {
            const response = await fetchApi('/property-tokens');
            return response as PropertyToken[];
        },
    });

    const createPropertyTokenMutation = useMutation({
        mutationFn: async (data: CreatePropertyTokenPayload) => {
            return fetchApi('/property-tokens', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property-tokens'] });
            queryClient.invalidateQueries({ queryKey: ['markets'] });
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });

    return {
        data: propertyTokensQuery.data,
        isLoading: propertyTokensQuery.isLoading,
        error: propertyTokensQuery.error,
        createPropertyToken: createPropertyTokenMutation.mutate,
        isCreating: createPropertyTokenMutation.isPending,
    };
}
