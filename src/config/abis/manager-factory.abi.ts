export const ManagerFactoryAbi = [
    {
        "type": "constructor",
        "inputs": [
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
        "stateMutability": "nonpayable"
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
        "name": "createManager",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "transactionRouter",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "admin",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "clone",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "createManagerDeterministic",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "transactionRouter",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "admin",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "salt",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "clone",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "managerImplementation",
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
        "name": "predictManagerAddress",
        "inputs": [
            {
                "name": "salt",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "predicted",
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
        "type": "event",
        "name": "ManagerCloneCreated",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "clone",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "creator",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
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
    }
]