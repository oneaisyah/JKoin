import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Web3 from "web3";
import projectABI from "../abi/ProjectABI.json";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import "../styles/DonationPage.css";
import { requestRefund, withdrawFunds } from "../utilities/web3functions";

export default function DonationPage() {
    const location = useLocation();
    // console.log("Location state in donation page:", location.state);
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
    console.log("isOwner in donation page:", isOwner);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDonating, setIsDonating] = useState(false);
    const [donationAmount, setDonationAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const progress = Math.min((totalDonation / goalAmount) * 100, 100);

    // console.log("total donation in donation page", totalDonation);
    const navigate = useNavigate();

    const handleUploadProofClick = () => {
        navigate(`/uploadProof/${projectAddress}`, {
            state: { isOwner: isOwner, projectAddress: projectAddress },
        });
    };

    const initializeWeb3AndContract = async () => {
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

            const web3 = new Web3(window.ethereum);
            const project = new web3.eth.Contract(projectABI, projectAddress);

            return { web3, project, account };
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet. Please try again.");
        }
        setIsConnecting(false);
    };

    const handleDonateClick = async () => {
        const { web3, project, account } = await initializeWeb3AndContract();
        setIsDonating(true);

        if (!web3 || !project || !account) {
            return;
        }

        try {
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
        setIsDonating(false);
    };

    return (
        <div className="donationPageWrapper">
            <div className="logoWrapper">
                <Link className="toHome" to="/">
                    <Logo className="logo2" />
                </Link>
            </div>
            <div className="title">Donation for Project: {projectTitle}</div>
            <div className="middleSectionWrapper">
                <div className="middleSection">
                    <img className="projImage" src={projectImage} alt="" />
                    {isOwner ? (
                        <div className="donationSection">
                            <div className="donationBox">
                                <div className="donationText">
                                    You are the owner of this project.
                                </div>
                            </div>
                            <div className="donationContainer">
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
                                    raised so far!
                                </div>
                            </div>
                            <div className="buttonOptions">
                                <button
                                    className="uploadButton"
                                    onClick={handleUploadProofClick}
                                >
                                    Upload Proof
                                </button>
                                <button
                                    className="withdrawButton"
                                    onClick={withdrawFunds}
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    ) : (
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
                                    {isDonating ? "Donating..." : "Donate"}
                                </button>
                            </div>
                            <div className="donationContainer">
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
                            <div className="buttonOptions">
                                <button
                                    className="refundButton"
                                    onClick={requestRefund}
                                >
                                    Request Refund
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="projectText">
                <div className="backgroundInfo">
                    <div className="backgroundHeading">
                        Background of the Sustainability Organization
                    </div>
                    <div className="backgroundSubheading">
                        {projectBackgroundInfo}
                    </div>
                </div>
                <div className="projectInfo">
                    <div className="projectHeading">
                        Full Project Description
                    </div>
                    <div className="projectSubheading">
                        {projectDescription}
                    </div>
                </div>
            </div>
        </div>
    );
}
