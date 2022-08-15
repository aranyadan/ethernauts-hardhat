const { ethers } = require("hardhat")

const networkConfig = {
    31337: {
        name: "hardhat",
    },
}
const developmentChains = ["hardhat", "localhost"]

// Exports
module.exports = {
    networkConfig,
    developmentChains,
}
