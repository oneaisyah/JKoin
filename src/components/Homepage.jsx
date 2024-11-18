import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import forestImg from "../assets/images/treeBg.jpeg";
import "../styles/Homepage.css";
import ProjectOverview from "./ProjectOverview";
export default function Homepage() {
    //insert api call to backend
    const projectDateArr = [
        "June 27, 2021",
        "June 27, 2021",
        "June 27, 2021",
        "June 27, 2021",
        "June 27, 2021",
        "June 27, 2021",
    ];
    const projectTitleArr = [
        "River Renewal Action Day",
        "Sustainable Outreach Assistant",
        "Community Garden Helper",
        "Sianka Forest Fire",
        "Saporo Earthquake",
        "Lidu Land Drought",
    ];
    const projectDescriptionArr = [
        "Join us to clear and revitalize our local river, restoring its beauty and health for the community and wildlife",
        "Emergency! A tsunami has just hit Malika, Tarasudi District. Help our affected brothers and sisters.",
        "Assist with planting, maintenance, and community education at a local garden. Grow food sustainably while educating residents about urban agriculture.",
        "The Sianka forest has caught fire and affected the surrounding community. Let's help buy their health facilities!",
        "A magnitude 7.3 earthquake has shaken Saporo sub-district, help them recover with food and medicine.",
        "The people of Tanah Lidu are currently suffering from drought, help them get clean water!",
    ];
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
    return (
        <div className="homepageWrapper">
            <div className="intro">
                <img className="forestImg" src={forestImg} />
                <Logo className="logo" />
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
