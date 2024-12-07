import web3 from "./web3.js";
import { uploadFile } from "./web3Storage.js";

// const abi = process.env.REACT_APP_CONTRACT_ABI;
const abi = [{ "inputs": [{ "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "string", "name": "backgroundInfo", "type": "string" }, { "internalType": "string", "name": "coverPhotoCID", "type": "string" }, { "internalType": "uint256", "name": "goalAmount", "type": "uint256" }, { "internalType": "uint256", "name": "durationInSeconds", "type": "uint256" }], "name": "createProject", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "deployedProjects", "outputs": [{ "internalType": "contract Project", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getDeployedProjects", "outputs": [{ "internalType": "contract Project[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }]

// Address of the deployed ProjectFactory contract
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const projectFactory = new web3.eth.Contract(abi, contractAddress);

export const createProject = async (
    title,
    coverPhotoCID, // Cover photo file object
    description,
    backgroundInfo,
    durationInMonths,
    goalAmount
) => {
    try {
        // Request MetaMask account
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const sender = accounts[0];

        console.log("Using MetaMask account:", sender);

        const metadata = {
            title,
            description,
            backgroundInfo, // This can contain additional details
            coverPhotoCID,
        };

        console.log("Cover Photo CID:", coverPhotoCID);
        console.log("Uploading metadata to Web3.Storage...");
        const jsonBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
        const metadataCID = await uploadFile(jsonBlob);
        console.log("Metadata uploaded to Web3.Storage. CID:", metadataCID);


        // Convert duration to seconds
        const durationInSeconds = durationInMonths * 30 * 24 * 60 * 60; // Approximate seconds in a month
        console.log("goalAmt: " + goalAmount)
        const goalAmountInWei = web3.utils.toWei(goalAmount.toString(), "ether"); // Convert ETH to Wei

        console.log("Duration in seconds:", durationInSeconds);
        console.log("Goal amount in Wei:", goalAmountInWei);

        // Estimate gas for the transaction
        const gasEstimate = await projectFactory.methods
            .createProject(title, description, backgroundInfo, coverPhotoCID, goalAmountInWei, durationInSeconds)
            .estimateGas({ from: sender });

        console.log("Gas estimate:", gasEstimate);

        // Send the transaction using MetaMask
        const tx = await projectFactory.methods
            .createProject(title, description, backgroundInfo, coverPhotoCID, goalAmountInWei, durationInSeconds)
            .send({ from: sender, gas: gasEstimate });

        console.log("Transaction successful:", tx);
        return tx.transactionHash;
    } catch (error) {
        console.error("Error in createProject:", error.message || error);
        throw error;
    }
};



export const getDeployedProjects = async () => {
    const projects = await projectFactory.methods.getDeployedProjects().call();
    return projects;
};

export default projectFactory;