const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, finalval
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x6C17dD2f014E60E7104b987c7A503940F0EA20EB"
    let target = await ethers.getContractAt("GatekeeperTwo", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "GatekeeperTwoAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack

    // Check
    owner = await target.entrant()
    if (owner == attacker.address) {
        console.log(`${symbols.success} Set entrant correctly!`)
    } else {
        console.log(`${symbols.error} Entrant set to ${owner}...`)
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })

module.exports = { main: main }
