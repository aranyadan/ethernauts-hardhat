const { ethers } = require("hardhat")
const hre = require("hardhat")
require("dotenv").config()

async function attack() {
    let deployer, attacker
    ;[deployer, attacker] = await ethers.getSigners()
    const usdcFactory = await ethers.getContractFactory("USDCPermit", deployer)
    const usdc = await usdcFactory.deploy("USDC", "USDC")
    console.log(`Deployed USDC contract at ${usdc.address}`)
    const initBal = await usdc.balanceOf(deployer.address)
    console.log(`Deployer initial balance: ${initBal}`)

    // Sign a tx
    let tx
    // tx = await usdc.approve(attacker.address, initBal)
    // console.log(tx)

    const initApp = await usdc.allowance(deployer.address, attacker.address)
    console.log(`Initial Approval: ${initApp}`)

    // Get sign
    const deadline = parseInt(+new Date() / 1000) + 60 * 60
    const { v, r, s } = await getPermitSignature(
        deployer,
        usdc,
        attacker.address,
        initBal,
        deadline
    )

    tx = await usdc
        .connect(attacker)
        .permit(deployer.address, attacker.address, initBal, deadline, v, r, s)
    const finalApp = await usdc.allowance(deployer.address, attacker.address)
    console.log(`Final Approval: ${finalApp}`)
}

async function getPermitSignature(
    wallet,
    token,
    spender,
    value,
    deadline = constants.MaxUint256
) {
    const [nonce, name, version, chainId] = await Promise.all([
        token.nonces(wallet.address),
        token.name(),
        "1",
        wallet.getChainId(),
    ])

    return ethers.utils.splitSignature(
        await wallet._signTypedData(
            {
                name,
                version,
                chainId,
                verifyingContract: token.address,
            },
            {
                Permit: [
                    {
                        name: "owner",
                        type: "address",
                    },
                    {
                        name: "spender",
                        type: "address",
                    },
                    {
                        name: "value",
                        type: "uint256",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
            {
                owner: wallet.address,
                spender,
                value,
                nonce,
                deadline,
            }
        )
    )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
attack()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })

module.exports = { main: attack }
