'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    user_type: string;
    onboarding_finished: boolean;
    is_kyc_verified: boolean;
    user_authorized: boolean;
    created_at: string;
}

export function useUsers() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            try {
                const response = await fetchApi('/users');
                // The API returns { code: "USER-200", users: [...] }
                const users = response?.users || [];
                return users as User[];
            } catch (error) {
                console.error('Failed to fetch users:', error);
                return [] as User[];
            }
        },
    });

    const toggleAuthorization = useMutation({
        mutationFn: async ({ id, authorized }: { id: string | number, authorized: boolean }) => {
            return fetchApi(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ user_authorized: authorized }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    return {
        ...query,
        toggleAuthorization: toggleAuthorization.mutate,
        isToggling: toggleAuthorization.isPending,
    };
}
