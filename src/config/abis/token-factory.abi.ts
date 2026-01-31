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
