'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';



interface CreatePropertyTokenPayload {
    token_address: string;
    distributor_address: string;
    country_id: string;
    symbol: string;
    name: string;
    status: 'active';
    property_id: string;
}
export interface PropertyTokenResponse {
    id:                 string;
    tokenAddress:       string;
    distributorAddress: string;
    propertyId:         string;
    name:               string;
    symbol:             string;
    decimals:           number;
    countryId:          string;
    status: 'active' | 'inactive';
    createdAt:          Date;
    updatedAt:          Date;
    country:            Country;
    property:           Property;
}

export interface Country {
    id:        string;
    code:      string;
    name:      string;
    isActive:  number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Property {
    id:                   string;
    userId:               string;
    nameReference:        string;
    description:          string;
    price:                string;
    discountPrice:        null;
    propertyReference:    string;
    propertyType:         number;
    stratum:              number;
    builtTime:            number;
    requestId:            null;
    valuation:            string;
    roi:                  null;
    status:               string;
    statusDetail:         null;
    createdAt:            Date;
    updatedAt:            Date;
    blockchainId:         null;
    campaignContractHash: null;
}




export function usePropertyTokens() {
    const queryClient = useQueryClient();

    const propertyTokensQuery = useQuery({
        queryKey: ['property-tokens'],
        queryFn: async () => {
            const response = await fetchApi('/property-tokens');
            return response as PropertyTokenResponse[];
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
