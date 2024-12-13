// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "remix_tests.sol"; // This import is automatically injected by Remix.
import "remix_accounts.sol"; // Provides accounts for testing.
import "../contracts/project_final.sol";
import "hardhat/console.sol";

contract ProjectFundTest {
    Project project;
    address owner;
    uint goalAmount = 100 ether;   // Goal amount for the project
    uint duration = 1 days;        // Funding period duration

    // Accounts provided by Remix for testing
    address acc0; // Default account, acts as owner
    address acc1;
    address acc2;
    address acc3;

    function beforeAll() public {
        // Get test accounts
        acc0 = TestsAccounts.getAccount(0); // Owner
        acc1 = TestsAccounts.getAccount(1);
        acc2 = TestsAccounts.getAccount(2);
        acc3 = TestsAccounts.getAccount(3);
        owner = acc0;

        // Deploy a new Project contract
        project = new Project(
            owner,
            "projectDetailsCID",
            goalAmount,
            duration
        );
    }

    /// #value: 10 ether
    function testSuccessfulFunding() public payable {
        project.fund{value: msg.value}();

        (, , , uint currentAmount, , , , ) = project.getProjectDetails();
        uint contribution = project.getContribution(address(this));

        Assert.equal(contribution, msg.value, "Contribution should match the funded amount");
        Assert.equal(currentAmount, msg.value, "Current amount should reflect the funding");
    }

    /// #value: 0
    /// #sender: account-1
    function testFundingWithZeroValue() public payable {
        try project.fund{value: msg.value}() {
            Assert.ok(false, "Funding with zero value should fail");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Contribution must be greater than 0", "Expected error message not received");
        } catch {
            Assert.ok(false, "Unexpected error");
        }
    }

    /// #value: 1 ether
    /// #sender: account-2
    function testFundingAfterGoalReached() public payable {
        try project.fund{value: msg.value}() {
            (, , , uint currentAmount, , , , ) = project.getProjectDetails();
            if (currentAmount >= goalAmount) {
                Assert.ok(false, "Funding after goal amount reached should fail");
            } else {
                Assert.ok(true, "Overfunding should be allowed");
            }
        } catch Error(string memory reason) {
            Assert.equal(reason, "Funding goal has been reached", "Expected error message not received");
        } catch {
            Assert.ok(false, "Unexpected error");
        }
    }
}
