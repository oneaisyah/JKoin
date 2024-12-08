import web3 from "./web3.js";

// const abi = process.env.REACT_APP_CONTRACT_ABI;
const abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "projectCID",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "durationInSeconds",
                "type": "uint256"
            }
        ],
        "name": "createProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "deployedProjects",
        "outputs": [
            {
                "internalType": "contract Project",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDeployedProjects",
        "outputs": [
            {
                "internalType": "contract Project[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

// Address of the deployed ProjectFactory contract
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const projectFactory = new web3.eth.Contract(abi, contractAddress);

export const createProject = async (projectCID, goalAmountInWei, durationInSeconds, userAddress) => {
    try {
        // Log the provided inputs
        console.log("Creating project with inputs:", { projectCID, goalAmountInWei, durationInSeconds });

        // Estimate gas for the transaction
        const gasEstimate = await projectFactory.methods
            .createProject(projectCID, goalAmountInWei, durationInSeconds)
            .estimateGas({ from: userAddress });

        console.log("Gas estimate:", gasEstimate);

        // Send the transaction using MetaMask
        const tx = await projectFactory.methods
            .createProject(projectCID, goalAmountInWei, durationInSeconds)
            .send({ from: userAddress, gas: gasEstimate });

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