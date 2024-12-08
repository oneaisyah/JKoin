export default async function fetchDataFromCID(cid) {
    if (!cid || typeof cid !== "string") {
        console.error("Invalid CID:", cid);
        return null;
    }

    const imageFetchUrl = `https://${cid}.ipfs.w3s.link/cover.jpg`;
    const dataFetchUrl = `https://${cid}.ipfs.w3s.link/data.json`;


    try {
        let result = {}; // Object to store successful results

        // Fetch the image
        try {
            const imageResponse = await fetch(imageFetchUrl);
            if (imageResponse.ok) {
                result.imageUrl = imageFetchUrl; // Save the image URL
            } else {
                console.warn(`Failed to fetch image: ${imageResponse.statusText}`);
            }
        } catch (imageError) {
            console.warn(`Error fetching image: ${imageError.message}`);
        }

        // Fetch the data
        try {
            const dataResponse = await fetch(dataFetchUrl);
            if (dataResponse.ok) {
                result.jsonData = await dataResponse.json(); // Parse the JSON data
            } else {
                console.warn(`Failed to fetch data: ${dataResponse.statusText}`);
            }
        } catch (dataError) {
            console.warn(`Error fetching data: ${dataError.message}`);
        }

        // If at least one is successful, return the result
        if (result.imageUrl || result.jsonData) {
            console.log("Successfully fetched data for CID:", cid);
            return result;
        }

        // If both fail, return null
        console.warn("Both image and data fetch failed for CID:", cid);
        return null;
    } catch (error) {
        console.error("Unexpected error during fetch operation:", error);
        return null;
    }
}
