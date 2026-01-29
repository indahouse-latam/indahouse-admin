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
        indaRoot: "0x79A6c92f15839951E076c1551c5b41C1b7B0A2B7",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0xb95cc5ee156c95d0a706f186718c146f2a3b2747",
        indaProperties: "0x5ADF7440Fc60208A2165Ee80D27F76e0AD232121",
        landOwner: "0x785072e12585dac0fc1543b45c67826e8d5f8f7e",
        adminAddress: "0x8BF99a1B2725bfb4D018e145967A7300a088A7a7",
        indaAdmin: "0xD92f79093027d15A73614ad6CE4Bd89e0bd4db7a",
        indaLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        capitalGainsVault: "0x5fcf26c62f6c7964cb08240e9cc4fb21ea38c183",
        rentVault: "0x1a68Df55B5DdE85451146651AE17F757F6CE83462",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        commitFactory: "0xF0fc3C0750BC753Be00b541B89d830c5A705115F",
        tokenFactory: "0x4c7D5f5EEA569dD4294f1A6bc4383528F3f362A4",
        distributorProxy: "0x1cf0c2BFfe2d20bb599eBa0C308D5AD1C6e1474B", // indaDistributorProxy
        manager: "0xcF5a5AbA4F6ec867ECB0BDC227A713a46E71019f",
        PropertyRegistry : "0x02f1f68a6154999366D7B9B42B7D54AA8654eD23",
        IndaAdminRouter : "0x259b85d918603E9272f02feb4c29E849d0EE4C21",
        CommitCampaign: "0x30d8aBFaB17DCb0A8265c701bb9CfbaB00B34a38",
    }
} as const;

export const DEFAULT_CHAIN_ID = 80002; // Polygon Amoy
