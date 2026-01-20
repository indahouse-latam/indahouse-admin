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

// Default values - using hardcoded Fallbacks or Empty strings if not in CONTRACTS
const DEFAULT_CONFIG: ContractsConfig = {
    batch1: {
        certFactory: "0xB249212d4ef24fb04B9ee8AA1BA7e31e581756e1",
        govFactory: "0x00693E284f3d40FCc00F17DB4213D2E08B1425F9",
        managerFactory: "0x2F3bB4E693136d61152885Cc186C2B159d5C4FCc",
        poolFactory: "0xfA073CD88AB9d1619047A10150ae587AD87B1bC6",
        registry: "0x7483d5F756590423031FC5c452a98Ac8ef7f4641",
        timeLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        tokenFactory: "0x9B7b22Cf5Bf1BbbB5D958534339c1c72D95eC9D7"
    },
    batch2: {
        campaignImpl: "0x795021851Db0ffd6076F26e08628f887a53E2Bf5",
        distributorImpl: "0xa316bbda7f42dCD16227fA2029b78aD87539efA7",
        indaAdmin: CONTRACTS.baseSepolia.adminAddress || "0x8BF99a1B2725bfb4D018e145967A7300a088A7a7",
        indaProperties: "0xf057885289b816B4c1e7335D638Af03940708791",
        indaRootImpl: "0x23bd14Bc1B3B64736893A775A9CF98a2e315e357",
        propertyRegistryImpl: "0x0Ad0502429A258075EEb269e642D0d6a26cD58cE"
    },
    batch3: {
        adminRouter: "0xa7C1138A61c85cDB65929fCb74df2b88dc02208B",
        commitFactory: CONTRACTS.baseSepolia.commitFactory || "0xc049A4a89f3614a98E4F1295bdC5c39A1566e6d9",
        distributorProxy: "0xe7A2cC2f4da50054D80Db0E10e34652B9fb2Fb3C",
        indaRootProxy: CONTRACTS.baseSepolia.indaRoot || "0xE1F2742f86A4b49b34F954c3F96D298dca02eB0C",
        propertyRegistryProxy: "0x79756a33100428851B6640d1723164D66dd76d1b",
        router: "0x9F2C85C9c98925b22bCfe41a5332790370b1c867"
    },
    batch5: {
        manager: "0x82C0ba2965d11AA9ebA41E96e7D04BA552068F36",
        poolDistributor: "0x1a68Df55B5DdE8541146651AE17F757F6CE83462",
        poolToken: "0x55cFc2E271F5AbA6dD48F0E91F26f5498361383F",
        poolVault: "0xF60A9d3cc9C49875FD90d1484d11344509db1502"
    },
    countryCode: "CO",
    lastCompletedBatch: 5,
    network: "unknown",
    timestamp: 1768399838
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
