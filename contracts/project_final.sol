// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectFactory {
    Project[] public deployedProjects;

    function createProject(
        string memory projectCID,
        uint goalAmount,
        uint durationInSeconds // Duration in seconds
    ) public {
        require(goalAmount > 0, "Goal amount must be greater than zero");
        require(durationInSeconds > 0, "Duration must be greater than zero");
        
        // Deploy a new Project contract
        Project newProject = new Project(
            msg.sender,
            projectCID,
            goalAmount,
            durationInSeconds
        );
        deployedProjects.push(newProject);
    }

    function getDeployedProjects() public view returns (Project[] memory) {
        return deployedProjects;
    }
}

// Define the Project contract
contract Project {
    address public owner;
    string public projectCID;
    string public proofPhotoCID;
    uint public goalAmount;
    uint public endDate; // Timestamp for the project end date
    uint public refundDeadline; // Timestamp for the refund deadline
    uint public currentAmount; // Track the current amount of contributions
    uint public proofUploadDate; // Timestamp when proof was uploaded

    mapping(address => uint) public contributions; // Track contributions for each donor

    constructor(
        address _owner,
        string memory _projectCID,
        uint _goalAmount,
        uint _durationInSeconds
    ) {
        owner = _owner;
        projectCID = _projectCID;
        goalAmount = _goalAmount;
        currentAmount = 0;

        // Set project end date and refund deadline
        endDate = block.timestamp + _durationInSeconds;
        refundDeadline = endDate + 30 days; // Refund period ends 1 month after the project end date
    }

    function fund() public payable {
        require(msg.value > 0, "Contribution must be greater than 0");
        require(block.timestamp < refundDeadline, "Project has ended");

        contributions[msg.sender] += msg.value;
        currentAmount += msg.value;
    }

    function requestRefund() public {
        require(block.timestamp > endDate, "Refunds are not allowed before the project ends");
        require(block.timestamp <= refundDeadline, "Refund period has ended");

        uint amount = contributions[msg.sender];
        require(amount > 0, "No contributions to refund");

        contributions[msg.sender] = 0; // Reset contribution to prevent re-entrancy
        payable(msg.sender).transfer(amount); // Refund the amount
    }

    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        require(block.timestamp > refundDeadline, "Withdrawals are only allowed after the refund period ends");

        currentAmount = 0;
        payable(owner).transfer(address(this).balance); // Transfer all remaining funds to the owner
    }

    // Allows the owner to upload proof after the project end date
    function uploadProof(string memory _proofPhotoCID) public {
        require(msg.sender == owner, "Only the owner can upload proof");
        require(block.timestamp > endDate, "Cannot upload proof before project end date");
        require(block.timestamp <= endDate + 3 days, "Proof upload period has ended");
        require(bytes(proofPhotoCID).length == 0, "Proof has already been uploaded");

        proofPhotoCID = _proofPhotoCID;
        proofUploadDate = block.timestamp;
    }

    // Get all project details
    function getProjectDetails()
        public
        view
        returns (
            address,
            string memory,
            uint,
            uint,
            uint,
            uint,
            string memory,
            uint
        )
    {
        return (
            owner,
            projectCID,
            goalAmount,
            currentAmount,
            endDate,
            refundDeadline,
            proofPhotoCID,
            proofUploadDate
        );
    }

    // Get the contribution of a specific donor
    function getContribution(address donor) public view returns (uint) {
        return contributions[donor];
    }

    // Check if the refund period is active
    function isRefundActive() public view returns (bool) {
        return block.timestamp > endDate && block.timestamp <= refundDeadline;
    }

    // Check if the project funding period is still active
    function isFundingActive() public view returns (bool) {
        return block.timestamp < endDate;
    }

    // Check if the owner can withdraw funds
    function canWithdraw() public view returns (bool) {
        return block.timestamp > refundDeadline;
    }
}
