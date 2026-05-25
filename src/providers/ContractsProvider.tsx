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
        certFactory: "0xBaBec9C5ef8Cab422975F46E5020f773DEb07552",
        govFactory: "0xd8315a88980c29A332c12707977F07e28f69f278",
        managerFactory: "0xa6B27216E781aE79C67cAB0Ac470083713Cb3c0E",
        poolFactory: "0xd61a2EB8bE544945979b821B7e0909a5fD22D7BD",
        registry: "0xec375793e3628b25547CE375Ea3B1598D85cd362",
        timeLock: "0x35A50701FF23552b90f605b3a3E30785EA30eB92",
        tokenFactory: "0x8e05870E1aAcC6105A711D710F62399F8236d360"
    },
    batch2: {
        campaignImpl: "0xa11b503760Eaf0fc210f44EbD0366Aed3696e0ee",
        distributorImpl: "0x95ABE41a05d96801EDD66E87C61d1CEa24Ec7fc1",
        indaAdmin: "0x2Fc5C212b455d67EA08b4b1508df54548BAFAb40",
        indaProperties: "0xF619060F2F32B91e036cff996cB58b6Fa0F65Ad0",
        indaRootImpl: "0xec76762c747D167d4ccefc49643919364b21a5EB",
        propertyRegistryImpl: "0xB1E85A2ffE02D8363c49254781eAb3dcc9295F9C"
    },
    batch3: {
        adminRouter: "0xfbB1274D9D23C218DDb4f11a1D772e3d301B844A",
        commitFactory: "0xa0Ef410ff79A469EDf1fe7978087104D5150E4f3",
        distributorProxy: "0x39bDfE6fc43e756cDf26a5011FfD7B7FD48523B6",
        indaRootProxy: "0x543F7dF0EBD524b3bE66277E18514B44BAC4b4e1",
        propertyRegistryProxy: "0x195aaBd7AC85E4FF364b59Cc7A6f5f46e4B45702",
        router: "0x7594A0b010AF7c5e0FBDc0823df4889d509ae50f"
    },
    batch5: {
        manager: "0x54c59644FA651091038F144E15d0952Ce1BC9558",
        poolDistributor: "0xb1b243f5Cc3f579cAf49ee2df4ECd14C76726C80",
        poolToken: "0xA5b4E347eB2aC837E15AdDD973aA8c93A6487325",
        poolVault: "0xD7b450420Be6e6d90fB3a9d31506EFEE546972eb"
    },
    countryCode: "CO",
    lastCompletedBatch: 5,
    network: String(DEFAULT_CHAIN_ID),
    timestamp: 1779201446
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
