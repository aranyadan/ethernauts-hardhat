require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("dotenv").config()

// RPC URLS
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL
const AVALANCHE_RPC_URL = process.env.AVALANCHE_RPC_URL
const BNB_RPC_URL = process.env.BNB_RPC_URL
const CELO_RPC_URL = process.env.CELO_RPC_URL
const CRONOS_RPC_URL = process.env.CRONOS_RPC_URL
const FANTOM_RPC_URL = process.env.FANTOM_RPC_URL
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const OPTIMISM_RPC_URL = process.env.OPTIMISM_RPC_URL
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL

// Other keys
const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            { version: "0.4.24" },
            { version: "0.6.12" },
            { version: "0.6.6" },
            { version: "0.7.5" },
            { version: "0.8.0" },
        ],
    },
    networks: {
        localhost: {
            url: LOCALHOST_RPC_URL,
            chainId: 31337,
        },
        hardhat: {
            chainId: 31337,
        },
        arbitrum: {
            url: ARBITRUM_RPC_URL,
            chainId: 42161,
        },
        avalanche: {
            url: AVALANCHE_RPC_URL,
            chainId: 43114,
        },
        bnb: {
            url: BNB_RPC_URL,
            chainId: 56,
        },
        celo: {
            url: CELO_RPC_URL,
            chainId: 42220,
        },
        cronos: {
            url: CRONOS_RPC_URL,
            chainId: 25,
        },
        fantom: {
            url: FANTOM_RPC_URL,
            chainId: 250,
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            chainId: 1,
        },
        optimism: {
            url: OPTIMISM_RPC_URL,
            chainId: 10,
        },
        polygon: {
            url: POLYGON_RPC_URL,
            chainId: 137,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 1,
        },
    },
    etherscan: {
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
        },
    },
}
