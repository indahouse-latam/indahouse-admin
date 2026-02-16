'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { CONTRACTS } from '@/config/contracts';

// Define the structure based on the user's JSON
export interface ContractsConfig {
    batch1: {
        certFactory: string;
        govFactory: string;
        managerFactory: string;
        poolFactory: string;
        registry: string;
        timeLock: string;
        tokenFactory: string;
    };
    batch2: {
        campaignImpl: string;
        distributorImpl: string;
        indaAdmin: string;
        indaProperties: string;
        indaRootImpl: string;
        propertyRegistryImpl: string;
    };
    batch3: {
        adminRouter: string;
        commitFactory: string;
        distributorProxy: string;
        indaRootProxy: string;
        propertyRegistryProxy: string;
        router: string;
    };
    batch5: {
        manager: string;
        poolDistributor: string;
        poolToken: string;
        poolVault: string;
    };
    countryCode: string;
    lastCompletedBatch: number;
    network: string;
    timestamp: number;
}

// Default values - deployment-docs (Amoy 80002, CO)
const DEFAULT_CONFIG: ContractsConfig = {
    batch1: {
        certFactory: "0x1b8dBfD660984d0457c984282FC389556c4fcA77",
        govFactory: "0x101A7A4E8a37ffe0321f446b3d4275c58A6F548F",
        managerFactory: "0xD4aE289b094261Fc43b7D19C6aD7F69440184572",
        poolFactory: "0x362C175AC5B165D5e6dCe2513a8f0A90B28BA92E",
        registry: "0x2C492144dc424B0172eDb97E90b4E4cC8B1c4ed9",
        timeLock: "0x693861c5AF551F654236b0146dd272682a4bC458",
        tokenFactory: "0xbe0611f08bB481f3394C0eC32a0e9c6b83a59B2e"
    },
    batch2: {
        campaignImpl: "0xCd9Da0a17Da274ae3438F67cAF1cbD06a785C98d",
        distributorImpl: "0x43b1C3aE275253f1E4DA8c6151718DB674CBBcbE",
        indaAdmin: CONTRACTS.polygonAmoy.indaAdmin,
        indaProperties: "0x2Fb5632a92F899682442f244B7A89c9E6c6CCec2",
        indaRootImpl: "0xF1e869E6Ece5B014efb9e70aeCaf8999209BFfD2",
        propertyRegistryImpl: "0x522786BC407a0782c92dE3d35B1cF13845D5C6fF"
    },
    batch3: {
        adminRouter: "0xB81360FF45112a18e9507DAA5349684BB5f99323",
        commitFactory: CONTRACTS.polygonAmoy.commitFactory,
        distributorProxy: "0x5039053A4038BE5550b4379c58df7F2FEf23D3A1",
        indaRootProxy: CONTRACTS.polygonAmoy.indaRoot,
        propertyRegistryProxy: "0xf316Da735789F90A4BeFE89193a11d76eB9EB99C",
        router: CONTRACTS.polygonAmoy.router
    },
    batch5: {
        manager: "0x1C00Abc7938251e72b3807e5f5285422a8F660C0",
        poolDistributor: "0xe74329F258062756c51CB050778cfC67058D53D6",
        poolToken: "0x07E7a3F6c2ed35ba77e32a1c02edd6c4131C483a",
        poolVault: "0xA0dFdDf152f28cAaF2585EA642Cfe83102C20D8E"
    },
    countryCode: "CO",
    lastCompletedBatch: 5,
    network: "80002",
    timestamp: 1771254800
};

interface ContractsContextType {
    contracts: ContractsConfig;
    updateContracts: (newConfig: ContractsConfig) => void;
    resetContracts: () => void;
}

export const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

export function ContractsProvider({ children }: { children: React.ReactNode }) {
    const [contracts, setContracts] = useState<ContractsConfig>(DEFAULT_CONFIG);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedConfig = localStorage.getItem('contracts_config');
        if (storedConfig) {
            try {
                // Merge stored config with default to ensure new keys are present if shape changes
                const parsed = JSON.parse(storedConfig);
                setContracts(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse stored contracts config", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const updateContracts = (newConfig: ContractsConfig) => {
        setContracts(newConfig);
        localStorage.setItem('contracts_config', JSON.stringify(newConfig));
    };

    const resetContracts = () => {
        setContracts(DEFAULT_CONFIG);
        localStorage.removeItem('contracts_config');
    };

    if (!isLoaded) {
        return null; // Or a loading spinner
    }

    return (
        <ContractsContext.Provider value={{ contracts, updateContracts, resetContracts }}>
            {children}
        </ContractsContext.Provider>
    );
}
