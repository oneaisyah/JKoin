import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/JKoin.svg";
import "../styles/UploadImageProof.css";
import { uploadFiles } from "../utilities/uploadFiles.js";
import Web3 from "web3";
import projectABI from "../abi/ProjectABI.json";

export default function UploadImageProof() {
    const location = useLocation();
    const { isOwner, projectAddress } = location.state || false;
    const [proofPhotoCID, setProofPhotoCID] = useState("");
    const [proofPhoto, setProofPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingError, setUploadingError] = useState(true);

    const handleFileChange = (e) => {
        setProofPhoto(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!proofPhoto) {
            alert("No file selected for upload");
            return;
        }
        setUploading(true);
        // await uploadToIPFS();
        const cid = await uploadToIPFS();
        setProofPhotoCID(cid);
        await uploadToContract(cid);
    };

    const uploadToIPFS = async () => {
        try {
            const file = new File([proofPhoto], `proof.jpg`, { type: proofPhoto.type });

            const cid = await uploadFiles([file]);
            return cid.toString();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const uploadToContract = async (cid) => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const selectedAddress = accounts[0];
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(projectABI, projectAddress);

            const transaction = await contract.methods.uploadProof(cid).send({ from: selectedAddress });
            setUploadingError(false);
            alert("Proof uploaded successfully");
        }
        catch (error) {
            console.error("Error uploading proof to contract:", error);
            alert("Error uploading proof to contract. Please try again.");
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
                    <div className="upload-proof">
                        <h1>Upload Image Proof</h1>
                        <input
                            type="file"
                            className="file-input"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <button onClick={handleUpload}>Upload Image</button>
                        {uploading && <p className="after-upload">Uploading...</p>}
                        {proofPhotoCID && (
                            uploadingError ? <p className="after-upload">Error uploading image {proofPhotoCID}</p> :
                            <div className="after-upload">
                                <h2>Image Proof Uploaded Successfully</h2>
                                <p>Proof CID: {proofPhotoCID}</p>
                            </div>
                        )}
                    </div>
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
