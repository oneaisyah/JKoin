import web3 from "./web3.js";

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


async function donateFund() {
    if (!web3) {
        console.error("Web3 is not initialized or address is invalid.");
        return null;
    }
    const contract = new web3.eth.Contract(abi, process.env.REACT_APP_CONTRACT_ADDRESS);

    const projectDetails = await contract.methods.getProjectDetails().call();
    console.log("Project Details:", projectDetails);
}

async function withdrawFunds() {
    if (!web3) {
        console.error("Web3 is not initialized or address is invalid.");
        return null;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    const contract = new web3.eth.Contract(abi, process.env.REACT_APP_CONTRACT_ADDRESS);

    try {
        const canWithdraw = await contract.methods.canWithdraw().call();
        if (!canWithdraw) {
            console.log("Withdrawal is not allowed at this time.");
            return;
        }

        const transaction = await contract.methods.withdraw().send({ from: account });
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

    const contract = new web3.eth.Contract(abi, process.env.REACT_APP_CONTRACT_ADDRESS);

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
export { donateFund, requestRefund, withdrawFunds };

