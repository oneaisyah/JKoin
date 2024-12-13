// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "hardhat/console.sol";
import "../contracts/project_final.sol";

contract ProjectFactoryTest {
    Project project;
    address owner;
    uint goalAmount = 100 ether;   // Goal amount for the project
    uint duration = 1 days;   

    function beforeAll() public {
        // Get test accounts
        // address acc0 = TestsAccounts.getAccount(0); // Owner
        // owner = acc0;

        // Deploy a new Project contract
        project = new Project(
            0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
            "projectDetailsCID",
            goalAmount,
            duration
        );
    }

    
    function shouldNotGetRefundBeforeEndProject() public {

        try project.requestRefund() {
        } catch Error(string memory reason) {
            Assert.equal(
                reason, 
                "Refunds are not allowed before the project ends", 
                "Refund should revert with 'No contributions to refund'"
            );
        } 
    }
}