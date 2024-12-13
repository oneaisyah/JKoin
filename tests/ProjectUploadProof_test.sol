// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "remix_tests.sol"; // This import is automatically injected by Remix.
import "remix_accounts.sol"; // Provides accounts for testing.
import "hardhat/console.sol";
import "../contracts/project_final.sol";

contract ProjectUploadProofTest {
    Project project;
    address owner;
    uint goalAmount = 100 ether;   // Goal amount for the project
    uint duration = 1 days;        // Funding period duration
    string testProofCID = "testProofPhotoCID";

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

        // Deploy a new Project contract
        project = new Project(
            address(this),
            "projectDetailsCID",
            goalAmount,
            duration
        );
    }

    function testSuccessfulUploadProof() public {
        project.uploadProof(testProofCID);

        (, , , , , , string memory proofCID, uint timestamp) = project.getProjectDetails();
        
        Assert.equal(proofCID, testProofCID, "Uploaded proof CID should match the test CID");
        Assert.ok(timestamp > 0, "Timestamp should reflect proof upload");
    }

    function testUploadProofNonOwner() public {
        project = new Project(
            acc0,
            "projectDetailsCID",
            goalAmount,
            duration
        );

        try project.uploadProof(testProofCID) {
        } catch Error(string memory reason) {
            Assert.equal(
                reason, 
                "Only the owner can upload proof", 
                "Only the owner can upload proof"
            );
        } 
    }

    function testUploadProofAlreadyUploaded() public {
        project = new Project(
            address(this),
            "projectDetailsCID",
            goalAmount,
            duration
        );

        project.uploadProof(testProofCID);

        try project.uploadProof(testProofCID) {
        } catch Error(string memory reason) {
            Assert.equal(
                reason, 
                "Proof has already been uploaded", 
                "Proof has already been uploaded"
            );
        } 
    }
}
