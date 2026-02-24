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
        indaRoot: "0xA19006C5Fe8baa747317b811c9D127cc762A5878",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0x17Bb0DE3999bc44723fEE2D902a334a2C9a2d666",
        indaProperties: "0xC78c8317Abb52aAA8774f67B98e86A60de92eE65",
        landOwner: "0x0000000000000000000000000000000000000000",
        adminAddress: "0x735Ecc70551F4D2d91118a43b30685236128CA72",
        indaAdmin: "0x735Ecc70551F4D2d91118a43b30685236128CA72",
        indaLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        capitalGainsVault: "0x0b7ce62c0D18027Da88e18D8c5686128b9f530a3",
        router: "0x58102e8aa89EF04e45B17f68d0aba3Bbda44fC20",
        rentVault: "0x0b7ce62c0D18027Da88e18D8c5686128b9f530a3",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        commitFactory: "0xD1072B90160676e124e07Eebc53DfD1f6B4A195f",
        tokenFactory: "0xB17f3453AC57A0ed646566e92D382bfA258Eb651",
        distributorProxy: "0xDaA1d43185509d4b10a928Da13dcABB230e8F47D",
        manager: "0xe48399f36Db6b3591dCb1002b7cFC67091374BB7",
        PropertyRegistry: "0xe6B032efb17CC1eeE1c3005A0828080f4e1Ebb55",
        IndaAdminRouter: "0x524BEfC17B4c8BE2d1d31ed7d5E0A5260c83a6b1",
        CommitCampaign: "0x7792634b713Dc0B64607e68AD144c949ed2b3578",
        indahouseRegistry: "0x338410e6B6445bA93e25C771F1883CdB3EC597e4"
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
