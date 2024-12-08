import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import forestImg from "../assets/images/treeBg.jpeg";
import "../styles/Homepage.css";
import fetchDataFromCID from "../utilities/fetchDataFromCID";
import getAllProjectAddresses from "../utilities/getAllProjects";
import getCIDAndEndDateFromAddress from "../utilities/getCIDFromAddress";
import ProjectOverview from "./ProjectOverview";

export default function Homepage() {
    const [projects, setProjects] = useState([]); // Store project data with images
    const [loading, setLoading] = useState(true); // Loading state
    const hardCodedCid =
        "bafybeiecljye4dvylbmjd33bhqnrdb2xsejcy2oqdkufszselaqjjjis2a";

    useEffect(() => {
        async function fetchProjects() {
            try {
                // Step 1: Fetch project data
                const projectAddresses = await getAllProjectAddresses();
                console.log(projectAddresses);
                //remove
                const projIndex = "metrology.jpg";
                // Step 2: Fetch images for each project
                const projectsDetails = await Promise.allSettled(
                    projectAddresses.map(async (address) => {
                        const { endDateObject, projectCID } =
                            await getCIDAndEndDateFromAddress(address);
                        console.log(endDateObject, projectCID);
                        const { imageUrl, jsonData } = await fetchDataFromCID(
                            projectCID
                        );
                        const mergedJson = { ...jsonData, endDateObject };
                        console.log(`mergedJson:${JSON.stringify(mergedJson)}`);
                        return { image: imageUrl, mergedJson };
                    })
                );
                const successfulProjects = projectsDetails
                    .filter((result) => result.status === "fulfilled")
                    .map((result) => result.value);
                setProjects(successfulProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false); // End loading state
            }
        }

        fetchProjects();
    }, []);

    function generateProjectsList() {
        console.log(projects);
        return projects.map((project, index) => (
            <ProjectOverview
                key={index}
                projectDate={`End Date: ${JSON.stringify(
                    project.mergedJson.endDateObject
                )}`}
                projectAddress={"Unknown Address"} // Replace with a meaningful value if available
                projectTitle={project.mergedJson.projectName} // Map to the project name
                projectDescription={project.mergedJson.projectDetails} // Map to project details
                projectBackgroundInfo={project.mergedJson.backgroundInfo} // Map to background info
                projectImage={project.image} // Use the image URL
                projectOwner={"Unknown Owner"} // Replace with a meaningful value if available
                isOwner={false} // Default or calculated value
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
