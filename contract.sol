// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Define the Project contract
contract Project {
    address public owner;
    string public title;
    string public description;
    string public backgroundInfo;
    string public coverPhotoCID; // IPFS CID for storing the cover photo
    uint public goalAmount;
    uint public currentAmount;
    uint public endDate; // Timestamp for the project end date
    uint public refundDeadline; // Timestamp for the refund deadline

    mapping(address => uint) public contributions; // Track contributions for each donor

    constructor(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _backgroundInfo,
        string memory _coverPhotoCID,
        uint _goalAmount,
        uint _durationInSeconds
    ) {
        owner = _owner;
        title = _title;
        description = _description;
        backgroundInfo = _backgroundInfo;
        coverPhotoCID = _coverPhotoCID;
        goalAmount = _goalAmount;
        currentAmount = 0;

        // Set project end date and refund deadline
        endDate = block.timestamp + _durationInSeconds;
        refundDeadline = endDate + 30 days; // Refund period ends 1 month after the project end date
    }

    function fund() public payable {
        require(msg.value > 0, "Contribution must be greater than 0");
        require(block.timestamp < endDate, "Project funding period has ended");

        contributions[msg.sender] += msg.value; // Log the contribution
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

        payable(owner).transfer(address(this).balance); // Transfer all remaining funds to the owner
    }

    // **View Functions for Retrieving Data**

    // Get all project details
    function getProjectDetails()
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            uint,
            uint,
            uint,
            uint
        )
    {
        return (
            owner,
            title,
            description,
            backgroundInfo,
            coverPhotoCID,
            goalAmount,
            currentAmount,
            endDate,
            refundDeadline
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

contract ProjectFactory {
    Project[] public deployedProjects;

    function createProject(
        string memory title,
        string memory description,
        string memory backgroundInfo,
        string memory coverPhotoCID,
        uint goalAmount,
        uint durationInSeconds // Duration in seconds
    ) public {
        // Deploy a new Project contract
        Project newProject = new Project(
            msg.sender,
            title,
            description,
            backgroundInfo,
            coverPhotoCID,
            goalAmount,
            durationInSeconds
        );
        deployedProjects.push(newProject);
    }

    function getDeployedProjects() public view returns (Project[] memory) {
        return deployedProjects;
    }
}
