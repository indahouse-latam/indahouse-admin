'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface Movement {
    id: string;
    user_id: string;
    transaction_hash: string;
    total_indh: number;
    operation_type: string;
    detail: string;
    contract: string;
    created_at: string;
    user?: {
        name: string;
        lastname: string;
    };
}

export function useMovements() {
    return useQuery({
        queryKey: ['movements'],
        queryFn: async () => {
            try {
                // Fetch for a specific user if needed, but for admin history we might want all?
                // Currently the API index expects a user_id in params: /users/:user_id/movements
                // If we want GLOBAL movements, we need a new endpoint or update index.

                // For now, let's try to fetch for a default user (admin) or check if global exists
                // Looking at routes.ts, movements are under users.

                // If I want global movements for admin, I should add an endpoint to MovementsController.
                const response = await fetchApi('/movements');
                const totalResponse = await fetchApi('/total-movements');
                return {
                    data: (response.movements?.data || []) as Movement[],
                    total: (totalResponse.totalMovements || 0) as number
                };
            } catch (error) {
                console.error('Failed to fetch movements:', error);
                return {
                    data: [] as Movement[],
                    total: 0
                };
            }
        },
    });
}
