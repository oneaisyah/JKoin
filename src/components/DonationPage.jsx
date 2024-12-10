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
        console.log("Upload proof clicked");
        navigate(`/uploadProof/${projectAddress}`, {
            state: { isOwner: isOwner },
        });
    };

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
                    <div>
                        {/* {checkOwner() && (
                                <Link to={`/uploadProof/${projectTitle}`}>
                                    <button className="donateButton" onClick={handleUploadProofClick}>
                                        Upload Proof
                                    </button>
                                </Link>
                            )} */}
                    </div>
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
    // return (
    //     <div className="donationPageWrapper">
    //         <div className="logoWrapper">
    //             <Link className="toHome" to="/">
    //                 <Logo className="logo2" />
    //             </Link>
    //         </div>
    //         <div className="title">River Renewal Action Day</div>
    //         <div className="middleSectionWrapper">
    //             <div className="middleSection">
    //                 <img className="projImage" src={beachImage} alt="" />
    //                 <div className="donationSection">
    //                     <div className="donationBox">
    //                         <input
    //                             className="donationInput"
    //                             placeholder="AMOUNT"
    //                         />
    //                         <button className="donateButton">Donate</button>
    //                     </div>
    //                     <Link to="/uploadProof">
    //                         <button className="donateButton">
    //                             Upload Proof
    //                         </button>
    //                     </Link>
    //                     <div className="amountRaised">
    //                         $9850 raised so far! It's your turn to make a
    //                         difference!
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //         <div className="projectText">
    //             {/* <div className="callToAction">Donate & Help</div> */}
    //             <div className="backgroundInfo">
    //                 <div className="backgroundHeading">
    //                     Background of the Sustainability Organization
    //                 </div>
    //                 <div className="backgroundSubheading">
    //                     Organization Name: Clean Earth Collective Clean Earth
    //                     Collective is a nonprofit organization dedicated to
    //                     environmental sustainability through community-driven
    //                     projects that protect and restore natural ecosystems.
    //                     Since its inception in 2015, the organization has
    //                     initiated and supported projects focused on conserving
    //                     local water bodies, reducing waste, and promoting
    //                     biodiversity. With a strong commitment to education and
    //                     action, Clean Earth Collective collaborates with local
    //                     governments, businesses, and citizens to achieve a
    //                     lasting impact on the environment.
    //                 </div>
    //             </div>
    //             <div className="projectInfo">
    //                 <div className="projectHeading">
    //                     Full Project Description
    //                 </div>
    //                 <div className="projectSubheading">
    //                     The "River Renewal Action Day" is a community-driven
    //                     initiative focused on clearing debris, waste, and
    //                     invasive plant species from a local river, rejuvenating
    //                     its natural beauty and ecological health. Volunteers of
    //                     all ages are invited to participate in this full-day
    //                     event, where they will work together to remove litter,
    //                     repair pathways along the river, and plant native
    //                     vegetation along the riverbanks to prevent soil erosion.
    //                     By joining forces with local volunteers, ecologists, and
    //                     municipal partners, the Clean Earth Collective aims to
    //                     create a cleaner, safer habitat for aquatic life and
    //                     improve water quality for downstream communities. In
    //                     addition to the cleanup, educational stations along the
    //                     river will provide hands-on learning about the
    //                     importance of water ecosystems, the impact of pollution,
    //                     and the steps needed to maintain a thriving, sustainable
    //                     environment. Participants will receive training, safety
    //                     gear, and refreshments, with family-friendly activities
    //                     to engage children in understanding environmental
    //                     stewardship. This project not only restores the river
    //                     but builds awareness and community dedication toward
    //                     preserving local ecosystems for generations to come.
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
}
