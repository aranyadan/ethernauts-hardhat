const { ethers } = require("hardhat")
const chalk = require("chalk")
require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const networkConfig = {
    31337: {
        name: "hardhat",
    },
}
const developmentChains = ["hardhat", "localhost"]

const resetNode = async () => {
    if (developmentChains.includes(network.name)) {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: GOERLI_RPC_URL,
                    },
                },
            ],
        })
    }
}

const symbols = {
    info: chalk.blue("ℹ"),
    success: chalk.green("✔"),
    warning: chalk.yellow("⚠"),
    error: chalk.red("✖"),
}

// Exports
module.exports = {
    networkConfig,
    developmentChains,
    symbols,
    resetNode,
}
