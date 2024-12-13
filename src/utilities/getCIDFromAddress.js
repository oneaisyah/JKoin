import web3 from "./web3.js"; // Ensure your Web3 instance is correctly initialized
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get the last 2 digits of the year

    return `${day}/${month}/${year}`;
}
export default async function getCIDAndEndDateFromAddress(address) {
    if (!web3 || !address) {
        console.error("Web3 is not initialized or address is invalid.");
        return null;
    }

    const abi = [
        {
            "inputs": [],
            "name": "getProjectDetails",
            "outputs": [
                { "internalType": "address", "name": "", "type": "address" },
                { "internalType": "string", "name": "", "type": "string" },
                { "internalType": "uint256", "name": "", "type": "uint256" },
                { "internalType": "uint256", "name": "", "type": "uint256" },
                { "internalType": "uint256", "name": "", "type": "uint256" },
                { "internalType": "uint256", "name": "", "type": "uint256" },
                { "internalType": "string", "name": "", "type": "string" },
                { "internalType": "uint256", "name": "", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    try {
        const contract = new web3.eth.Contract(abi, address);

        // Call the `getProjectDetails` method
        const projectDetails = await contract.methods.getProjectDetails().call();

        // Extract the first input as project owner
        const projectOwner = projectDetails[0];
        // Extract the second output as the project CID
        const projectCID = projectDetails[1]; // Assuming the second output is the CID

        const projectTotalDonation = projectDetails[3];
        const endDate = projectDetails[4]
        const endDateMs = Number(endDate) * 1000;
        let endDateObject = new Date(endDateMs);
        endDateObject = formatDate(endDateObject);

        return { endDateObject, projectCID, projectTotalDonation, projectOwner };
    } catch (error) {
        console.error("Error fetching project details:", error);
        return null;
    }
}
