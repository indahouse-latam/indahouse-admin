export const CommitCampaignAbi = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "nonpayable"
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
        "name": "MAX_FEE_TIERS",
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
        "name": "approveFunds",
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
                "internalType": "contract IERC20"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "campaignOwner",
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
        "name": "campaignType",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint8",
                "internalType": "enum CommitCampaignInterface.CampaignType"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "cancelCampaign",
        "inputs": [
            {
                "name": "reason",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "claim",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "claimed",
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
        "name": "commit",
        "inputs": [
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "poolPercentage",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "commitDeadline",
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
        "name": "committed",
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
        "name": "emergencyWithdraw",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "recipient",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "executeAfter",
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
        "name": "executed",
        "inputs": [],
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
        "name": "feeTiers",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "endTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "feeBP",
                "type": "uint16",
                "internalType": "uint16"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "finalizeAndExecute",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getCurrentFeeBP",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint16",
                "internalType": "uint16"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getFeeTierCount",
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
        "name": "getFeeTiers",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct CommitCampaignInterface.FeeTier[]",
                "components": [
                    {
                        "name": "endTime",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "feeBP",
                        "type": "uint16",
                        "internalType": "uint16"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getInvestorCount",
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
        "name": "getInvestorInfo",
        "inputs": [
            {
                "name": "investor",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "commitAmount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "commitTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "feeBP",
                "type": "uint16",
                "internalType": "uint16"
            },
            {
                "name": "allocated",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "hasClaimed",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getInvestors",
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
        "name": "hasInvestor",
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
        "name": "indaRoot",
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
        "name": "initialize",
        "inputs": [
            {
                "name": "_indaRoot",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_baseToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_campaignOwner",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_campaignType",
                "type": "uint8",
                "internalType": "enum CommitCampaignInterface.CampaignType"
            },
            {
                "name": "_targetToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_startTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_commitDeadline",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_executeAfter",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_minCap",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_maxCap",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_feeTiers",
                "type": "tuple[]",
                "internalType": "struct CommitCampaignInterface.FeeTier[]",
                "components": [
                    {
                        "name": "endTime",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "feeBP",
                        "type": "uint16",
                        "internalType": "uint16"
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "investorCommitTime",
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
        "name": "investorFeeBP",
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
                "type": "uint16",
                "internalType": "uint16"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "investorPoolPercentage",
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
        "name": "investors",
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
        "name": "maxCap",
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
        "name": "minCap",
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
        "name": "pause",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "paused",
        "inputs": [],
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
        "name": "recoverERC20",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
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
        "type": "function",
        "name": "refund",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "startTime",
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
        "name": "status",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint8",
                "internalType": "enum CommitCampaignInterface.CampaignStatus"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "targetToken",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IERC20"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalCommitted",
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
        "name": "totalFees",
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
        "name": "totalTargetTokenReceived",
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
        "name": "unpause",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdrawCommit",
        "inputs": [
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
        "name": "CampaignCancelled",
        "inputs": [
            {
                "name": "reason",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "CampaignFinalized",
        "inputs": [
            {
                "name": "totalCommitted",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "totalTargetTokenReceived",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "totalFeeAmount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Claimed",
        "inputs": [
            {
                "name": "investor",
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
        "name": "Committed",
        "inputs": [
            {
                "name": "investor",
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
                "name": "totalCommitted",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "feeBP",
                "type": "uint16",
                "indexed": false,
                "internalType": "uint16"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "EmergencyWithdraw",
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
                "name": "recipient",
                "type": "address",
                "indexed": true,
                "internalType": "address"
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
        "name": "Paused",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Refunded",
        "inputs": [
            {
                "name": "investor",
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
        "name": "TargetTokenAllocated",
        "inputs": [
            {
                "name": "investor",
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
        "name": "Unpaused",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WithdrawnCommit",
        "inputs": [
            {
                "name": "investor",
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
                "name": "remainingCommitment",
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
        "name": "AlreadyClaimed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CampaignAlreadyExecuted",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CampaignNotActive",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CampaignNotCancelled",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CampaignNotExecuted",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CommitDeadlineNotReached",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CommitDeadlinePassed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "EnforcedPause",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ExecuteTimeNotReached",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ExpectedPause",
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
        "name": "InsufficientCommitment",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidConfiguration",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidInitialization",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MaxCapExceeded",
        "inputs": []
    },
    {
        "type": "error",
        "name": "MinCapNotReached",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NothingToClaim",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PriceNotConfigured",
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
        "name": "Unauthorized",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ZeroAddress",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ZeroAmount",
        "inputs": []
    }
] as const;

export const IndaRootAbi = [
    {
        type: "constructor",
        inputs: [
            {
                name: "_saleTime",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "DEFAULT_ADMIN_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "DENOMINATOR",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "LAND_OWNER_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "PAUSER_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "PROPERTIES_MANAGER_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "USERS_MANAGER_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "_approveTokenization",
        inputs: [
            {
                name: "_requestId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_landOwner",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_cancelTokenization",
        inputs: [
            {
                name: "_requestId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_fractionalize",
        inputs: [
            {
                name: "_price",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_saleStartDate",
                type: "uint64",
                internalType: "uint64"
            }
        ],
        outputs: [
            {
                name: "tokenId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_fractionalizeWithRecipient",
        inputs: [
            {
                name: "_price",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_to",
                type: "address",
                internalType: "address"
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_saleStartDate",
                type: "uint64",
                internalType: "uint64"
            }
        ],
        outputs: [
            {
                name: "tokenId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_grantLandOwnerRole",
        inputs: [
            {
                name: "_addresses",
                type: "address[]",
                internalType: "address[]"
            },
            {
                name: "_statuses",
                type: "bool[]",
                internalType: "bool[]"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_rejectTokenization",
        inputs: [
            {
                name: "_requestId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_landOwner",
                type: "address",
                internalType: "address"
            },
            {
                name: "_reason",
                type: "string",
                internalType: "string"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_requestTokenization",
        inputs: [
            {
                name: "_projectName",
                type: "string",
                internalType: "string"
            },
            {
                name: "_askPrice",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_saleDelay",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "requestId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_retireProperty",
        inputs: [
            {
                name: "_id",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_salePrice",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_setINDHPauseStatus",
        inputs: [
            {
                name: "_status",
                type: "bool",
                internalType: "bool"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_setLandOwnersTiers",
        inputs: [
            {
                name: "_addresses",
                type: "address[]",
                internalType: "address[]"
            },
            {
                name: "_tiers",
                type: "uint8[]",
                internalType: "enum BonusTiers[]"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_setPricePerProperty",
        inputs: [
            {
                name: "_id",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_newPrice",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_setRentPerProperty",
        inputs: [
            {
                name: "_id",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_newRentValue",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_setToWhitelist",
        inputs: [
            {
                name: "_addresses",
                type: "address[]",
                internalType: "address[]"
            },
            {
                name: "_statuses",
                type: "bool[]",
                internalType: "bool[]"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "_setUsersLoyalties",
        inputs: [
            {
                name: "_addresses",
                type: "address[]",
                internalType: "address[]"
            },
            {
                name: "_levels",
                type: "uint8[]",
                internalType: "enum LoyaltyLevels[]"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "acceptDefaultAdminTransfer",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "beginDefaultAdminTransfer",
        inputs: [
            {
                name: "newAdmin",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "buyINDHWithBase",
        inputs: [
            {
                name: "_to",
                type: "address",
                internalType: "address"
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_fallbackLiquidity",
                type: "address[]",
                internalType: "address[]"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "buyProperty",
        inputs: [
            {
                name: "_id",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_withdrawFirst",
                type: "bool",
                internalType: "bool"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "cancelDefaultAdminTransfer",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "changeDefaultAdminDelay",
        inputs: [
            {
                name: "newDelay",
                type: "uint48",
                internalType: "uint48"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "defaultAdmin",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "defaultAdminDelay",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint48",
                internalType: "uint48"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "defaultAdminDelayIncreaseWait",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint48",
                internalType: "uint48"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getBaseToken",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getRoleAdmin",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "grantRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "hasRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "indahouseProperties",
        inputs: [
            {
                name: "propertyId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "uri",
                type: "string",
                internalType: "string"
            },
            {
                name: "mintedINDH",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "salePrice",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "rentPrice",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "acquisitionDate",
                type: "uint64",
                internalType: "uint64"
            },
            {
                name: "saleStartDate",
                type: "uint64",
                internalType: "uint64"
            },
            {
                name: "propertySoldDate",
                type: "uint120",
                internalType: "uint120"
            },
            {
                name: "isActive",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "initializeStorage",
        inputs: [
            {
                name: "_base",
                type: "address",
                internalType: "address"
            },
            {
                name: "_INDHToken",
                type: "address",
                internalType: "address"
            },
            {
                name: "_sINDHToken",
                type: "address",
                internalType: "address"
            },
            {
                name: "_NFTContract",
                type: "address",
                internalType: "address"
            },
            {
                name: "_indaAdmin",
                type: "address",
                internalType: "address"
            },
            {
                name: "_rentVault",
                type: "address",
                internalType: "address"
            },
            {
                name: "_capitalsGainsVault",
                type: "address",
                internalType: "address"
            },
            {
                name: "_indaLock",
                type: "address",
                internalType: "address"
            },
            {
                name: "_baseURI",
                type: "string",
                internalType: "string"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "joinLandOwner",
        inputs: [
            {
                name: "_newLandOwner",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "landOwnerByUser",
        inputs: [
            {
                name: "user",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "account",
                type: "address",
                internalType: "address"
            },
            {
                name: "registrationDate",
                type: "uint96",
                internalType: "uint96"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "loyaltyLevel",
        inputs: [
            {
                name: "user",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "loyalty",
                type: "uint8",
                internalType: "enum LoyaltyLevels"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "numberOfRequestsPerLandOwner",
        inputs: [
            {
                name: "landOwnerAddress",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "numberOfRequests",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "pendingDefaultAdmin",
        inputs: [],
        outputs: [
            {
                name: "newAdmin",
                type: "address",
                internalType: "address"
            },
            {
                name: "schedule",
                type: "uint48",
                internalType: "uint48"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "pendingDefaultAdminDelay",
        inputs: [],
        outputs: [
            {
                name: "newDelay",
                type: "uint48",
                internalType: "uint48"
            },
            {
                name: "schedule",
                type: "uint48",
                internalType: "uint48"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "renounceRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "revokeRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "rollbackDefaultAdminDelay",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "saleTime",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "sellINDH",
        inputs: [
            {
                name: "_to",
                type: "address",
                internalType: "address"
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_withdrawFirst",
                type: "bool",
                internalType: "bool"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "sellINDHWithPermit",
        inputs: [
            {
                name: "_to",
                type: "address",
                internalType: "address"
            },
            {
                name: "_amount",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_withdrawFirst",
                type: "bool",
                internalType: "bool"
            },
            {
                name: "_deadline",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_v",
                type: "uint8",
                internalType: "uint8"
            },
            {
                name: "_r",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "_s",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "subscribe",
        inputs: [
            {
                name: "_referrer",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "subscriptions",
        inputs: [
            {
                name: "subscriber",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "account",
                type: "address",
                internalType: "address"
            },
            {
                name: "registrationDate",
                type: "uint96",
                internalType: "uint96"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "supportsInterface",
        inputs: [
            {
                name: "interfaceId",
                type: "bytes4",
                internalType: "bytes4"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "tierByLandOwner",
        inputs: [
            {
                name: "landOwnerAddress",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "tier",
                type: "uint8",
                internalType: "enum BonusTiers"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "tokenizationRequests",
        inputs: [
            {
                name: "landOwnerAddress",
                type: "address",
                internalType: "address"
            },
            {
                name: "id",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "projectName",
                type: "string",
                internalType: "string"
            },
            {
                name: "askPrice",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "requestDate",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "approvalDate",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "saleDelay",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "status",
                type: "uint8",
                internalType: "enum TokenizationRequestStatus"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "totalMonthlyRent",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "whitelist",
        inputs: [
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "isWhitelisted",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "event",
        name: "DefaultAdminDelayChangeCanceled",
        inputs: [],
        anonymous: false
    },
    {
        type: "event",
        name: "DefaultAdminDelayChangeScheduled",
        inputs: [
            {
                name: "newDelay",
                type: "uint48",
                indexed: false,
                internalType: "uint48"
            },
            {
                name: "effectSchedule",
                type: "uint48",
                indexed: false,
                internalType: "uint48"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "DefaultAdminTransferCanceled",
        inputs: [],
        anonymous: false
    },
    {
        type: "event",
        name: "DefaultAdminTransferScheduled",
        inputs: [
            {
                name: "newAdmin",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "acceptSchedule",
                type: "uint48",
                indexed: false,
                internalType: "uint48"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "INDHPurchased",
        inputs: [
            {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "dest",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "amountInUSD",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "amountInINDH",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "INDHSold",
        inputs: [
            {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "dest",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "amountTokensSold",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "amountBaseToken",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "Initialized",
        inputs: [
            {
                name: "version",
                type: "uint64",
                indexed: false,
                internalType: "uint64"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "NewPropertyAdded",
        inputs: [
            {
                name: "id",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "PropertyBought",
        inputs: [
            {
                name: "id",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "buyer",
                type: "address",
                indexed: false,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleAdminChanged",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "previousAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "newAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleGranted",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleRevoked",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "SetPrice",
        inputs: [
            {
                name: "oldPrice",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "newPrice",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "id",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "SetRent",
        inputs: [
            {
                name: "id",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            },
            {
                name: "oldRent",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "newRent",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "Subscribed",
        inputs: [
            {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "referrer",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "TiersModified",
        inputs: [
            {
                name: "addresses",
                type: "address[]",
                indexed: false,
                internalType: "address[]"
            },
            {
                name: "tiers",
                type: "uint8[]",
                indexed: false,
                internalType: "enum BonusTiers[]"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "TokenizationRequestApproved",
        inputs: [
            {
                name: "landOwner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "requestId",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "TokenizationRequestCanceled",
        inputs: [
            {
                name: "landOwner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "requestId",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "TokenizationRequestRejected",
        inputs: [
            {
                name: "landOwner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "requestId",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "reason",
                type: "string",
                indexed: false,
                internalType: "string"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "TokenizationRequested",
        inputs: [
            {
                name: "landOwner",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "requestId",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "UserJoinedLandOwner",
        inputs: [
            {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "landOwner",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "loyaltiesModified",
        inputs: [
            {
                name: "addresses",
                type: "address[]",
                indexed: false,
                internalType: "address[]"
            },
            {
                name: "levels",
                type: "uint8[]",
                indexed: false,
                internalType: "enum LoyaltyLevels[]"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "whitelistModified",
        inputs: [
            {
                name: "addresses",
                type: "address[]",
                indexed: false,
                internalType: "address[]"
            },
            {
                name: "statuses",
                type: "bool[]",
                indexed: false,
                internalType: "bool[]"
            }
        ],
        anonymous: false
    },
    {
        type: "error",
        name: "AccessControlBadConfirmation",
        inputs: []
    },
    {
        type: "error",
        name: "AccessControlEnforcedDefaultAdminDelay",
        inputs: [
            {
                name: "schedule",
                type: "uint48",
                internalType: "uint48"
            }
        ]
    },
    {
        type: "error",
        name: "AccessControlEnforcedDefaultAdminRules",
        inputs: []
    },
    {
        type: "error",
        name: "AccessControlInvalidDefaultAdmin",
        inputs: [
            {
                name: "defaultAdmin",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "AccessControlUnauthorizedAccount",
        inputs: [
            {
                name: "account",
                type: "address",
                internalType: "address"
            },
            {
                name: "neededRole",
                type: "bytes32",
                internalType: "bytes32"
            }
        ]
    },
    {
        type: "error",
        name: "AccountNotWhitelisted",
        inputs: []
    },
    {
        type: "error",
        name: "AddressEmptyCode",
        inputs: [
            {
                name: "target",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "CannotChangeYet",
        inputs: []
    },
    {
        type: "error",
        name: "CannotSubscribeToYourself",
        inputs: []
    },
    {
        type: "error",
        name: "FailedCall",
        inputs: []
    },
    {
        type: "error",
        name: "IncorrectAmount",
        inputs: []
    },
    {
        type: "error",
        name: "InsufficientBalance",
        inputs: [
            {
                name: "balance",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "needed",
                type: "uint256",
                internalType: "uint256"
            }
        ]
    },
    {
        type: "error",
        name: "InvalidInitialization",
        inputs: []
    },
    {
        type: "error",
        name: "InvalidSaleDelay",
        inputs: []
    },
    {
        type: "error",
        name: "LandOwnerNotActive",
        inputs: []
    },
    {
        type: "error",
        name: "NoTokensToStream",
        inputs: []
    },
    {
        type: "error",
        name: "NotEnoughINDH",
        inputs: []
    },
    {
        type: "error",
        name: "NotInitializing",
        inputs: []
    },
    {
        type: "error",
        name: "PropertyNotActive",
        inputs: []
    },
    {
        type: "error",
        name: "RequestNotAvailable",
        inputs: []
    },
    {
        type: "error",
        name: "SafeCastOverflowedUintDowncast",
        inputs: [
            {
                name: "bits",
                type: "uint8",
                internalType: "uint8"
            },
            {
                name: "value",
                type: "uint256",
                internalType: "uint256"
            }
        ]
    },
    {
        type: "error",
        name: "SafeERC20FailedOperation",
        inputs: [
            {
                name: "token",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "SaleIsNotActive",
        inputs: []
    },
    {
        type: "error",
        name: "StreamStillActive",
        inputs: []
    },
    {
        type: "error",
        name: "TokenDecimalsMismatch",
        inputs: []
    },
    {
        type: "error",
        name: "Unauthorized",
        inputs: []
    }
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


export const CommitCampaignFactoryAbi = [
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

export const ManagerFactoryAbi = [
    {
        "type": "constructor",
        "inputs": [],
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
        "name": "certificateFactory",
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
        "name": "certificatesList",
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
        "name": "createCertificate",
        "inputs": [
            {
                "name": "user",
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
        "name": "createPropertyGovernor",
        "inputs": [
            {
                "name": "_propertyId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_individualToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_guardian",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_config",
                "type": "tuple",
                "internalType": "struct IPropertyGovernor.GovernanceConfig",
                "components": [
                    {
                        "name": "votingDelay",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "votingPeriod",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "executionDelay",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "quorumPercentage",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "approvalThreshold",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "proposalThreshold",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
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
        "name": "getCertificatesCount",
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
        "name": "getIndividualTokensCount",
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
        "name": "getPoolInfo",
        "inputs": [],
        "outputs": [
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
                "name": "_poolVault",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_initialized",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "grantPriceManagerRole",
        "inputs": [
            {
                "name": "_account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "hasPriceManagerRole",
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
        "name": "indaRoot",
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
        "name": "individualTokenList",
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
        "name": "individualTokens",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "distributorAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "symbol",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "isActive",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "registeredAt",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "poolCollateralAmount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "originalPrice",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "salePrice",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "initialize",
        "inputs": [
            {
                "name": "_countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "_transactionRouter",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_admin",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_registry",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_poolFactory",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_certificateFactory",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_propertyGovernorFactory",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "initializePool",
        "inputs": [
            {
                "name": "baseToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_indaRoot",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
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
                "name": "_poolVault",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
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
        "name": "poolFactory",
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
        "name": "poolInitialized",
        "inputs": [],
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
        "name": "poolVault",
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
        "name": "propertyGovernorFactory",
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
        "name": "propertyGovernors",
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
        "name": "receiveCollateral",
        "inputs": [
            {
                "name": "individualToken",
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
        "name": "registerCampaign",
        "inputs": [
            {
                "name": "campaign",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "registerIndividualToken",
        "inputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "distributorAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "symbol",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "registeredCampaigns",
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
        "name": "registry",
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
        "name": "revokePriceManagerRole",
        "inputs": [
            {
                "name": "_account",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setSalePrice",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_salePrice",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transactionRouter",
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
        "name": "userCertificates",
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
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "CampaignRegistered",
        "inputs": [
            {
                "name": "campaign",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "CertificateCreated",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "certificate",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "CollateralAddedToPool",
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
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "IndividualTokenRegistered",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "symbol",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PoolInitialized",
        "inputs": [
            {
                "name": "poolToken",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "poolVault",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "poolDistributor",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PriceManagerRoleGranted",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PriceManagerRoleRevoked",
        "inputs": [
            {
                "name": "account",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PropertyGovernorCreated",
        "inputs": [
            {
                "name": "propertyId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "governor",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SalePriceUpdated",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "newPrice",
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
        "name": "CampaignAlreadyRegistered",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CertificateAlreadyExists",
        "inputs": []
    },
    {
        "type": "error",
        "name": "FailedCall",
        "inputs": []
    },
    {
        "type": "error",
        "name": "GovernorAlreadyExists",
        "inputs": []
    },
    {
        "type": "error",
        "name": "IndaRootMismatch",
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
        "name": "InvalidAddress",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidUser",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyAdmin",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyRegistry",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyRouter",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolAlreadyInitialized",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolNotInitialized",
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
        "name": "TokenAlreadyRegistered",
        "inputs": []
    },
    {
        "type": "error",
        "name": "TokenNotRegistered",
        "inputs": []
    }
]

export const Indadistributor = [
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
        "name": "GOVERNANCE_ROLE",
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
        "name": "INDA_ROOT_ROLE",
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
        "name": "NFTContract",
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
        "name": "PROPERTIES_MANAGER_ROLE",
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
        "name": "acceptDefaultAdminTransfer",
        "inputs": [],
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
                "name": "_buyerCMD",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
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
        "name": "fractionalize",
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
        "name": "getBuyoutCost",
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
                "name": "totalCost",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getProperty",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct Property",
                "components": [
                    {
                        "name": "tokenAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "countryCode",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "uri",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "mintedTokens",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "pricePerToken",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "acquisitionDate",
                        "type": "uint64",
                        "internalType": "uint64"
                    },
                    {
                        "name": "saleStartDate",
                        "type": "uint64",
                        "internalType": "uint64"
                    },
                    {
                        "name": "propertySoldDate",
                        "type": "uint120",
                        "internalType": "uint120"
                    },
                    {
                        "name": "status",
                        "type": "uint8",
                        "internalType": "enum PropertyStatus"
                    },
                    {
                        "name": "valuationPrice",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "redemptionPricePerToken",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "totalRedemptionPool",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPropertyIdByToken",
        "inputs": [
            {
                "name": "tokenAddress",
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
        "name": "grantIndaPropertiesRoles",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
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
        "name": "indaRoot",
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
        "name": "initialize",
        "inputs": [
            {
                "name": "_admin",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_nftContract",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_baseToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_registry",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_indaRoot",
                "type": "address",
                "internalType": "address"
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
        "name": "properties",
        "inputs": [
            {
                "name": "propertyId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "uri",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "mintedTokens",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "pricePerToken",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "acquisitionDate",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "saleStartDate",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "propertySoldDate",
                "type": "uint120",
                "internalType": "uint120"
            },
            {
                "name": "status",
                "type": "uint8",
                "internalType": "enum PropertyStatus"
            },
            {
                "name": "valuationPrice",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "redemptionPricePerToken",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "totalRedemptionPool",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "redeemTokensForUSDC",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
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
        "name": "registerProperty",
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
                "name": "_ownerCMD",
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
        "name": "setPricePerProperty",
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
        "name": "tokenToPropertyId",
        "inputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "propertyId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
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
                "name": "propertyId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "totalSupply",
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
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RentDeposited",
        "inputs": [
            {
                "name": "tokenAddress",
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
                "name": "propertyId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
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
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SetRent",
        "inputs": [
            {
                "name": "propertyId",
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
        "name": "DistributorNotFound",
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
        "name": "InvalidInitialization",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolVaultClaimFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolVaultOperationFailed",
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
        "name": "ReentrancyGuardReentrantCall",
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
    }
]
export const PropertyRegistryAbi = [
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
        "name": "GOVERNANCE_ROLE",
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
        "name": "INDA_ROOT_ROLE",
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
        "name": "NFTContract",
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
        "name": "PROPERTIES_MANAGER_ROLE",
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
        "name": "acceptDefaultAdminTransfer",
        "inputs": [],
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
                "name": "_buyerCMD",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
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
        "name": "fractionalize",
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
        "name": "getBuyoutCost",
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
                "name": "totalCost",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getProperty",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "tuple",
                "internalType": "struct Property",
                "components": [
                    {
                        "name": "tokenAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "countryCode",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "uri",
                        "type": "string",
                        "internalType": "string"
                    },
                    {
                        "name": "mintedTokens",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "pricePerToken",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "acquisitionDate",
                        "type": "uint64",
                        "internalType": "uint64"
                    },
                    {
                        "name": "saleStartDate",
                        "type": "uint64",
                        "internalType": "uint64"
                    },
                    {
                        "name": "propertySoldDate",
                        "type": "uint120",
                        "internalType": "uint120"
                    },
                    {
                        "name": "status",
                        "type": "uint8",
                        "internalType": "enum PropertyStatus"
                    },
                    {
                        "name": "valuationPrice",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "redemptionPricePerToken",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "totalRedemptionPool",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getPropertyIdByToken",
        "inputs": [
            {
                "name": "tokenAddress",
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
        "name": "grantIndaPropertiesRoles",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
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
        "name": "indaRoot",
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
        "name": "initialize",
        "inputs": [
            {
                "name": "_admin",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_nftContract",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_baseToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_registry",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_indaRoot",
                "type": "address",
                "internalType": "address"
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
        "name": "properties",
        "inputs": [
            {
                "name": "propertyId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "uri",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "mintedTokens",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "pricePerToken",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "acquisitionDate",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "saleStartDate",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "propertySoldDate",
                "type": "uint120",
                "internalType": "uint120"
            },
            {
                "name": "status",
                "type": "uint8",
                "internalType": "enum PropertyStatus"
            },
            {
                "name": "valuationPrice",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "redemptionPricePerToken",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "totalRedemptionPool",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "redeemTokensForUSDC",
        "inputs": [
            {
                "name": "_id",
                "type": "uint256",
                "internalType": "uint256"
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
        "name": "registerProperty",
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
                "name": "_ownerCMD",
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
        "name": "setPricePerProperty",
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
        "name": "tokenToPropertyId",
        "inputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "propertyId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
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
                "name": "propertyId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
            {
                "name": "totalSupply",
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
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RentDeposited",
        "inputs": [
            {
                "name": "tokenAddress",
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
                "name": "propertyId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            },
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
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SetRent",
        "inputs": [
            {
                "name": "propertyId",
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
        "name": "DistributorNotFound",
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
        "name": "InvalidInitialization",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolVaultClaimFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolVaultOperationFailed",
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
        "name": "ReentrancyGuardReentrantCall",
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
    }
]
export const IndaAdminRouterAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_registry",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
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
        "name": "MAX_BATCH_SIZE",
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
        "name": "authorizeIndaRoot",
        "inputs": [
            {
                "name": "baseToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "indaRootAddress",
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
        "name": "executeCapitalGainClaim",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "underlyingToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "usdcAmount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "usdcToken",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "finalizeAndDistributeCampaign",
        "inputs": [
            {
                "name": "campaignAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "individualTokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "baseToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "indaRootAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "finalizeAndDistributeCampaignBatched",
        "inputs": [
            {
                "name": "campaignAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "individualTokenAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "baseToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "indaRootAddress",
                "type": "address",
                "internalType": "address"
            },
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
        "name": "initializeTokenForUser",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "underlyingToken",
                "type": "address",
                "internalType": "address"
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
                "name": "initialBalance",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "mintCertificateToUser",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "user",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "certificateURI",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [
            {
                "name": "",
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
                "internalType": "contract IndahouseRegistry"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setTransactionRouter",
        "inputs": [
            {
                "name": "_routerAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transactionRouter",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract ITransactionRouter"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "transferAdmin",
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
        "name": "transferShares",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
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
                "name": "underlyingToken",
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
        "name": "CampaignFinalized",
        "inputs": [
            {
                "name": "campaign",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "countryCode",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "CapitalGainClaimExecuted",
        "inputs": [
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "underlyingToken",
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
                "name": "usdcAmount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "CertificateMintedToUser",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SharesTransferred",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "underlyingToken",
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
        "name": "TokenInitializedForUser",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "user",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "underlyingToken",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "initialBalance",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "USDCApproved",
        "inputs": [
            {
                "name": "spender",
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
        "type": "error",
        "name": "PriceNotSet",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ReentrancyGuardReentrantCall",
        "inputs": []
    }
]