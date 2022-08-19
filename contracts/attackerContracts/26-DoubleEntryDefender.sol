// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IForta {
    function setDetectionBot(address detectionBotAddress) external;

    function notify(address user, bytes calldata msgData) external;

    function raiseAlert(address user) external;
}

contract DoubleEntryDefender {
    address vaultAddress;

    constructor(address _vaultAddress) {
        vaultAddress = _vaultAddress;
    }

    function handleTransaction(address user, bytes calldata msgData) external {
        console.log("GOTCALLED!");
        (, , address sender) = abi.decode(
            msgData[4:],
            (address, uint256, address)
        );
        bytes memory msgDataSignature = msgData[0:4];
        bool callerCheck = sender == vaultAddress;
        bytes memory callSignature = bytes(
            abi.encodeWithSignature("delegateTransfer(address,uint256,address)")
        );
        bool sigCheck = keccak256(msgDataSignature) == keccak256(callSignature);
        console.log("CALLER IS: ", sender);
        console.log("CALLER CHECK: ", callerCheck);
        console.log("SIGNATURES ARE: ");
        console.logBytes(msgDataSignature);
        console.logBytes(callSignature);
        console.log("SIGNATURE CHECK: ", sigCheck);
        if (callerCheck && sigCheck) IForta(msg.sender).raiseAlert(user);
    }
}
