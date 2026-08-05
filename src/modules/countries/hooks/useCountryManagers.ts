import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api';
import { useAuth } from '@/providers/AuthProvider';

export interface CountryManager {
    countryCode: string;
    countryName: string;
    managerAddress: string | null;
    hasManager: boolean;
    hasCertificateRole: boolean;
    isLoading: boolean;
    error?: string;
}

export interface CreateManagerParams {
    countryCode: string;
    countryId: string;
    privateKey: string;
}

export interface CreateManagerResult {
    success: boolean;
    message: string;
    managerAddress: string;
    wasAlreadyConfigured: boolean;
    createTxHash?: string;
    grantTxHash?: string;
}

export function useCountryManagers() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const countryManagersQuery = useQuery<CountryManager[]>({
        queryKey: ['country-managers'],
        queryFn: async () => {
            const response = await fetchApi('/master-countries');
            const countries = response.countries || response.data || response || [];

            const managersInfo: CountryManager[] = await Promise.all(
                countries.map(async (country: { id: string; code: string; name: string }) => {
                    try {
                        const managerStatus = await fetchApi(`/admin/manager/status?countryCode=${country.code}`);
                        return {
                            countryCode: country.code,
                            countryName: country.name,
                            managerAddress: managerStatus.managerAddress || null,
                            hasManager: managerStatus.hasManager || false,
                            hasCertificateRole: managerStatus.hasCertificateRole || false,
                            isLoading: false,
                        };
                    } catch {
                        return {
                            countryCode: country.code,
                            countryName: country.name,
                            managerAddress: null,
                            hasManager: false,
                            hasCertificateRole: false,
                            isLoading: false,
                            error: 'Failed to check manager status',
                        };
                    }
                })
            );

            return managersInfo;
        },
        enabled: !!user,
    });

    const createManagerMutation = useMutation<CreateManagerResult, Error, CreateManagerParams>({
        mutationFn: async ({ countryCode, privateKey }) => {
            const adminAddress = user?.walletAddress;
            if (!adminAddress) {
                throw new Error('No wallet address available');
            }

            const response = await fetchApi('/admin/manager/create-for-country', {
                method: 'POST',
                body: JSON.stringify({
                    countryCode,
                    adminAddress,
                    privateKey,
                }),
            });

            return response as CreateManagerResult;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['country-managers'] });
        },
    });

    const getCountryManager = (countryCode: string): CountryManager | undefined => {
        return countryManagersQuery.data?.find(m => m.countryCode === countryCode);
    };

    return {
        countryManagers: countryManagersQuery.data || [],
        isLoading: countryManagersQuery.isLoading,
        error: countryManagersQuery.error,
        refetch: countryManagersQuery.refetch,
        createManager: createManagerMutation.mutate,
        createManagerAsync: createManagerMutation.mutateAsync,
        isCreating: createManagerMutation.isPending,
        createError: createManagerMutation.error,
        getCountryManager,
    };
}
