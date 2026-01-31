export const PoolVaultAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_poolToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_poolDistributor",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_manager",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "MAX_BATCH_SIZE_VAULT",
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
        "name": "buyoutTimestamp",
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
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "buyoutUsdcBalance",
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
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "claimAllAndRedistribute",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "claimAndRedistribute",
        "inputs": [
            {
                "name": "_individualToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_distributorAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "claimBatchAndRedistribute",
        "inputs": [
            {
                "name": "start",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "count",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "claimSpecificTokensAndRedistribute",
        "inputs": [
            {
                "name": "tokens",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "distributors",
                "type": "address[]",
                "internalType": "address[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "collateral",
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
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "collateralTokens",
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
        "name": "countryCode",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPoolTokenPrice",
        "inputs": [],
        "outputs": [
            {
                "name": "price",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPoolTokenValue",
        "inputs": [
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "usdcValue",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isCollateralToken",
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
        "name": "manager",
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
        "name": "poolDistributor",
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
        "name": "poolToken",
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
        "name": "propertyTokensBurned",
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
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "propertyUsdcProceeds",
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
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "receiveCollateral",
        "inputs": [
            {
                "name": "_individualToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "receivePropertySaleProceeds",
        "inputs": [
            {
                "name": "_individualToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_tokenAmount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_usdcAmount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "sellTokensToVaultAfterTimeout",
        "inputs": [
            {
                "name": "_token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_tokenAmount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "usdcReceived",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setRedemptionTimeout",
        "inputs": [
            {
                "name": "_days",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "swapPoolTokensForPropertyProceeds",
        "inputs": [
            {
                "name": "_individualToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_poolTokensToSwap",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "usdcReceived",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "usdcRedemptionTimeout",
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
        "type": "event",
        "name": "CollateralReceived",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "totalBalance",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PoolTokensRedeemedForUsdc",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "poolTokensBurned",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "usdcReceived",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PoolTokensSwappedForUsdc",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "poolTokensBurned",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "usdcReceived",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "property",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PropertyBuyoutProceedsReceived",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "tokensBurned",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "usdcReceived",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PropertySaleProceedsReceived",
        "inputs": [
            {
                "name": "property",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "usdcAmount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "tokensBurned",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RedemptionTimeoutUpdated",
        "inputs": [
            {
                "name": "newTimeoutDays",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RewardsClaimed",
        "inputs": [
            {
                "name": "fromDistributor",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "token",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RewardsDistributedToPool",
        "inputs": [
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TokensSoldToVault",
        "inputs": [
            {
                "name": "seller",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "token",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "tokenAmount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "usdcReceived",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "AddressEmptyCode",
        "inputs": [
            {
                "name": "target",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ArrayLengthMismatch",
        "inputs": []
    },
    {
        "type": "error",
        "name": "FailedCall",
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
        "name": "NoCollateral",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotCollateralToken",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyManager",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ReentrancyGuardReentrantCall",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SafeERC20FailedOperation",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ZeroAmount",
        "inputs": []
    }
] as const;
