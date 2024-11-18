import oceanCleanup from "../assets/images/oceanCleanup.jpeg";
import "../styles/ProjectOverview.css";
export default function ProjectOverview(props) {
    return (
        <div className="ProjectOverviewWrapper">
            <img src={oceanCleanup} className="projectImage" />
            <div className="projectOverview">
                <div className="projectDate">{props.projectDate}</div>
                <div className="projectTitle">{props.projectTitle}</div>
                <div className="projectDescription">
                    {props.projectDescription}
                </div>
                <button className="donateButton">Donate Now</button>
            </div>
        </div>
    );
}
