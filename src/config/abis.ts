export const CommitCampaignAbi = [
    {
        "inputs": [],
        "name": "finalizeCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "terminated",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "propertyToken",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "underlyingToken",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export const IndaRootAbi = [
    {
        "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
        "name": "isWhitelisted",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "type": "function",
        "name": "_fractionalize",
        "inputs": [
            {
                "name": "_price",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_saleStartDate",
                "type": "uint64",
                "internalType": "uint64"
            }
        ],
        "outputs": [
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
] as const;

export const MembershipCertificateAbi = [
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export const PoolFactoryAbi = [
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "allPools",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export const PoolVaultAbi = [
    {
        "inputs": [],
        "name": "totalAssets",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;




export const TokenFactoryAbi = [
    { 
        "type": "function",
        "name": "createToken",
        "inputs": [
            {
                "name": "owner", // indaRoot
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "distributor", // distributorProxy
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "name", // nombre del token
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "symbol", // IDNHW-01
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "baseToken", // USDC baseToken
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "token",
                "type": "address", // address token -> 
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "TokenCreated",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "owner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "distributor",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "name",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            },
            {
                "name": "symbol",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            }
        ],
        "anonymous": false
    }
]


export const CommitCampaignFactoryAbi =  [
        {
            "type": "constructor",
            "inputs": [
                {
                    "name": "_campaignImplementation",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "_admin",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "admin",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "campaignImplementation",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "campaignRegistry",
            "inputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "campaigns",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "createCampaign",
            "inputs": [
                {
                    "name": "initData",
                    "type": "bytes",
                    "internalType": "bytes"
                }
            ],
            "outputs": [
                {
                    "name": "campaign",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "getCampaignCount",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getCampaigns",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address[]",
                    "internalType": "address[]"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "isCampaign",
            "inputs": [
                {
                    "name": "campaign",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "setCampaignImplementation",
            "inputs": [
                {
                    "name": "newImplementation",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "CampaignCreated",
            "inputs": [
                {
                    "name": "campaign",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "owner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "campaignId",
                    "type": "uint256",
                    "indexed": true,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "CampaignImplementationUpdated",
            "inputs": [
                {
                    "name": "oldImplementation",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "newImplementation",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "CampaignNotFound",
            "inputs": []
        },
        {
            "type": "error",
            "name": "FailedDeployment",
            "inputs": []
        },
        {
            "type": "error",
            "name": "InsufficientBalance",
            "inputs": [
                {
                    "name": "balance",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "needed",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ]
        },
        {
            "type": "error",
            "name": "Unauthorized",
            "inputs": []
        },
        {
            "type": "error",
            "name": "ZeroAddress",
            "inputs": []
        }
    ]