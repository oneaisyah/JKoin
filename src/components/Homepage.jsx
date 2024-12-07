import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import forestImg from "../assets/images/treeBg.jpeg";
import "../styles/Homepage.css";
import fetchImageFromCID from "../utilities/fetchImageFromCID";
import getAllProjects from "../utilities/getAllProjects";
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
                const projectData = await getAllProjects();
                //remove
                const projIndex = "metrology.jpg";
                // Step 2: Fetch images for each project
                const projectsWithImages = await Promise.all(
                    projectData.map(async (project, index) => {
                        if (!project.coverPhotoCID) {
                            console.warn(
                                `Missing CID for project at index ${index}:`,
                                project
                            );
                            return { ...project, image: null };
                        }

                        // CHANGEEE, second
                        const { imageUrl, jsonData } = await fetchImageFromCID(
                            hardCodedCid,
                            0
                        );
                        return { ...project, image: imageUrl, jsonData };
                    })
                );
                console.log(projectsWithImages);
                setProjects(projectsWithImages); // Update state with projects
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
                projectDate={project.endDate} // Assuming endDate as project date
                projectAddress={project.address}
                projectTitle={project.title}
                projectDescription={project.description}
                projectBackgroundInfo={project.backgroundInfo}
                projectImage={project.image} // Pass the image URL
                projectOwner={project.owner}
                isOwner={project.isOwner}
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
                    <button className="createProjectButton">Create Project</button>
                </Link>
                <div className="heading">
                    <div className="headingWords">
                        <span className="headingWord1">Blockchain </span>
                        <span className="headingWord2">for </span>
                        <span className="headingWord3">earth. </span>
                    </div>
                    <div className="subHeading">Join us on Our Green Journey</div>
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