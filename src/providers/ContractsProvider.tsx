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
        certFactory: "0x0F960438FaFac44748C0062AD38846e6Bb0DdC0D",
        govFactory: "0xe638fB9487b33F2E7CE84EdB540B09e2a16B2261",
        managerFactory: "0x88329dcb0CAdb9A2640F20ce07206d65a81ce223",
        poolFactory: "0x8285143951aC779035CAdBa7D3D13aE68C5B0847",
        registry: "0x703CE69d61D9A043803276981e9AA9Fce5908516",
        timeLock: "0x795526a0b6C1eF9b0e254e626e0B977199f7bdBF",
        tokenFactory: "0xe957Ab2DcB567C16d440219dCE9F76F57fD7771D"
    },
    batch2: {
        campaignImpl: "0xEdC480Ad7fed560094E400D01632aAC32fdEb372",
        distributorImpl: "0x0240613BEFA68fdfC309C7785B38064034cbB46b",
        indaAdmin: CONTRACTS.polygonAmoy.indaAdmin,
        indaProperties: "0x4126Bb6dA5C8216CA29cD2D8e1b6D7203C8e3866",
        indaRootImpl: "0x1779cB5DB317dD006C82Edf803a10930B598d442",
        propertyRegistryImpl: "0xADf5798D531F2C1BbE68a9dbc12e2F486C0BaD65"
    },
    batch3: {
        adminRouter: "0xE905303aB4ba61cD7646b4bFe47830c70cCA02E7",
        commitFactory: CONTRACTS.polygonAmoy.commitFactory,
        distributorProxy: "0xB64F68D327a59a292Cac2309c630B8938066595C",
        indaRootProxy: CONTRACTS.polygonAmoy.indaRoot,
        propertyRegistryProxy: "0x1b7245692B6d8Da711Ff2Aee8e22E800B6d06FA7",
        router: CONTRACTS.polygonAmoy.router
    },
    batch5: {
        manager: "0x85249cB6f1982C85CB59D266Da280c6b287a1B49",
        poolDistributor: "0x465Ff57fA62b41fC8071259b931e2E6D4db6302C",
        poolToken: "0xfFb19B985B0C0700EB5733a2c35eafaf8D696C6c",
        poolVault: "0xc60fE958571Cc4B70612c9F44CCd647f23592472"
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
