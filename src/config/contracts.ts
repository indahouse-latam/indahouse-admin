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
        indaRoot: "0xE1F2742f86A4b49b34F954c3F96D298dca02eB0C",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0xb95cc5ee156c95d0a706f186718c146f2a3b2747",
        indaProperties: "0xf057885289b816B4c1e7335D638Af03940708791",
        landOwner: "0x785072e12585dac0fc1543b45c67826e8d5f8f7e",
        adminAddress: "0x8BF99a1B2725bfb4D018e145967A7300a088A7a7",
        indaAdmin: "0x8BF99a1B2725bfb4D018e145967A7300a088A7a7",
        indaLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        capitalGainsVault: "0x5fcf26c62f6c7964cb08240e9cc4fb21ea38c183",
        rentVault: "0x1a68Df55B5DdE8541146651AE17F757F6CE83462",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        propertyCampaignFactory: "0x955422E26086F456C9Cb21038dC31C9583bE1d7A",
        commitFactory: "0xc049A4a89f3614a98E4F1295bdC5c39A1566e6d9",
        propertyCommitFactory: "0xc049A4a89f3614a98E4F1295bdC5c39A1566e6d9",
        tokenFactory: "0x9B7b22Cf5Bf1BbbB5D958534339c1c72D95eC9D7",
        distributorProxy: "0xe7A2cC2f4da50054D80Db0E10e34652B9fb2Fb3C",
    }
} as const;

export const DEFAULT_CHAIN_ID = 80002; // Polygon Amoy
