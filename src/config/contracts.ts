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
    polygonAmoy: {
        indaRoot: "0x926c877C81C364BE726893Ad617b47A1AA7E6FE5",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0xb95cc5ee156c95d0a706f186718c146f2a3b2747",
        indaProperties: "0x8BAF3E59224E2844E1F66FD5D2C82bF8DfA92bC2",
        landOwner: "0x785072e12585dac0fc1543b45c67826e8d5f8f7e",
        adminAddress: "0x8BF99a1B2725bfb4D018e145967A7300a088A7a7",
        indaAdmin: "0x7d9A29ED1fC36F1b2FCc82851cF5c960FD43b0DA",
        indaLock: "0x40e1227c0Cc7610743EBBD44F43aE24824754357",
        capitalGainsVault: "0x5d9233E3599ce6C8469170E25AF5f1b83DE903cA",
        router: "0x570309aCCd0182c12d59626C16788449421Ad1e0",
        rentVault: "0x5d9233E3599ce6C8469170E25AF5f1b83DE903cA",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        commitFactory: "0x8e4bD0efBB08C75F4c5707C99d4216B66c758087",
        tokenFactory: "0xdCFb1aa14159874C5f4C7C2Dcf55Fd373286BC45",
        distributorProxy: "0x3445424bD3A1e8AB47EC8eE3313ecdee2314b704", // indaDistributorProxy
        manager: "0x17Cc132c6760222e19F940683ab6602759421a4D",
        PropertyRegistry: "0x81E3021610FDad6779e61B4942F2a6833972C5Dc",
        IndaAdminRouter: "0x570309aCCd0182c12d59626C16788449421Ad1e0",
        CommitCampaign: "0xa3CD4445624949F0c7947430546aF9BbbC65DF3e",
        indahouseRegistry: "0x8F25c386bDF74F2e0190E8eC31bf0D40c7058b94"
    }
} as const;

export const DEFAULT_CHAIN_ID = 80002; // Polygon Amoy
