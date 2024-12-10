import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import "../styles/UploadImageProof.css";
import { uploadFiles } from "../utilities/uploadFiles.js";

export default function UploadImageProof() {
    const location = useLocation();
    const { isOwner } = location.state || false;
    // const [isOwner, setIsOwner] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        try {
            const cid = await uploadFiles(file);
            console.log("File uploaded with CID:", cid);
            alert(`Upload successful! CID: ${cid}`);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        }
    };

    useEffect(() => {
        console.log("isOwner:", isOwner);
    }, [isOwner]);

    return (
        <div className="upload-container">
            {isOwner ? (
                <div>
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
            ) : (
                <div>
                    <h1>Unauthorized Access</h1>
                    <p>
                        You are not authorized to upload image proof for this
                        project.
                    </p>
                </div>
            )}
        </div>
    );
}
