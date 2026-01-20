'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';

export interface OnboardingStatus {
    id: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    currentStep: string;
    status: 'pending' | 'failed' | 'completed';
    progress: number;
    stepMessage: string;
    error?: string;
}

export function useOnboarding() {
    return useQuery({
        queryKey: ['onboarding-flows'],
        queryFn: async () => {
            try {
                const response = await fetchApi('/onboardings');
                // The API returns { data: [...] }
                return response.data as OnboardingStatus[];
            } catch (error) {
                console.error('Failed to fetch onboarding flows:', error);
                return [] as OnboardingStatus[];
            }
        },
    });
}
