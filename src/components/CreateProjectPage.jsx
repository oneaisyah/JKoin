import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import "../styles/CreateProjectPage.css";
import { createProject } from "../utilities/projectFactory";
import { uploadFiles } from "../utilities/uploadFiles";

export default function CreateProjectPage() {
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const {
                projectName,
                coverPhoto,
                backgroundInfo,
                projectDetails,
                projectDuration,
                goalAmount,
            } = formData;

            const renamedCoverPhoto = new File(
                [coverPhoto],
                `cover.jpg`, // New name with project name
                { type: coverPhoto.type } // Preserve original file type
            );
            const formDataToSave = {
                projectName,
                backgroundInfo,
                projectDetails,
                projectDuration,
                goalAmount,
            };
            const formDataJson = new File(
                [JSON.stringify(formDataToSave, null, 2)],
                `data.json`,
                { type: "application/json" }
            );

            const filesToUpload = [renamedCoverPhoto, formDataJson];

            const projectCID = await uploadFiles(filesToUpload);
            // console.log("Uploaded projectCID:", projectCID);
            // console.log(projectCID.toString());
            // const coverPhotoObject = await uploadFiles(renamedCoverPhoto);
            // const coverPhotoCID = coverPhotoObject.toString();
            // console.log(coverPhotoCID);
            const durationInSeconds = projectDuration * 24 * 60 * 60;
            // console.log("Inputs for createProject:", {
            //     projectCID: projectCID,
            //     goalAmount,
            //     durationInSeconds,
            // });
            // Call the createProject function with the mapped data
            const txHash = await createProject(
                projectCID.toString(),
                goalAmount,
                durationInSeconds,
                userAddress
            );

            // console.log("Transaction Hash:", txHash);
        } catch (err) {
            console.error("Error creating project:", err);
        }
    };

    const [formData, setFormData] = useState({
        projectName: "",
        coverPhoto: null,
        backgroundInfo: "",
        projectDetails: "",
        projectDuration: "",
        amountToRaise: "",
    });
    const [fileName, setFileName] = useState(""); // State for the file name
    const [userAddress, setUserAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Function to connect wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setUserAddress(accounts[0]);
                setErrorMessage(""); // Clear any previous error message
            } catch (error) {
                console.error("Error connecting wallet:", error);
                setErrorMessage("Failed to connect wallet. Please try again.");
            }
        } else {
            setErrorMessage(
                "MetaMask is not installed. Please install it to interact with this page."
            );
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        setFormData({ ...formData, [name]: file });
        setFileName(file ? file.name : ""); // Update file name state
    };

    if (!userAddress) {
        return (
            <div className="connect-wallet">
                <Link className="toHome" to="/">
                    <Logo className="logo" />
                </Link>
                <h2>Please connect your wallet</h2>
                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}
                <button className="connectWalletButton" onClick={connectWallet}>
                    Connect Wallet
                </button>
            </div>
        );
    }

    return (
        <div className="formWrapper">
            <Link className="toHome" to="/">
                <Logo className="logo" />
            </Link>
            <form
                onSubmit={handleSubmit}
                style={{ maxWidth: "600px", margin: "auto" }}
            >
                <h1>Create Project</h1>
                <div>
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        placeholder="Enter project name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="coverPhoto">Cover Photo:</label>
                    <input
                        type="file"
                        id="coverPhoto"
                        name="coverPhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                    {fileName && (
                        <p className="file-name">Selected File: {fileName}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="backgroundInfo">
                        Background Information:
                    </label>
                    <textarea
                        id="backgroundInfo"
                        name="backgroundInfo"
                        value={formData.backgroundInfo}
                        onChange={handleInputChange}
                        placeholder="Provide background information about your organization"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="projectDetails">Project Details:</label>
                    <textarea
                        id="projectDetails"
                        name="projectDetails"
                        value={formData.projectDetails}
                        onChange={handleInputChange}
                        placeholder="Provide detailed information about the project"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="projectDuration">
                        Estimated Project Duration (in days):
                    </label>
                    <input
                        type="text"
                        id="projectDuration"
                        name="projectDuration"
                        value={formData.projectDuration}
                        onChange={handleInputChange}
                        placeholder="e.g., 15 days, 30 days"
                        required
                    />
                </div>
                <div className="goalAmount">
                    <label htmlFor="goalAmount">
                        Amount to Raise (in ethers):
                    </label>
                    <input
                        type="number"
                        id="goalAmount"
                        name="goalAmount"
                        value={formData.goalAmount}
                        onChange={handleInputChange}
                        placeholder="e.g., 1, 2"
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
