import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import "../styles/CreateProjectPage.css";
export default function CreateProjectPage() {
    const [formData, setFormData] = useState({
        backgroundInfo: "",
        coverPhoto: null,
        projectName: "",
        projectDetails: "",
        shortDescription: "",
        projectDuration: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        setFormData({ ...formData, [name]: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
        // Handle form submission logic here
    };
    return (
        <div className="formWrapper">
            <Link className="toHome" to="/">
                <Logo className="logo" />
            </Link>
            <form
                onSubmit={handleSubmit}
                style={{ maxWidth: "600px", margin: "auto" }}
            >
                <h2>Create Project</h2>
                {/* Background Information */}
                <div>
                    <label htmlFor="backgroundInfo">
                        Background Information:
                    </label>
                    <textarea
                        id="backgroundInfo"
                        name="backgroundInfo"
                        value={formData.backgroundInfo}
                        onChange={handleInputChange}
                        placeholder="Provide background information"
                        required
                    />
                </div>

                {/* Cover Photo */}
                <div>
                    <label htmlFor="coverPhoto">Cover Photo:</label>
                    <input
                        type="file"
                        id="coverPhoto"
                        name="coverPhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                {/* Project Name */}
                <div>
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        placeholder="Enter project name"
                        required
                    />
                </div>

                {/* Project Details */}
                <div>
                    <label htmlFor="projectDetails">Project Details:</label>
                    <textarea
                        id="projectDetails"
                        name="projectDetails"
                        value={formData.projectDetails}
                        onChange={handleInputChange}
                        placeholder="Provide detailed information about the project"
                        required
                    />
                </div>

                {/* Short Description */}
                <div>
                    <label htmlFor="shortDescription">Short Description:</label>
                    <textarea
                        id="shortDescription"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        placeholder="Provide a short summary of the project"
                        required
                    />
                </div>

                {/* Estimated Project Duration */}
                <div>
                    <label htmlFor="projectDuration">
                        Estimated Project Duration:
                    </label>
                    <input
                        type="text"
                        id="projectDuration"
                        name="projectDuration"
                        value={formData.projectDuration}
                        onChange={handleInputChange}
                        placeholder="e.g., 3 weeks, 2 months"
                        required
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
