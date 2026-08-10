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
        indaRoot: "0x543F7dF0EBD524b3bE66277E18514B44BAC4b4e1",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0xA5b4E347eB2aC837E15AdDD973aA8c93A6487325",
        indaProperties: "0xF619060F2F32B91e036cff996cB58b6Fa0F65Ad0",
        landOwner: "0x0000000000000000000000000000000000000000",
        adminAddress: "0x2Fc5C212b455d67EA08b4b1508df54548BAFAb40",
        indaAdmin: "0x2Fc5C212b455d67EA08b4b1508df54548BAFAb40",
        indaLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        capitalGainsVault: "0xD7b450420Be6e6d90fB3a9d31506EFEE546972eb",
        router: "0x7594A0b010AF7c5e0FBDc0823df4889d509ae50f",
        rentVault: "0xD7b450420Be6e6d90fB3a9d31506EFEE546972eb",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        commitFactory: "0xa0Ef410ff79A469EDf1fe7978087104D5150E4f3",
        poolFactory: "0xd61a2EB8bE544945979b821B7e0909a5fD22D7BD",
        tokenFactory: "0x8e05870E1aAcC6105A711D710F62399F8236d360",
        distributorProxy: "0xb1b243f5Cc3f579cAf49ee2df4ECd14C76726C80",
        manager: "0x54c59644FA651091038F144E15d0952Ce1BC9558",
        PropertyRegistry: "0x195aaBd7AC85E4FF364b59Cc7A6f5f46e4B45702",
        IndaAdminRouter: "0xfbB1274D9D23C218DDb4f11a1D772e3d301B844A",
        CommitCampaign: "0x7792634b713Dc0B64607e68AD144c949ed2b3578",
        indahouseRegistry: "0xec375793e3628b25547CE375Ea3B1598D85cd362"
    },
    // PRODUCTION: Polygon Amoy (80002) - nuevos contratos desplegados
    polygon: {
        indaRoot: "0x8699436A0d3DeE4C49A6F85068074e7B531bAe4f",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0x17Bb0DE3999bc44723fEE2D902a334a2C9a2d666",
        indaProperties: "0x0000000000000000000000000000000000000000",
        landOwner: "0x0000000000000000000000000000000000000000",
        adminAddress: "0xdaf1DebE68c26BD0CcA33429F66a48A478198A03",
        indaAdmin: "0xdaf1DebE68c26BD0CcA33429F66a48A478198A03",
        indaLock: "0x0000000000000000000000000000000000000000",
        capitalGainsVault: "0x0000000000000000000000000000000000000000",
        router: "0xB2E3135fc21CeAeD7d368d17C92b787b1b27DE26",
        rentVault: "0x0000000000000000000000000000000000000000",
        sIndh: "0x0000000000000000000000000000000000000000",
        commitFactory: "0x0000000000000000000000000000000000000000",
        poolFactory: "0x0000000000000000000000000000000000000000",
        tokenFactory: "0x0000000000000000000000000000000000000000",
        distributorProxy: "0x2C1E74537Ec8374dd94f6df9faAa22A4C25e3E3d",
        manager: "0x23fD0e6390696d2B7c535D9fc06D442D073D7c7b",
        PropertyRegistry: "0x14972754c33bB7E76011e065c4cc72591d1a3b94",
        IndaAdminRouter: "0x8A1bB6a31Db437D2E016Ad3A14748Af197481B94",
        CommitCampaign: "0x0000000000000000000000000000000000000000",
        indahouseRegistry: "0x6e73dFA8D2BCD7Dd576b38e5e8f13485E2A1e29A"
    }
} as const;

export type ContractsNetworkKey = "polygonAmoy" | "polygon";

/** Red activa según entorno: QA = polygonAmoy (80002), Production = polygon (137) */
export const CONTRACTS_NETWORK: ContractsNetworkKey = isProduction ? "polygon" : "polygonAmoy";

/** Contratos de la red activa (usar en lugar de CONTRACTS.polygonAmoy en toda la app) */
export const currentContracts = CONTRACTS[CONTRACTS_NETWORK];

/** Chain ID por defecto: QA = 80002 (Polygon Amoy), Production = 80002 (Polygon Amoy) */
export const DEFAULT_CHAIN_ID = 80002;
