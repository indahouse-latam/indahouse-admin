import { isProduction } from "./env";

export const CONTRACTS = {
    baseSepolia: {
        indaRoot: "0x2c3a13BDD9bC55ED52Ec1A5BBe06FF577106f08a",
        baseToken: "0x4200000000000000000000000000000000000006", // WETH on Base Sepolia
        commitFactory: "0xf6C94E587E0d9ef1811aB034D5986D8242419637",
        adminAddress: "0x6c173C864481E5fcdf7e0A47B60e7a00E7Cc01a4",
        tokenFactory: "0x9B7b22Cf5Bf1BbbB5D958534339c1c72D95eC9D7",
        distributorProxy: "0xe7A2cC2f4da50054D80Db0E10e34652B9fb2Fb3C",
    },
    base: {
        indaRoot: "0xA2Fc9e0B3e0aE0aED1b2A9447ACD24A9E3F6D56d",
        baseToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
        commitFactory: "0xf6C94E587E0d9ef1811aB034D5986D8242419637",
        adminAddress: "0x6c173C864481E5fcdf7e0A47B60e7a00E7Cc01a4",
        tokenFactory: "0x9B7b22Cf5Bf1BbbB5D958534339c1c72D95eC9D7",
        distributorProxy: "0xe7A2cC2f4da50054D80Db0E10e34652B9fb2Fb3C",
    },
    // QA: deployment-docs (Amoy 80002, CO) – .deployment_state.json
    polygonAmoy: {
        indaRoot: "0x0F05927c042404c379a244431a174613ee24aBD2",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0x60e96961d8Ea2B466Abf632f9380803417D7958A",
        indaProperties: "0xA1fb58B3CbE67E9B60e4c6E30dd5261c909ff948",
        landOwner: "0x0000000000000000000000000000000000000000",
        adminAddress: "0x51A89858b4bC1abe979dA8F80Cf09D11b9404623",
        indaAdmin: "0x51A89858b4bC1abe979dA8F80Cf09D11b9404623",
        indaLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        capitalGainsVault: "0x355558D142ab03C5399F6309a0871bfBf1D661DF",
        router: "0xbBbf4DAb36d80c1cbC8038791D4D2C855B52e5Ab",
        rentVault: "0x355558D142ab03C5399F6309a0871bfBf1D661DF",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        commitFactory: "0x936e19bb737e29B50b49c77d6b2Cf77A0572448E",
        tokenFactory: "0xec81d97712a832b750C016b5e526AAAD6b7CDBEE",
        distributorProxy: "0xDD9293078fFbFde17fe81Fd7aC07da7407048d78",
        manager: "0x61D9Ef2E7bE35E7FB1C8838515fa809ec9bbef40",
        PropertyRegistry: "0x7cAB49CDDe08492B233d0F3Eac50C171d7478b67",
        IndaAdminRouter: "0x6881c3e6821C71E5e73CB69eb1254B9aa79c933F",
        CommitCampaign: "0x7792634b713Dc0B64607e68AD144c949ed2b3578",
        indahouseRegistry: "0xAe96188a54017e467fa67C6cA48c2497f22C8B80"
    },
    // PRODUCTION: Polygon Mainnet (137). Sustituir placeholders por direcciones reales o configurar en Vercel.
    polygon: {
        indaRoot: "0x0000000000000000000000000000000000000000",
        baseToken: "0x0000000000000000000000000000000000000000",
        cops: "0x0000000000000000000000000000000000000000",
        usdc: "0x0000000000000000000000000000000000000000",
        InDH: "0x0000000000000000000000000000000000000000",
        indaProperties: "0x0000000000000000000000000000000000000000",
        landOwner: "0x0000000000000000000000000000000000000000",
        adminAddress: "0x0000000000000000000000000000000000000000",
        indaAdmin: "0x0000000000000000000000000000000000000000",
        indaLock: "0x0000000000000000000000000000000000000000",
        capitalGainsVault: "0x0000000000000000000000000000000000000000",
        router: "0x0000000000000000000000000000000000000000",
        rentVault: "0x0000000000000000000000000000000000000000",
        sIndh: "0x0000000000000000000000000000000000000000",
        commitFactory: "0x0000000000000000000000000000000000000000",
        tokenFactory: "0x0000000000000000000000000000000000000000",
        distributorProxy: "0x0000000000000000000000000000000000000000",
        manager: "0x0000000000000000000000000000000000000000",
        PropertyRegistry: "0x0000000000000000000000000000000000000000",
        IndaAdminRouter: "0x0000000000000000000000000000000000000000",
        CommitCampaign: "0x0000000000000000000000000000000000000000",
        indahouseRegistry: "0x0000000000000000000000000000000000000000"
    }
} as const;

export type ContractsNetworkKey = "polygonAmoy" | "polygon";

/** Red activa según entorno: QA = polygonAmoy (80002), Production = polygon (137) */
export const CONTRACTS_NETWORK: ContractsNetworkKey = isProduction ? "polygon" : "polygonAmoy";

/** Contratos de la red activa (usar en lugar de CONTRACTS.polygonAmoy en toda la app) */
export const currentContracts = CONTRACTS[CONTRACTS_NETWORK];

/** Chain ID por defecto: QA = 80002 (Polygon Amoy), Production = 137 (Polygon Mainnet) */
export const DEFAULT_CHAIN_ID = isProduction ? 137 : 80002;
