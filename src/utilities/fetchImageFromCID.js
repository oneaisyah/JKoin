export default async function fetchImageFromCID(cid, projectIndex) {
    if (!cid || typeof cid !== "string") {
        console.error("Invalid CID:", cid);
        return null;
    }
    const hardCodedprojectName = "asd"
    const hardCodedIndex = "6";
    //replace index with projectIndex
    const imageFetchUrl = `https://${cid}.ipfs.w3s.link/${hardCodedIndex}-cover.jpg`;
    const dataFetchUrl = `https://${cid}.ipfs.w3s.link/${hardCodedprojectName}-data.json`;
    try {
        // Fetch the image
        const imageResponse = await fetch(imageFetchUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }
        const imageUrl = imageFetchUrl; // Use the image URL directly

        // Fetch the data
        const dataResponse = await fetch(dataFetchUrl);
        if (!dataResponse.ok) {
            throw new Error(`Failed to fetch data: ${dataResponse.statusText}`);
        }
        const jsonData = await dataResponse.json(); // Parse the JSON data
        console.log(imageUrl, jsonData)

        // Return both the image URL and the parsed data
        return { imageUrl, jsonData };
    } catch (error) {
        console.error("Error fetching data from IPFS:", error);
        return null;
    }
}