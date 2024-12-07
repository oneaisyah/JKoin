import { Link, useParams } from "react-router-dom";
import beachImage from "../assets/images/beachCleanup.jpeg";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import "../styles/DonationPage.css";
export default function DonationPage() {
    const { projectTitle } = useParams();

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
                    <img className="projImage" src={beachImage} alt="" />
                    <div className="donationSection">
                        <div className="donationBox">
                            <input className="donationInput" placeholder="AMOUNT" />
                            <button className="donateButton">Donate</button>
                        </div>
                        <Link to="/uploadProof">
                            <button className="donateButton">Upload Proof</button>
                        </Link>
                        <div className="amountRaised">
                            $9850 raised so far! It's your turn to make a difference!
                        </div>
                    </div>
                </div>
            </div>
            <div className="projectText">
                <div className="backgroundInfo">
                    <div className="backgroundHeading">
                        Background of the Sustainability Organization
                    </div>
                    <div className="backgroundSubheading">
                        Organization Name: Clean Earth Collective
                    </div>
                </div>
                <div className="projectInfo">
                    <div className="projectHeading">Full Project Description</div>
                    <div className="projectSubheading">
                        Full details of the project with the address {projectTitle} will go here.
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
