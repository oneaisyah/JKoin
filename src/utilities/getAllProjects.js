import pLimit from 'p-limit';
// import { web3 } from './web3.js';
import Web3 from 'web3';
const limit = pLimit(2);

// Replace with your deployed ProjectFactory contract's ABI and address
const projectFactoryABI = [
    {
        "inputs": [],
        "name": "getDeployedProjects",
        "outputs": [{ "internalType": "contract Project[]", "name": "", "type": "address[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "deployedProjects",
        "outputs": [{ "internalType": "contract Project", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "title", "type": "string" },
            { "internalType": "string", "name": "description", "type": "string" },
            { "internalType": "string", "name": "backgroundInfo", "type": "string" },
            { "internalType": "string", "name": "coverPhotoCID", "type": "string" },
            { "internalType": "uint256", "name": "goalAmount", "type": "uint256" },
            { "internalType": "uint256", "name": "durationInSeconds", "type": "uint256" }
        ],
        "name": "createProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];


const projectFactoryAddress = "0xA5dcD5C337c80b0126248c25Ca711a3c4F48A8F0";

// Replace with your Project contract's ABI
const projectABI = [
    {
        "inputs": [],
        "name": "title",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "description",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "backgroundInfo",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "coverPhotoCID",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "goalAmount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentAmount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endDate",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "refundDeadline",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];


// Initialize Web3
const provider = `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURIA_API_KEY}`;
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

// Create a ProjectFactory contract instance
const projectFactory = new web3.eth.Contract(projectFactoryABI, projectFactoryAddress);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function: Retry with exponential backoff
async function fetchWithRetry(fn, retries = 5, delay = 2000) {
    try {
        return await fn();
    } catch (err) {
        if (err.message.includes("Too Many Requests") && retries > 0) {
            console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
            await sleep(delay);
            return fetchWithRetry(fn, retries - 1, delay * 2); // Retry with increased delay
        }
        throw err; // Throw other errors
    }
}

// // check if user is owner of the project
// export async function checkOwner(projectAddress) {
//     const getCurrentAccount = async () => {
//         const accounts = await web3.eth.getAccounts();
//         return accounts[0];
//     };

//     const currentAccount = await getCurrentAccount();
//     console.log("Current Account:", currentAccount);
//     const project = new web3.eth.Contract(projectABI, projectAddress);
//     const owner = await project.methods.owner().call();

//     return owner === currentAccount;
// }

let cachedProjects = null; // Cache to store project data

export default async function getAllProjects() {
    if (cachedProjects) {
        console.log("Returning cached projects...");
        return cachedProjects; // Return cached data
    }

    try {
        console.log("Fetching deployed projects...");
        const projectAddresses = await projectFactory.methods.getDeployedProjects().call();
        console.log("Project Addresses:", projectAddresses);

        const projectsData = [];
        for (const address of projectAddresses) {
            await limit(async () => {
                const project = new web3.eth.Contract(projectABI, address);
                const title = await fetchWithRetry(() => project.methods.title().call());

                await sleep(1500); // Adjust delay if needed
                const description = await fetchWithRetry(() => project.methods.description().call());
                await sleep(1500); // Adjust delay if needed
                const backgroundInfo = await fetchWithRetry(() => project.methods.backgroundInfo().call());

                await sleep(1500); // Adjust delay if needed
                const coverPhotoCID = await fetchWithRetry(() => project.methods.coverPhotoCID().call());

                await sleep(1500); // Adjust delay if needed
                const goalAmount = await fetchWithRetry(() => project.methods.goalAmount().call());

                await sleep(1500); // Adjust delay if needed
                const currentAmount = await fetchWithRetry(() => project.methods.currentAmount().call());

                await sleep(1500); // Adjust delay if needed
                const owner = await fetchWithRetry(() => project.methods.owner().call());
                const isOwner = (owner === address);

                await sleep(1500); // Adjust delay if needed
                const endDate = await fetchWithRetry(() => project.methods.endDate().call());

                await sleep(1500); // Adjust delay if needed

                projectsData.push({
                    address,
                    title,
                    description,
                    backgroundInfo,
                    coverPhotoCID,
                    goalAmount: web3.utils.fromWei(goalAmount, "ether"),
                    currentAmount: web3.utils.fromWei(currentAmount, "ether"),
                    owner,
                });

                // Add a delay between requests to avoid rate limits
            });
        }

        console.log("Projects Data:", projectsData);
        cachedProjects = projectsData; // Cache the data for future calls
        return projectsData;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
}