import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './App.css';
import CreateProjectPage from "./components/CreateProjectPage.jsx";
import DonationPage from './components/DonationPage.jsx';
import Homepage from "./components/Homepage.jsx";
import UploadImageProof from "./components/UploadImageProof.jsx";
function App() {

  //insert api call to backend
  const projectData = {
    projectDateArr: JSON.parse(process.env.REACT_APP_PROJECT_DATEARR),
    projectTitleArr: JSON.parse(process.env.REACT_APP_PROJECT_TITLEARR),
    projectDescriptionArr: JSON.parse(process.env.REACT_APP_PROJECT_DESCARR),
  };

  const router = createBrowserRouter([
    { path: "/", element: <Homepage {...projectData} /> }, { path: "/project", element: <DonationPage /> }, { path: "/createProject", element: <CreateProjectPage /> }, { path: "/uploadProof", element: <UploadImageProof /> }
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
