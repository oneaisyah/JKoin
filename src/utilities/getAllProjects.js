import Web3 from "web3";
import pLimit from 'p-limit';
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

export default async function getAllProjects() {
    try {
        // Step 1: Get all deployed project addresses
        console.log("Fetching deployed projects...");
        const projectAddresses = await projectFactory.methods.getDeployedProjects().call();
        console.log("Project Addresses:", projectAddresses);

        // Step 2: Fetch data for each project
        const projectsData = [];
        for (const address of projectAddresses) {
            await limit(async () => {
                const project = new web3.eth.Contract(projectABI, address);
                const title = await fetchWithRetry(() => project.methods.title().call());
                const description = await fetchWithRetry(() => project.methods.description().call());
                const backgroundInfo = await fetchWithRetry(() => project.methods.backgroundInfo().call());
                const coverPhotoCID = await fetchWithRetry(() => project.methods.coverPhotoCID().call());
                const goalAmount = await fetchWithRetry(() => project.methods.goalAmount().call());
                const currentAmount = await fetchWithRetry(() => project.methods.currentAmount().call());
                const owner = await fetchWithRetry(() => project.methods.owner().call());
                const endDate = await fetchWithRetry(() => project.methods.endDate().call()); // Unix timestamp
                // const durationInSeconds = await fetchWithRetry(() => project.methods.durationInSeconds().call());

                // Calculate project deadline with 1-month buffer
                // const oneMonthInSeconds = 30 * 24 * 60 * 60;
                // const adjustedEndDate = parseInt(endDate) + oneMonthInSeconds;
                // const remainingTimeInSeconds = Math.max(0, adjustedEndDate - Math.floor(Date.now() / 1000));

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
                await sleep(1500); // Adjust delay if needed
            });
        }

        console.log("Projects Data:", projectsData);
        return projectsData;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
    //     // Step 2: Iterate over each project address and fetch its data
    //     const projectsData = await Promise.all(
    //         projectAddresses.map((address) => 
    //             limit(async() => {
    //             const project = new web3.eth.Contract(projectABI, address);

    //             await sleep(200);
    //             // Fetch data from the Project contract
    //             const title = await project.methods.title().call();
    //             const description = await project.methods.description().call();
    //             const backgroundInfo = await project.methods.backgroundInfo().call();
    //             const coverPhotoCID = await project.methods.coverPhotoCID().call();
    //             const goalAmount = await web3.utils.fromWei(await project.methods.goalAmount().call(), "ether");
    //             const currentAmount = await web3.utils.fromWei(await project.methods.currentAmount().call(), "ether");
    //             const owner = await project.methods.owner().call();

    //             return {
    //                 address,
    //                 title,
    //                 description,
    //                 backgroundInfo,
    //                 coverPhotoCID,
    //                 goalAmount,
    //                 currentAmount,
    //                 owner,
    //             };
    //         })
    //     ));

    //     console.log("Projects Data:", projectsData);
    //     return projectsData;
    // } catch (error) {
    //     console.error("Error fetching projects:", error);
    //     throw error;
    // }
}

getAllProjects();
