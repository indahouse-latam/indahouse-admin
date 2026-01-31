export const PoolFactoryAbi = [

    {
        "type": "function",
        "name": "createDistributorProxy",
        "inputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "admin",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "poolDistributor",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "initializeDistributorAndCreateVault",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "baseToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "indaRoot",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "manager",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "poolToken",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "poolDistributor",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "poolVault",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "PoolCreated",
        "inputs": [
            {
                "name": "countryCode",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "poolToken",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "poolDistributor",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "poolVault",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    }
]