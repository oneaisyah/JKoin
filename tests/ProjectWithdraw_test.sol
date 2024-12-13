// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "remix_tests.sol"; // This import is automatically injected by Remix.
import "remix_accounts.sol"; // Provides accounts for testing.
import "../contracts/project_final.sol";
import "hardhat/console.sol";

contract ProjectWithdrawTest {
    Project project;
    address owner;
    uint goalAmount = 100 ether;   // Goal amount for the project
    uint duration = 1 days;        // Funding period duration

    // Accounts provided by Remix for testing
    address acc0; // Default account, acts as owner
    address acc1;
    address acc2;

    function beforeAll() public {
        // Get test accounts
        acc0 = TestsAccounts.getAccount(0); // Owner
        acc1 = TestsAccounts.getAccount(1);
        acc2 = TestsAccounts.getAccount(2);
        owner = acc0;

        // Deploy a new Project contract with owner as acc0
        project = new Project(
            acc0,
            "projectDetailsCID",
            goalAmount,
            duration
        );
    }

    /// #sender: account-0
    /// #value: 10 ether
    function testSuccessfulWithdrawByOwner() public payable {
        project.fund{value: msg.value}();

        uint ownerInitialBalance = acc0.balance;
        console.log(ownerInitialBalance);

        project.withdraw();

        uint projectBalanceAfterWithdraw = address(project).balance;
        Assert.equal(projectBalanceAfterWithdraw, 0, "Contract balance should be zero after withdrawal");

        uint ownerFinalBalance = acc0.balance;
        Assert.ok(ownerFinalBalance >= ownerInitialBalance + msg.value - 0.1 ether, "Owner's balance should increase by the withdrawn amount");
    }
}

