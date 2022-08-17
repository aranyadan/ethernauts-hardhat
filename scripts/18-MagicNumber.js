const { ethers } = require("hardhat")
const { symbols, resetNode } = require("../helper-hardhat-config")

async function main() {
    await resetNode()
    let solver, tx, res, runcode, initcode, bytecode
    let [attacker] = await ethers.getSigners()
    let instanceAddress = "0xcE672D9F011cdA692DedfC27563F170a12D53601"
    let target = await ethers.getContractAt("MagicNum", instanceAddress)

    console.log(`Attacker Address: ${attacker.address}`)
    console.log(`Found target contract at address: ${target.address}`)

    // Attack
    runcode =
        "6042" + // PUSH 42 (value)
        "6000" + // PUSH 00 (location)
        "52" + // MSTORE
        "6020" + // PUSH 20 (length)
        "6000" + // PUSH 00 (location)
        "F3" // RETURN

    initcode =
        "600A" + // PUSH 0A (length of runcode)
        "600c" + // PUSH 0C (location of runcode, 12 bytes after initcode)
        "6000" + // PUSH 00 (location to copy to)
        "39" + // CODECOPY
        "600A" + // PUSH 20 (length)
        "6000" + // PUSH 00 (location)
        "F3" // RETURN
    bytecode = "0x" + initcode + runcode
    console.log(`Bytecode: ${bytecode}`)

    txData = {
        from: attacker.address,
        data: bytecode,
    }
    tx = await attacker.sendTransaction(txData)
    res = await tx.wait(1)
    let solverAddress = res.contractAddress
    console.log(`Deployed contract at: ${solverAddress}`)
    res = await ethers.provider.call({
        from: attacker.address,
        to: solverAddress,
    })
    console.log(`Response: ${res}`)
    tx = await target.setSolver(solverAddress)
    await tx.wait(1)

    // Check
    solver = await target.solver()
    if (solver != ethers.constants.AddressZero) {
        console.log(`${symbols.success} Set solver!`)
    } else {
        console.log(`${symbols.error} Solver not yet set!`)
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
