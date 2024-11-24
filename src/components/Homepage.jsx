import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import forestImg from "../assets/images/treeBg.jpeg";
import "../styles/Homepage.css";
import getAllProjects from "../utilities/getAllProjects";
import ProjectOverview from "./ProjectOverview";
export default function Homepage({
    projectDateArr,
    projectTitleArr,
    projectDescriptionArr,
}) {
    function generateProjectsList(
        projectDateArr,
        projectTitleArr,
        projectDescriptionArr
    ) {
        let projectOverviewArr = [];
        for (let i = 0; i < projectDateArr.length; i++) {
            projectOverviewArr.push(
                <ProjectOverview
                    projectDate={projectDateArr[i]}
                    projectTitle={projectTitleArr[i]}
                    projectDescription={projectDescriptionArr[i]}
                />
            );
        }
        return projectOverviewArr;
    }
    console.log(getAllProjects());
    return (
        <div className="homepageWrapper">
            <div className="intro">
                <img className="forestImg" src={forestImg} />
                <Link className="toHome" to="/">
                    <Logo className="logo" />
                </Link>
                <Link className="toCreateProject" to="/createProject">
                    <button className="createProjectButton">
                        Create Project
                    </button>
                </Link>
                <div className="heading">
                    <div className="headingWords">
                        <span className="headingWord1">Blockchain </span>
                        <span className="headingWord2">for </span>
                        <span className="headingWord3">earth. </span>
                    </div>
                    <div className="subHeading">
                        Join us on Our Green Journey
                    </div>
                </div>
            </div>
            <div className="currentProjects">
                <div className="currentProjectsText">
                    <span className="currentWord">Current </span>
                    <span className="projectsWord">Projects</span>
                </div>
                {/* <div className="currentProjectsDescription"></div> */}
                <div className="allProjectsOverview">
                    {generateProjectsList(
                        projectDateArr,
                        projectTitleArr,
                        projectDescriptionArr
                    )}
                </div>
            </div>
        </div>
    );
}
