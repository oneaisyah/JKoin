import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './App.css';
import { useEffect, useState } from "react";
import CreateProjectPage from "./components/CreateProjectPage.jsx";
import DonationPage from './components/DonationPage.jsx';
import Homepage from "./components/Homepage.jsx";
import UploadImageProof from "./components/UploadImageProof.jsx";
import fetchDataFromCID from "./utilities/fetchDataFromCID.js";
import getAllProjectAddresses from "./utilities/getAllProjects.js";
import getCIDAndEndDateFromAddress from "./utilities/getCIDFromAddress.js";
import Web3 from "./utilities/web3.js";

function App() {
  const [projects, setProjects] = useState([]); // Store project data with images
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchProjects() {
        try {
            const projectAddresses = await getAllProjectAddresses();
            const projectsDetails = await Promise.allSettled(
                projectAddresses.map(async (address) => {
                    const { endDateObject, projectCID , projectTotalDonation, projectOwner} =
                        await getCIDAndEndDateFromAddress(address);
                    const projectTotalDonationInEther = Web3.utils.fromWei(projectTotalDonation, 'ether');  
                    const { imageUrl, jsonData } = await fetchDataFromCID(
                        projectCID
                    );
                    const mergedJson = { ...jsonData, endDateObject, projectAddress: address, totalDonation: projectTotalDonationInEther, projectOwner: projectOwner };
                    
                    return { image: imageUrl ,mergedJson };
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

  const projectData = {
    projectDateArr: JSON.parse(process.env.REACT_APP_PROJECT_DATEARR),
    projectTitleArr: JSON.parse(process.env.REACT_APP_PROJECT_TITLEARR),
    projectDescriptionArr: JSON.parse(process.env.REACT_APP_PROJECT_DESCARR),
  };
  const projDataLength = JSON.stringify(projectData["projectTitleArr"].length)

  const router = createBrowserRouter([
    { path: "/", element: <Homepage projects={projects} loading={loading}/> },
    { path: "/donation/:projectTitle", element: <DonationPage /> },
    { path: "/project", element: <DonationPage /> },
    { path: "/createProject", element: <CreateProjectPage projDataLength={projDataLength}/> },
    { path: "/uploadProof/:projectTitle", element: <UploadImageProof /> }
  ])
  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
