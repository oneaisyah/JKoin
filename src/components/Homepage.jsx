import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import forestImg from "../assets/images/treeBg.jpeg";
import "../styles/Homepage.css";
import ProjectOverview from "./ProjectOverview";

export default function Homepage({projects, loading}) {
    // const hardCodedCid =
    //     "bafybeiecljye4dvylbmjd33bhqnrdb2xsejcy2oqdkufszselaqjjjis2a";

    function generateProjectsList() {
        console.log(projects);
        return projects.map((project, index) => (
            <ProjectOverview
                key={index}
                projectDate={`End Date: ${project.mergedJson.endDateObject}`}
                projectAddress={project.mergedJson.projectAddress} // Replace with a meaningful value if available
                projectTitle={project.mergedJson.projectName} // Map to the project name
                projectDescription={project.mergedJson.projectDetails} // Map to project details
                projectBackgroundInfo={project.mergedJson.backgroundInfo} // Map to background info
                projectImage={project.image} // Use the image URL
                projectOwner={project.projectOwner} // Replace with a meaningful value if available
                isOwner={false} // Default or calculated value
                totalDonation={project.mergedJson.totalDonation}
            />
        ));
    }
    return (
        <div className="homepageWrapper">
            <div className="intro">
                <img
                    className="forestImg"
                    src={forestImg}
                    alt="Background Forest"
                />
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
                        <span className="headingWord3">Earth </span>
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
                <div className="allProjectsOverview">
                    {loading ? (
                        <p>Loading projects...</p>
                    ) : (
                        generateProjectsList()
                    )}
                </div>
            </div>
        </div>
    );
}
