require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("dotenv").config()

// RPC URLS
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL

// Other keys
const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            { version: "0.5.0" },
            { version: "0.6.12" },
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
            forking: {
                url: GOERLI_RPC_URL,
            },
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 1,
        },
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY,
        },
    },
}
