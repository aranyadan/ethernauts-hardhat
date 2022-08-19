const { expect } = require("chai")
const { Wallet } = require("ethers")
const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let power, tx, res, token1bal, token2bal
    let attacker = new Wallet(process.env.METAMASK_PRIVATE_KEY, ethers.provider)
    let instanceAddress = "0xd97C1797032CbB36dafCaF4d7BE9cb23922B56D1"
    // Contracts
    let target = await ethers.getContractAt(
        "DoubleEntryPoint",
        instanceAddress,
        attacker
    )
    let targetVault = await ethers.getContractAt(
        "CryptoVault",
        await target.cryptoVault(),
        attacker
    )
    let legacyToken = await ethers.getContractAt(
        "LegacyToken",
        await target.delegatedFrom(),
        attacker
    )
    let forta = await ethers.getContractAt(
        "Forta",
        await target.forta(),
        attacker
    )
    let defenderBotFactory = await ethers.getContractFactory(
        "DoubleEntryDefender",
        attacker
    )
    let defenderBot = await defenderBotFactory.deploy(targetVault.address)

    const getbal = async (accountAddress, printBool, name = accountAddress) => {
        token1bal = ethers.utils.formatEther(
            (await legacyToken.balanceOf(accountAddress)).toString()
        )
        token2bal = ethers.utils.formatEther(
            (await target.balanceOf(accountAddress)).toString()
        )
        if (printBool) {
            console.log(`Balance of ${name}:`)
            console.log(`Legacy Token Balance: ${token1bal} ETH`)
            console.log(`DET    Token Balance: ${token2bal} ETH`)
        }
    }

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Player Address: ${await target.player()}`)
    console.log(`DET contract at address: ${target.address}`)
    console.log(`Vault contract at address: ${targetVault.address}`)
    console.log(`Legacy contract at address: ${legacyToken.address}`)
    console.log(`Forta contract at address: ${forta.address}`)
    console.log(`Forta Bot Contract deployed at ${defenderBot.address}`)

    // Defend
    // Register Bot
    tx = await forta.setDetectionBot(defenderBot.address)
    await tx.wait(1)
    let botadd = await forta.usersDetectionBots(attacker.address)
    console.log(`Registered bot address from Defender: ${botadd}`)

    // Check
    await getbal(targetVault.address, false, "Vault")
    let origDETBal = token2bal
    try {
        tx = await targetVault.sweepToken(legacyToken.address, {
            gasLimit: 1000000,
        })
        await tx.wait(1)
    } catch (err) {}
    await getbal(targetVault.address, true, "Vault")
    if (token2bal == origDETBal) {
        console.log(`${symbols.success} Original balance SAVED!`)
    } else {
        console.log(`${symbols.error} DET token HACKED!!`)
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
