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
        indaRoot: "0xd95f8793Bf37dA1971E980A836021b4719418fD8",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0xb95cc5ee156c95d0a706f186718c146f2a3b2747",
        indaProperties: "0x5cA7F0CfeCc0c657925D780f95A18582495074b4",
        landOwner: "0x785072e12585dac0fc1543b45c67826e8d5f8f7e",
        adminAddress: "0x8BF99a1B2725bfb4D018e145967A7300a088A7a7",
        indaAdmin: "0xab006368DF00f110c0c00C0b6F2E5A86612c00bc",
        indaLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        capitalGainsVault: "0x5fcf26c62f6c7964cb08240e9cc4fb21ea38c183",
        router:"0xa8b1616D2bfb9AFB163fc94a26708A3E27D28790",
        rentVault: "0x1a68Df55B5DdE85451146651AE17F757F6CE83462",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        commitFactory: "0xBEa105e88a8a6bC20F3EF5dbD55e6280292d959a",
        tokenFactory: "0x63370230128509ae9e2CE28C2F11a41EDc84fB6d",
        distributorProxy: "0x7BA3F5d02728939945Db8feb0bCaA73f02198Dac", // indaDistributorProxy
        manager: "0xE4ccc06D6f80F64557Ed1D5Fa8D911521D3deAbC",
        PropertyRegistry : "0x7af5a48EfA9ECE2c69a9Cd350ea65673f94BC5DC",
        IndaAdminRouter : "0xF7D1e545461d7a2414BF047B0AA642d603b99763",
        CommitCampaign: "0xf454FA1Bbbe80d0437D7280BE1e4E1Fc79a59cb5",
        indahouseRegistry: "0xb81F77d52DD20B66Ae60581571D3Eb4803aE95e6"
    }
} as const;

export const DEFAULT_CHAIN_ID = 80002; // Polygon Amoy
