import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import forestImg from "../assets/images/treeBg.jpeg";
import { useState, useEffect } from "react";
import "../styles/Homepage.css";
import getAllProjects from "../utilities/getAllProjects";
import ProjectOverview from "./ProjectOverview";

async function fetchImageFromCID(cid){
    if (!cid || typeof cid !== "string") {
        console.error("Invalid CID:", cid);
        return null;
    }
    const gatewayURL = `https://cloudflare-ipfs.com/ipfs/${cid}`;

    try {
        const response = await fetch(gatewayURL);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        return gatewayURL; // Return the gateway URL directly
    } catch (error) {
        console.error("Error fetching image from IPFS:", error);
        return null;
    }
}

export default function Homepage() {
    const [projects, setProjects] = useState([]); // Store project data with images
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        async function fetchProjects() {
            try {
                // Step 1: Fetch project data
                const projectData = await getAllProjects();

                // Step 2: Fetch images for each project
                const projectsWithImages = await Promise.all(
                    projectData.map(async (project) => {
                        if (!project.coverPhotoCID) {
                            console.warn("Missing CID for project:", project);
                            return { ...project, image: null };
                        }
                        const image = await fetchImageFromCID(project.coverPhotoCID);
                        return { ...project, image };
                    })
                );

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
        return projects.map((project, index) => (
            <ProjectOverview
                key={index}
                projectDate={project.endDate} // Assuming endDate as project date
                projectAddress={project.address} 
                projectTitle={project.title}
                projectDescription={project.description}
                projectImage={project.image} // Pass the image URL
            />
        ));
    }

    return (
        <div className="homepageWrapper">
            <div className="intro">
                <img className="forestImg" src={forestImg} alt="Background Forest" />
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

// export default function Homepage({
//     projectDateArr,
//     projectTitleArr,
//     projectDescriptionArr,
// }) {
//     // function generateProjectsList(
//     //     projectDateArr,
//     //     projectTitleArr,
//     //     projectDescriptionArr
//     // ) {
//     //     let projectOverviewArr = [];
//     //     for (let i = 0; i < projectDateArr.length; i++) {
//     //         projectOverviewArr.push(
//     //             <ProjectOverview
//     //                 projectDate={projectDateArr[i]}
//     //                 projectTitle={projectTitleArr[i]}
//     //                 projectDescription={projectDescriptionArr[i]}
//     //             />
//     //         );
//     //     }
//     //     return projectOverviewArr;
//     // }
//     function generateProjectsList() {
//         return projects.map((project) => (
//             <ProjectOverview
//                 key={project.address} // Use a unique identifier, such as the project address
//                 projectDate={project.endDate} // Assuming endDate as project date
//                 projectTitle={project.title}
//                 projectDescription={project.description}
//                 projectImage={project.image} // Pass the image URL
//             />
//         ));
//     }
//     console.log(getAllProjects());
//     return (
//         <div className="homepageWrapper">
//             <div className="intro">
//                 <img className="forestImg" src={forestImg} />
//                 <Link className="toHome" to="/">
//                     <Logo className="logo" />
//                 </Link>
//                 <Link className="toCreateProject" to="/createProject">
//                     <button className="createProjectButton">
//                         Create Project
//                     </button>
//                 </Link>
//                 <div className="heading">
//                     <div className="headingWords">
//                         <span className="headingWord1">Blockchain </span>
//                         <span className="headingWord2">for </span>
//                         <span className="headingWord3">earth. </span>
//                     </div>
//                     <div className="subHeading">
//                         Join us on Our Green Journey
//                     </div>
//                 </div>
//             </div>
//             <div className="currentProjects">
//                 <div className="currentProjectsText">
//                     <span className="currentWord">Current </span>
//                     <span className="projectsWord">Projects</span>
//                 </div>
//                 {/* <div className="currentProjectsDescription"></div> */}
//                 <div className="allProjectsOverview">
//                     {generateProjectsList(
//                         projectDateArr,
//                         projectTitleArr,
//                         projectDescriptionArr
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
