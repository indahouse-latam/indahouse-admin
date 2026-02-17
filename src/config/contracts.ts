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
    // deployment-docs (Amoy 80002, CO) – .deployment_state.json
    polygonAmoy: {
        indaRoot: "0xfA13d6d3a0258F9E398D49CCBABB3151d907B58A",
        baseToken: "0x6C9A47762AAE694067903F4A7aB65E074488c625", // COPS/USDC on Amoy Testnet
        cops: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        usdc: "0x6C9A47762AAE694067903F4A7aB65E074488c625",
        InDH: "0xfFb19B985B0C0700EB5733a2c35eafaf8D696C6c",
        indaProperties: "0x4126Bb6dA5C8216CA29cD2D8e1b6D7203C8e3866",
        landOwner: "0x0000000000000000000000000000000000000000",
        adminAddress: "0xE4AfA22d661556e3eB5eC86b8670FF0249223D09",
        indaAdmin: "0xE4AfA22d661556e3eB5eC86b8670FF0249223D09",
        indaLock: "0x56e8F6A9C851c7E86469d0a44A47b0f683d0d9fa",
        capitalGainsVault: "0xc60fE958571Cc4B70612c9F44CCd647f23592472",
        router: "0x1D337f50789e2626408d78B57d09f7bd314B3749",
        rentVault: "0xc60fE958571Cc4B70612c9F44CCd647f23592472",
        sIndh: "0xd2e15302d122a5831beb044ac0894c9789c50cc6",
        commitFactory: "0x905751b0B0C8360970Ae6072410c621703Bbc6b2",
        tokenFactory: "0xe957Ab2DcB567C16d440219dCE9F76F57fD7771D",
        distributorProxy: "0xB64F68D327a59a292Cac2309c630B8938066595C",
        manager: "0x85249cB6f1982C85CB59D266Da280c6b287a1B49",
        PropertyRegistry: "0x1b7245692B6d8Da711Ff2Aee8e22E800B6d06FA7",
        IndaAdminRouter: "0xE905303aB4ba61cD7646b4bFe47830c70cCA02E7",
        CommitCampaign: "0xEdC480Ad7fed560094E400D01632aAC32fdEb372",
        indahouseRegistry: "0x703CE69d61D9A043803276981e9AA9Fce5908516"
    }
} as const;

export const DEFAULT_CHAIN_ID = 80002; // Polygon Amoy
