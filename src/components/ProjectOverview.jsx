// import oceanCleanup from "../assets/images/oceanCleanup.jpeg";
import "../styles/ProjectOverview.css";
import { Link, useNavigate } from "react-router-dom";
export default function ProjectOverview(props) {
    const { projectDate, projectAddress, projectTitle, projectDescription, projectBackgroundInfo, projectOwner, isOwner } = props;
    const navigate = useNavigate();
    console.log(props);

    const handleDonateClick = () => {
        navigate(`/donation/${projectTitle}`, {
            state: {
                projectAddress: projectAddress,
                projectDescription: projectDescription,
                projectOwner: projectOwner,
                projectBackgroundInfo: projectBackgroundInfo,
                isOwner: isOwner,
            },
        });
    }


    // console.log("ProjectDescription:", projectDescription);
    return (
        <div className="ProjectOverviewWrapper">
            {/* <img src={oceanCleanup} className="projectImage" /> */}
            <div className="projectOverview">
                <div className="projectOverviewText">
                    <div className="projectDate">{projectDate}</div>
                    <div className="projectTitle">{projectTitle}</div>
                    <div className="projectDescription">
                        {projectDescription}
                    </div>
                </div>
                {props.projectImage ? (
                    <img src={props.projectImage} alt={props.projectTitle} className="projectImage" />
                ) : (
                    <p>No image available</p> // Fallback if there's no image
                )}
            </div>
            <button className="donateButton" onClick={ handleDonateClick }>Donate Now</button>
        </div>
    );
}
