import web3 from "./web3.js";

const projectabi = [
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
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "requestRefund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isRefundActive",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "canWithdraw",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }
];


async function getProjectDetails(address) {
    if (!web3) {
        console.error("Web3 is not initialized or address is invalid.");
        return null;
    }
    const contract = new web3.eth.Contract(projectabi, address);

    const projectDetails = await contract.methods.getProjectDetails().call();
    return projectDetails
}

async function withdrawFunds(projectAddress) {
    if (!web3) {
        console.error("Web3 is not initialized or address is invalid.");
        return null;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    const contract = new web3.eth.Contract(projectabi, projectAddress);

    try {
        const transaction = await contract.methods.withdraw().send({ from: account })
            .then(receipt => {
                console.log("Transaction successful!", receipt);
            })
            .catch(error => {
                console.error("Error in transaction:", error);
            });
        console.log("Withdraw successful:", transaction);
    } catch (error) {
        console.error("Error withdrawing funds:", error);
    }
}

async function requestRefund() {
    if (!web3) {
        console.error("Web3 is not initialized or address is invalid.");
        return null;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    const contract = new web3.eth.Contract(projectabi, process.env.REACT_APP_CONTRACT_ADDRESS);

    try {
        const refundActive = await contract.methods.isRefundActive().call();
        if (!refundActive) {
            console.log("Refund is not allowed at this time.");
            return;
        }

        const transaction = await contract.methods.requestRefund().send({ from: account });
        console.log("Refund successful:", transaction);
    } catch (error) {
        console.error("Error requesting refund:", error);
    }
}

// Export the functions and constants for reuse
export { getProjectDetails, requestRefund, withdrawFunds };

