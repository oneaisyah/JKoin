import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './App.css';
import DonationPage from './components/DonationPage';
import Homepage from "./components/Homepage";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Homepage /> }, { path: "/project", element: <DonationPage /> }
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
