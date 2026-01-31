export const IndaRootAbi = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "DEFAULT_ADMIN_ROLE",
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
        "name": "DENOMINATOR",
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
        "name": "_fractionalize",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "pricePerToken",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "totalSupply",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "saleStartDate",
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
    {
        "type": "function",
        "name": "_setPricePerProperty",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_newPrice",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "_setToWhitelist",
        "inputs": [
            {
                "name": "_addresses",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "_statuses",
                "type": "bool[]",
                "internalType": "bool[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "_setUsersLoyalties",
        "inputs": [
            {
                "name": "_addresses",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "_levels",
                "type": "uint8[]",
                "internalType": "enum LoyaltyLevels[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "acceptDefaultAdminTransfer",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "approveContract",
        "inputs": [
            {
                "name": "spender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "baseToken",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IERC20Metadata"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "beginDefaultAdminTransfer",
        "inputs": [
            {
                "name": "newAdmin",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "buyINDHWithBase",
        "inputs": [
            {
                "name": "data",
                "type": "tuple",
                "internalType": "struct DirectPurchaseData",
                "components": [
                    {
                        "name": "userEOA",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "userCMD",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "individualToken",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "poolToken",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "usdcAmount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "poolPercentage",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "countryCode",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "individualBought",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "poolBought",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "cancelDefaultAdminTransfer",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "changeDefaultAdminDelay",
        "inputs": [
            {
                "name": "newDelay",
                "type": "uint48",
                "internalType": "uint48"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "completeBuyoutAndReactivate",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_buyerEOA",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "createPoolToken",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "name",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "symbol",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "poolDistributor",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_baseToken",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "defaultAdmin",
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
        "name": "defaultAdminDelay",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint48",
                "internalType": "uint48"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "defaultAdminDelayIncreaseWait",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint48",
                "internalType": "uint48"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "depositRentForProperty",
        "inputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "totalRentAmount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getRoleAdmin",
        "inputs": [
            {
                "name": "role",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
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
        "name": "grantRole",
        "inputs": [
            {
                "name": "role",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "grantRoleOnExternalContract",
        "inputs": [
            {
                "name": "target",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "role",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "hasRole",
        "inputs": [
            {
                "name": "role",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "account",
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
        "name": "indaAdmin",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IndaAdminInterface"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "initialize",
        "inputs": [
            {
                "name": "_base",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_NFTContract",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_indaAdmin",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_registry",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_tokenFactory",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_baseURI",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "initiateBuyout",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_buyer",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_offerPricePerToken",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "tokensToMint",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "loyaltyLevel",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "loyalty",
                "type": "uint8",
                "internalType": "enum LoyaltyLevels"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "mintINDHWithBase",
        "inputs": [
            {
                "name": "investments",
                "type": "tuple[]",
                "internalType": "struct InvestmentData[]",
                "components": [
                    {
                        "name": "userEOA",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "userCMD",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "individualToken",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "poolToken",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "usdcAmount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "poolPercentage",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "countryCode",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "feePercentage",
                        "type": "uint16",
                        "internalType": "uint16"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "totalMinted",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "poolCollateral",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "individualTokens",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "owner",
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
        "name": "pauseToken",
        "inputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "paused",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "pendingDefaultAdmin",
        "inputs": [],
        "outputs": [
            {
                "name": "newAdmin",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "schedule",
                "type": "uint48",
                "internalType": "uint48"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "pendingDefaultAdminDelay",
        "inputs": [],
        "outputs": [
            {
                "name": "newDelay",
                "type": "uint48",
                "internalType": "uint48"
            },
            {
                "name": "schedule",
                "type": "uint48",
                "internalType": "uint48"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "propertyRegistry",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IPropertyRegistry"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "redeemBuyoutTokens",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_holder",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_recipient",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "usdcAmount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "registry",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IIndahouseRegistry"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "renounceRole",
        "inputs": [
            {
                "name": "role",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "retireProperty",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_ownerEOA",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "revokeRole",
        "inputs": [
            {
                "name": "role",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "rollbackDefaultAdminDelay",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "sellINDH",
        "inputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "sellINDHWithPermit",
        "inputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_deadline",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_v",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "_r",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "_s",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setPropertyRegistry",
        "inputs": [
            {
                "name": "_propertyRegistry",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "subscribe",
        "inputs": [
            {
                "name": "_referrer",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "subscriptions",
        "inputs": [
            {
                "name": "subscriber",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "registrationDate",
                "type": "uint96",
                "internalType": "uint96"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "inputs": [
            {
                "name": "interfaceId",
                "type": "bytes4",
                "internalType": "bytes4"
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
        "name": "tokenFactory",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract TokenFactory"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "whitelist",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "isWhitelisted",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "whitelistForBuyout",
        "inputs": [
            {
                "name": "_tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_account",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_status",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdrawUSDC",
        "inputs": [
            {
                "name": "recipient",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "BatchInvestmentExecuted",
        "inputs": [
            {
                "name": "totalInvestments",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "totalMinted",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "DefaultAdminDelayChangeCanceled",
        "inputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "DefaultAdminDelayChangeScheduled",
        "inputs": [
            {
                "name": "newDelay",
                "type": "uint48",
                "indexed": false,
                "internalType": "uint48"
            },
            {
                "name": "effectSchedule",
                "type": "uint48",
                "indexed": false,
                "internalType": "uint48"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "DefaultAdminTransferCanceled",
        "inputs": [],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "DefaultAdminTransferScheduled",
        "inputs": [
            {
                "name": "newAdmin",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "acceptSchedule",
                "type": "uint48",
                "indexed": false,
                "internalType": "uint48"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "INDHPurchased",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "dest",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "executer",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amountInUSD",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "amountInINDH",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "INDHSold",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "dest",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amountTokensSold",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "amountBaseToken",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Initialized",
        "inputs": [
            {
                "name": "version",
                "type": "uint64",
                "indexed": false,
                "internalType": "uint64"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "NewPropertyAdded",
        "inputs": [
            {
                "name": "id",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
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
        "name": "PoolSplitCalculated",
        "inputs": [
            {
                "name": "poolCollateral",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "individualTokens",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PropertyBought",
        "inputs": [
            {
                "name": "id",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "buyer",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PropertyBoughtOut",
        "inputs": [
            {
                "name": "propertyId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "buyer",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "pricePerToken",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "totalValue",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PropertyValidated",
        "inputs": [
            {
                "name": "propertyId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "individualToken",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoleAdminChanged",
        "inputs": [
            {
                "name": "role",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "previousAdminRole",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "newAdminRole",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoleGranted",
        "inputs": [
            {
                "name": "role",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "sender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RoleRevoked",
        "inputs": [
            {
                "name": "role",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "sender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SetPrice",
        "inputs": [
            {
                "name": "oldPrice",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "newPrice",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "id",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SetRent",
        "inputs": [
            {
                "name": "id",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "oldRent",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "newRent",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Subscribed",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "referrer",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TokensToBuyCalculated",
        "inputs": [
            {
                "name": "tokensToBuy",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "USDCWithdrawn",
        "inputs": [
            {
                "name": "recipient",
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
        "name": "loyaltiesModified",
        "inputs": [
            {
                "name": "addresses",
                "type": "address[]",
                "indexed": false,
                "internalType": "address[]"
            },
            {
                "name": "levels",
                "type": "uint8[]",
                "indexed": false,
                "internalType": "enum LoyaltyLevels[]"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "whitelistModified",
        "inputs": [
            {
                "name": "addresses",
                "type": "address[]",
                "indexed": false,
                "internalType": "address[]"
            },
            {
                "name": "statuses",
                "type": "bool[]",
                "indexed": false,
                "internalType": "bool[]"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "AccessControlBadConfirmation",
        "inputs": []
    },
    {
        "type": "error",
        "name": "AccessControlEnforcedDefaultAdminDelay",
        "inputs": [
            {
                "name": "schedule",
                "type": "uint48",
                "internalType": "uint48"
            }
        ]
    },
    {
        "type": "error",
        "name": "AccessControlEnforcedDefaultAdminRules",
        "inputs": []
    },
    {
        "type": "error",
        "name": "AccessControlInvalidDefaultAdmin",
        "inputs": [
            {
                "name": "defaultAdmin",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "AccessControlUnauthorizedAccount",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "neededRole",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ]
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
        "name": "CannotChangeYet",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CannotSubscribeToYourself",
        "inputs": []
    },
    {
        "type": "error",
        "name": "DistributorOperationFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "FailedCall",
        "inputs": []
    },
    {
        "type": "error",
        "name": "IncorrectAmount",
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
        "name": "InsufficientLiquidity",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidInitialization",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoTokensToStream",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolVaultOperationFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PriceNotSet",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PropertyHasIndividualHolders",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PropertyNotActive",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PropertyNotActive",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ReentrancyGuardReentrantCall",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ReferrerNotWhitelisted",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SafeCastOverflowedUintDowncast",
        "inputs": [
            {
                "name": "bits",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
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
        "name": "SaleIsNotActive",
        "inputs": []
    },
    {
        "type": "error",
        "name": "StreamStillActive",
        "inputs": []
    },
    {
        "type": "error",
        "name": "TokenDecimalsMismatch",
        "inputs": []
    },
    {
        "type": "error",
        "name": "Unauthorized",
        "inputs": []
    }
]
