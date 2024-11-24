import Web3 from "web3";

// const provider = `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURIA_API_KEY}`;
// const web3 = new Web3(new Web3.providers.HttpProvider(provider));

// Optional: Export wallet functionality if needed globally

const web3 = new Web3(window.ethereum);

export default web3;
