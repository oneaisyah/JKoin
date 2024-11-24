import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import "../styles/UploadImageProof.css";
import { uploadFile } from "../utilities/uploadFiles.js";

export default function UploadImageProof() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        try {
            const cid = await uploadFile(file);
            console.log("File uploaded with CID:", cid);
            alert(`Upload successful! CID: ${cid}`);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        }
    };

    return (
        <div className="upload-container">
            <Link className="toHome" to="/">
                <Logo className="logo" />
            </Link>
            <h1>Upload Image Proof</h1>
            <input
                type="file"
                className="file-input"
                onChange={handleFileChange}
                accept="image/*"
            />
            <button onClick={handleUpload}>Upload Image</button>
        </div>
    );
}
