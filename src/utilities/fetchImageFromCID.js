export default async function fetchImageFromCID(cid, projectIndex) {
    if (!cid || typeof cid !== "string") {
        console.error("Invalid CID:", cid);
        return null;
    }

    const index = "metrology.jpg";
    //replace index with projectIndex
    const gatewayURL = `https://${cid}.ipfs.w3s.link/${index}`;

    try {
        const response = await fetch(gatewayURL);
        if (!response.ok)
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        return gatewayURL; // Return the gateway URL directly
    } catch (error) {
        console.error("Error fetching image from IPFS:", error);
        return null;
    }
}