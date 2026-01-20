'use client';

import { useContext } from 'react';
import { ContractsContext } from '@/providers/ContractsProvider';

export function useContracts() {
    const context = useContext(ContractsContext);
    if (context === undefined) {
        throw new Error('useContracts must be used within a ContractsProvider');
    }
    return context;
}
