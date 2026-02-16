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
    // deployment-docs (Amoy 80002, CO)
    polygonAmoy: {
        indaRoot: "0x107291f56Fb6EeDB9FE78D0A39b6009C9A7EC214",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0x07E7a3F6c2ed35ba77e32a1c02edd6c4131C483a",
        indaProperties: "0x2Fb5632a92F899682442f244B7A89c9E6c6CCec2",
        landOwner: "0x0000000000000000000000000000000000000000",
        adminAddress: "0x18baA4B46C67De50a34684562C978dcD213CbF2a",
        indaAdmin: "0x18baA4B46C67De50a34684562C978dcD213CbF2a",
        indaLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        capitalGainsVault: "0xA0dFdDf152f28cAaF2585EA642Cfe83102C20D8E",
        router: "0x6fDA9ef9BbB46dc5d1e08a5dED4F5f6880F6CB32",
        rentVault: "0xA0dFdDf152f28cAaF2585EA642Cfe83102C20D8E",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        commitFactory: "0x89d9e42FF264AcE25f702e6341bf0dB74113F446",
        tokenFactory: "0xbe0611f08bB481f3394C0eC32a0e9c6b83a59B2e",
        distributorProxy: "0x5039053A4038BE5550b4379c58df7F2FEf23D3A1",
        manager: "0x1C00Abc7938251e72b3807e5f5285422a8F660C0",
        PropertyRegistry: "0xf316Da735789F90A4BeFE89193a11d76eB9EB99C",
        IndaAdminRouter: "0xB81360FF45112a18e9507DAA5349684BB5f99323",
        CommitCampaign: "0xCd9Da0a17Da274ae3438F67cAF1cbD06a785C98d",
        indahouseRegistry: "0x2C492144dc424B0172eDb97E90b4E4cC8B1c4ed9"
    }
} as const;

export const DEFAULT_CHAIN_ID = 80002; // Polygon Amoy
