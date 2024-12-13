// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "remix_tests.sol"; 
import "../contracts/project_final_mock.sol";

contract ProjectFactoryTest {
    ProjectFactory projectFactory;

    function beforeEach() public {
        projectFactory = new ProjectFactory();
    }

    // Test Case 1: Check that the deployed projects list is empty initially
    function testInitialDeployedProjectsLength() public {
        Project[] memory projects = projectFactory.getDeployedProjects();
        Assert.equal(projects.length, uint(0), "Initial deployed projects length should be 0");
    }

    // Test Case 2: Create one project and check if the length is 1
    function testDeployedProjectsLengthAfterOneCreation() public {
        projectFactory.createProject(
            "projectDetailsCID1",
            1000,    
            86400      
        );
        Project[] memory projects = projectFactory.getDeployedProjects();
        Assert.equal(projects.length, uint(1), "Deployed projects length should be 1 after one creation");
    }

    // Test Case 3: Create multiple projects and check if they are stored correctly
    function testDeployedProjectsLengthAfterMultipleCreations() public {
        projectFactory.createProject(
            "projectDetailsCID1",
            1000,         
            86400         
        );
        projectFactory.createProject(
            "projectDetailsCID2",
            2000,     
            172800      
        );
        projectFactory.createProject(
            "projectDetailsCID3",
            3000,    
            259200 
        );
        Project[] memory projects = projectFactory.getDeployedProjects();
        Assert.equal(projects.length, uint(3), "Deployed projects length should be 3 after three creations");
    }

    // Test Case 4: Attempt to create a project with zero goal amount
    function testCreateProjectWithZeroGoalAmount() public {
        try projectFactory.createProject(
            "projectDetailsCID",
            0,          
            86400     
        ) {
            Assert.ok(false, "Creating a project with zero goal amount should fail");
        } catch Error(string memory reason) {
            Assert.equal(
                reason,
                "Goal amount must be greater than zero",
                "Expected error message not received"
            );
        } catch (bytes memory) {
            Assert.ok(false, "Unexpected error type caught");
        }
    }

    // Test Case 5: Attempt to create a project with zero duration
    function testCreateProjectWithZeroDuration() public {
        try projectFactory.createProject(
            "projectDetailsCID",
            1000,           // goalAmount
            0               // durationInSeconds (invalid)
        ) {
            Assert.ok(false, "Creating a project with zero duration should fail");
        } catch Error(string memory reason) {
            Assert.equal(
                reason,
                "Duration must be greater than zero",
                "Expected error message not received"
            );
        } catch (bytes memory) {
            Assert.ok(false, "Unexpected error type caught");
        }
    }

    // Test Case 6: Check if created projects have correct details
    function testCreatedProjectDetails() public {
        projectFactory.createProject(
            "projectDetailsCID",
            5000,
            86400
        );
        Project[] memory projects = projectFactory.getDeployedProjects();
        Assert.equal(projects.length, uint(1), "Deployed projects length should be 1");

        Project project = projects[0];

        (
            address owner,
            string memory projectDetailsCID,
            uint goalAmount,
            uint currentAmount,
            uint endDate,
            uint refundDeadline,
            string memory proofPhotoCID,
            uint proofUploadDate
        ) = project.getProjectDetails();

        Assert.equal(owner, address(this), "Project owner should be the test contract");
        Assert.equal(projectDetailsCID, "projectDetailsCID", "Project details CID should match");
        Assert.equal(goalAmount, uint(5000), "Goal amount should be 5000");
        Assert.equal(currentAmount, uint(0), "Current amount should be 0");
        // Additional assertions can be added for endDate and refundDeadline
    }
}