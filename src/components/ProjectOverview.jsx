// import oceanCleanup from "../assets/images/oceanCleanup.jpeg";
import "../styles/ProjectOverview.css";
import { Link } from "react-router-dom";
export default function ProjectOverview(props) {
    return (
        <div className="ProjectOverviewWrapper">
            {/* <img src={oceanCleanup} className="projectImage" /> */}
            <div className="projectOverview">
                <div className="projectOverviewText">
                    <div className="projectDate">{props.projectDate}</div>
                    <div className="projectTitle">{props.projectTitle}</div>
                    <div className="projectDescription">
                        {props.projectDescription}
                    </div>
                    </div>
                    {props.projectImage ? (
                        <img src={props.projectImage} alt={props.projectTitle} className="projectImage" />
                    ) : (
                        <p>No image available</p> // Fallback if there's no image
                    )}
                </div>
                <Link to={`/donation/${props.projectTitle}`}>
                    <button className="donateButton">Donate Now</button>
                </Link>
                {/* <button className="donateButton">Donate Now</button> */}
            </div>
    );
}
