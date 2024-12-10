// import oceanCleanup from "../assets/images/oceanCleanup.jpeg";
import { useNavigate } from "react-router-dom";
import "../styles/ProjectOverview.css";
export default function ProjectOverview(props) {
    const {
        projectDate,
        projectAddress,
        projectTitle,
        projectDescription,
        projectBackgroundInfo,
        projectImage,
        projectOwner,
        isOwner,
        totalDonation,
        goalAmount,
    } = props;
    const navigate = useNavigate();

    console.log("Navigating with totalDonation in project overview:", totalDonation);
    console.log(props);

    const handleDonateClick = () => {
        navigate(`/donation/${projectAddress}`, {
            state: {
                projectAddress: projectAddress,
                projectDescription: projectDescription,
                projectTitle: projectTitle,
                projectOwner: projectOwner,
                projectBackgroundInfo: projectBackgroundInfo,
                isOwner: isOwner,
                totalDonation: totalDonation,
                goalAmount: goalAmount,
                projectImage: projectImage,
            },
        });
    };

    // console.log("ProjectDescription:", projectDescription);
    return (
        <div className="ProjectOverviewWrapper">
            {/* <img src={oceanCleanup} className="projectImage" /> */}
            <div className="projectOverview">
                <div className="projectOverviewText">
                    <div className="projectTitle">{projectTitle}</div>
                    <div className="projectDate">{projectDate}</div>
                    <div className="projectDescription">
                        {projectDescription}
                    </div>
                </div>
                {props.projectImage ? (
                    <img
                        src={projectImage}
                        alt={props.projectTitle}
                        className="projectImage"
                    />
                ) : (
                    <p>No image available</p> // Fallback if there's no image
                )}
            </div>
            <button className="donateButton" onClick={handleDonateClick}>
                Donate Now
            </button>
        </div>
    );
}
