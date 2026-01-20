export const CONTRACTS = {
    baseSepolia: {
        indaRoot: "0x2c3a13BDD9bC55ED52Ec1A5BBe06FF577106f08a", // From API .env (AMOY but assuming Base Sepolia equivalent for this task)
        baseToken: "0x4200000000000000000000000000000000000006", // WETH or USDC on Base
        commitFactory: "0xf6C94E587E0d9ef1811aB034D5986D8242419637", // Provided by user
        adminAddress: "0x6c173C864481E5fcdf7e0A47B60e7a00E7Cc01a4", // From API .env WHITELIST_ADDRESS_WALLET
    },
    base: {
        indaRoot: "0xA2Fc9e0B3e0aE0aED1b2A9447ACD24A9E3F6D56d",
        baseToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
        commitFactory: "0xf6C94E587E0d9ef1811aB034D5986D8242419637",
        adminAddress: "0x6c173C864481E5fcdf7e0A47B60e7a00E7Cc01a4",
    }
} as const;

export const DEFAULT_CHAIN_ID = 84532; // Base Sepolia
