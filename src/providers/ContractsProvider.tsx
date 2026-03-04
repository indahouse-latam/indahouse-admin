'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { currentContracts, DEFAULT_CHAIN_ID } from '@/config/contracts';

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
        certFactory: "0x1e993A547444210763E19d839883f8dA5E1c3fA3",
        govFactory: "0x5d6a77C968D1982Dc98D6CfB3f914ed2a3a07Bd2",
        managerFactory: "0x0c4D2ECb9cB98915a27f046194518b817f4C3A19",
        poolFactory: "0x15cC4ed8E202D81B20f8b7B82dC5A95d2Cd1e5b2",
        registry: "0xAe96188a54017e467fa67C6cA48c2497f22C8B80",
        timeLock: "0xbc2EcaF324bfa90A36877d3F70e8134EED90Ce42",
        tokenFactory: "0xec81d97712a832b750C016b5e526AAAD6b7CDBEE"
    },
    batch2: {
        campaignImpl: "0x5c4FB4E039f1C51D9bA9Be0d9D494dD8e978903e",
        distributorImpl: "0x1E4A66F3DF7AA92dE879619cDb579Be77133e5A1",
        indaAdmin: "0x51A89858b4bC1abe979dA8F80Cf09D11b9404623",
        indaProperties: "0xA1fb58B3CbE67E9B60e4c6E30dd5261c909ff948",
        indaRootImpl: "0x220705f2a1D90C4924799041F19f37548b1Ac60a",
        propertyRegistryImpl: "0x585c2550a80F6eF77796cc836b0A3286B819ffD9"
    },
    batch3: {
        adminRouter: "0x6881c3e6821C71E5e73CB69eb1254B9aa79c933F",
        commitFactory: "0x936e19bb737e29B50b49c77d6b2Cf77A0572448E",
        distributorProxy: "0x6819152f180D1ffcE6D880f8E8FA4ca023B4fCb9",
        indaRootProxy: "0x0F05927c042404c379a244431a174613ee24aBD2",
        propertyRegistryProxy: "0x7cAB49CDDe08492B233d0F3Eac50C171d7478b67",
        router: "0xbBbf4DAb36d80c1cbC8038791D4D2C855B52e5Ab"
    },
    batch5: {
        manager: "0x61D9Ef2E7bE35E7FB1C8838515fa809ec9bbef40",
        poolDistributor: "0xDD9293078fFbFde17fe81Fd7aC07da7407048d78",
        poolToken: "0x60e96961d8Ea2B466Abf632f9380803417D7958A",
        poolVault: "0x355558D142ab03C5399F6309a0871bfBf1D661DF"
    },
    countryCode: "CO",
    lastCompletedBatch: 5,
    network: String(DEFAULT_CHAIN_ID),
    timestamp: 1772631589
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
