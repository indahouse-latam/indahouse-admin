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

// Default values - deployment-docs (Amoy 80002, CO) – .deployment_state.json
const DEFAULT_CONFIG: ContractsConfig = {
    batch1: {
        certFactory: "0x8D9F59C9AF3281b75483F442b569a6FabCe6cbB4",
        govFactory: "0xba70b5c650c252261ECf38829F4C2bb5D537f5A2",
        managerFactory: "0x7F0128677E10b55062700b7ab10A945446FDac55",
        poolFactory: "0xB88b976Ecff31bD79d7291E15620D0ffECd15a75",
        registry: "0x338410e6B6445bA93e25C771F1883CdB3EC597e4",
        timeLock: "0xcE031A9fAdF63f0D014fC74078eDC03efa08798A",
        tokenFactory: "0xB17f3453AC57A0ed646566e92D382bfA258Eb651"
    },
    batch2: {
        campaignImpl: "0x7792634b713Dc0B64607e68AD144c949ed2b3578",
        distributorImpl: "0xc6C4F10538a86EBCF0dFFb3fdb8f44C351BD6EEf",
        indaAdmin: CONTRACTS.polygonAmoy.indaAdmin,
        indaProperties: "0xC78c8317Abb52aAA8774f67B98e86A60de92eE65",
        indaRootImpl: "0x2ab2c0F2Affb48d17BAd40F2396AF439F6207817",
        propertyRegistryImpl: "0x39557A81a008A933c26F9e0dd22F0E8bE9690D94"
    },
    batch3: {
        adminRouter: "0x524BEfC17B4c8BE2d1d31ed7d5E0A5260c83a6b1",
        commitFactory: CONTRACTS.polygonAmoy.commitFactory,
        distributorProxy: "0xDaA1d43185509d4b10a928Da13dcABB230e8F47D",
        indaRootProxy: CONTRACTS.polygonAmoy.indaRoot,
        propertyRegistryProxy: "0xe6B032efb17CC1eeE1c3005A0828080f4e1Ebb55",
        router: CONTRACTS.polygonAmoy.router
    },
    batch5: {
        manager: "0xe48399f36Db6b3591dCb1002b7cFC67091374BB7",
        poolDistributor: "0x57baa7a0026836CCb406c68D1bDeCdc2977079E4",
        poolToken: "0x17Bb0DE3999bc44723fEE2D902a334a2C9a2d666",
        poolVault: "0x0b7ce62c0D18027Da88e18D8c5686128b9f530a3"
    },
    countryCode: "CO",
    lastCompletedBatch: 5,
    network: "80002",
    timestamp: 1771420529
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
