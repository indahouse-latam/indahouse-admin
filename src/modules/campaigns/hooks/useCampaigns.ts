'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface Campaign {
    id: string;
    property_id: string;
    campaign_address: string;
    status: 'active' | 'finalized' | 'cancelled' | 'expired';
    min_cap: string;
    max_cap: string;
    property: {
        name_reference: string;
        property_reference: string;
    };
    stats?: {
        totalCommitted: string;
        fundingPercentage: number;
        commitCount: number;
    };
}

export function useCampaigns() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['campaigns'],
        queryFn: async () => {
            try {
                const campaigns = await fetchApi('/campaigns');
                // The API returns an array of campaigns with preloaded property
                return campaigns as Campaign[];
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
                return [] as Campaign[];
            }
        },
    });

    const terminateCampaignMutation = useMutation({
        mutationFn: async (id: string) => {
            return fetchApi(`/campaigns/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'cancelled' }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });

    const finalizeCampaignMutation = useMutation({
        mutationFn: async (id: string) => {
            return fetchApi(`/campaigns/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'finalized' }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });

    const createCampaignMutation = useMutation({
        mutationFn: async (data: any) => {
            return fetchApi('/campaigns', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });

    return {
        ...query,
        terminateCampaign: terminateCampaignMutation.mutate,
        finalizeCampaign: finalizeCampaignMutation.mutate,
        createCampaign: createCampaignMutation.mutate,
        isCreating: createCampaignMutation.isPending,
        isUpdatingStatus: terminateCampaignMutation.isPending || finalizeCampaignMutation.isPending,
    };
}
