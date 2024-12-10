import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Web3 from "web3";
import projectABI from "../abi/ProjectABI.json";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import "../styles/DonationPage.css";

export default function DonationPage() {
    const location = useLocation();
    console.log("Location state in donation page:", location.state);
    const {
        projectAddress,
        projectDescription,
        projectTitle,
        projectOwner,
        projectImage,
        projectBackgroundInfo,
        isOwner,
        totalDonation,
        goalAmount,
    } = location.state || {};
    const [isConnecting, setIsConnecting] = useState(false);
    const [donationAmount, setDonationAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const progress = Math.min((totalDonation / goalAmount) * 100, 100);

    console.log("total donation in donation page", totalDonation);
    const navigate = useNavigate();

    const handleUploadProofClick = () => {
<<<<<<< HEAD
        console.log("Upload proof clicked");
        navigate(`/uploadProof/${projectAddress}`, {
            state: { isOwner: isOwner },
        });
    };
=======
        const isOwner = checkOwner();
        console.log("Upload proof clicked", projectAddress);
        navigate(`/uploadProof/${projectTitle}`, { state: { isOwner: isOwner, projectAddress: projectAddress } });
    }

    const checkOwner = () => {
        const currentAccount = window.ethereum.selectedAddress;
        const getCurrentAccount = async () => {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Accounts:", accounts);
            return accounts[0];
        };

        console.log("Current Account:", currentAccount);
        console.log("Project Owner:", projectOwner);

        return currentAccount.toLowerCase() === projectOwner.toLowerCase();
    }
>>>>>>> 52cec2d6c77ca0fc54d53bf4c8c20adee3c78b70

    const handleDonateClick = async () => {
        console.log("ProjectAddress in handleDonateClick:", projectAddress);
        if (!window.ethereum) {
            alert("Please install MetaMask to donate.");
            return;
        }

        if (isConnecting) {
            alert(
                "Please wait for the connection to complete. Check MetaMask."
            );
            return;
        }

        setIsConnecting(true);

        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const account = accounts[0];
            console.log("Account:", account);
            console.log("projectAddress from donation page:", projectAddress);

            const web3 = new Web3(window.ethereum);
            const project = new web3.eth.Contract(projectABI, projectAddress);

            const transaction = await project.methods.fund().send({
                from: account,
                value: web3.utils.toWei(donationAmount, "ether"),
            });

            console.log("Transaction:", transaction);
            alert("Donation successful!");
        } catch (error) {
            console.error("Error donating:", error);
            alert("Error donating. Please try again.");
        }
        setIsConnecting(false);
    };

    return (
        <div className="donationPageWrapper">
            <div className="logoWrapper">
                <Link className="toHome" to="/">
                    <Logo className="logo2" />
                </Link>
                <button
                    className="uploadButton"
                    onClick={handleUploadProofClick}
                >
                    Upload Proof
                </button>
            </div>
            <div className="title">Donation for Project: {projectTitle}</div>
            <div className="middleSectionWrapper">
                <div className="middleSection">
                    <img className="projImage" src={projectImage} alt="" />
                    <div className="donationSection">
                        <div className="donationBox">
                            <div className="donationText">Donate amount:</div>
                            <input
                                className="donationInput"
                                placeholder="Amount (Ether)"
                                onChange={(e) =>
                                    setDonationAmount(e.target.value)
                                }
                                value={donationAmount || ""}
                                type="number"
                            />
                            <button
                                className="donateButton"
                                onClick={handleDonateClick}
                            >
                                Donate
                            </button>
                        </div>
                        <div className="donationContainer">
                            {/* <div className="donationAmount">
                                $500
                            </div> */}
                            <div className="donationBar">
                                <div
                                    className="donationBarFill"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="donationAmount">
                                {totalDonation}/{goalAmount} Ether
                            </div>
                            <div className="amountRaised">
                                raised so far! It's your turn to make a
                                difference!
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD
                    <div>
                        {/* {checkOwner() && (
                                <Link to={`/uploadProof/${projectTitle}`}>
                                    <button className="donateButton" onClick={handleUploadProofClick}>
                                        Upload Proof
                                    </button>
                                </Link>
                            )} */}
                    </div>
=======
>>>>>>> 52cec2d6c77ca0fc54d53bf4c8c20adee3c78b70
                </div>
            </div>
            <div className="projectText">
                <div className="backgroundInfo">
                    <div className="backgroundHeading">
                        Background of the Sustainability Organization
                    </div>
                    <div className="backgroundSubheading">
                        Organization Name: {projectOwner}
                    </div>
                </div>
                <div className="projectInfo">
                    <div className="projectHeading">
                        Full Project Description
                    </div>
                    <div className="projectSubheading">
                        {projectBackgroundInfo}
                    </div>
                </div>
            </div>
        </div>
    );
}
