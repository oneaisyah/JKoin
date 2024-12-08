import * as Client from "@web3-storage/w3up-client";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";

// Initialize the Web3.Storage client
export async function makeStorageClient() {
    try {
        const principal = Signer.parse(process.env.REACT_APP_KEY);
        const store = new StoreMemory();
        const client = await Client.create({ principal, store });
        const proof = await Proof.parse(process.env.REACT_APP_PROOF);
        const space = await client.addSpace(proof);
        await client.setCurrentSpace(space.did());

        return client;
    } catch (error) {
        console.error("Error creating storage client:", error);
        throw error;
    }
}

// Function to upload a file to Web3.Storage
export async function uploadFiles(files) {
    try {
        if (!files) {
            throw new Error("No file provided for upload");
        }
        const client = await makeStorageClient();
        const directoryCid = await client.uploadDirectory(files);
        return directoryCid;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}
