import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './App.css';
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
  const [projectAddresses, setProjectAddresses] = useState([]);


  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectAddresses = await getAllProjectAddresses();
        setProjectAddresses(projectAddresses);
        const projectsDetails = await Promise.allSettled(
          projectAddresses.map(async (address) => {
            const { endDateObject, projectCID, projectTotalDonation, projectOwner } =
              await getCIDAndEndDateFromAddress(address);
            const projectTotalDonationInEther = Web3.utils.fromWei(projectTotalDonation, 'ether');
            const { imageUrl, jsonData } = await fetchDataFromCID(
              projectCID
            );
            const mergedJson = { ...jsonData, endDateObject, projectAddress: address, totalDonation: projectTotalDonationInEther, projectOwner: projectOwner };

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

  // const projDataLength = JSON.stringify(projectData["projectTitleArr"].length)

  const router = createBrowserRouter([
    { path: "/", element: <Homepage projects={projects} loading={loading} /> },
    { path: "/donation/:projectTitle", element: <DonationPage /> },
    { path: "/project", element: <DonationPage /> },
    { path: "/createProject", element: <CreateProjectPage projDataLength={projectAddresses.length} /> },
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
