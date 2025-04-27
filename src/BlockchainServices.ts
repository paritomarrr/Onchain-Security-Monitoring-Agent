import { ethers } from "ethers";
import { ABI } from "./config";
import * as dotenv from "dotenv";

dotenv.config();

// Connect to local forked blockchain
export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Wallet (can be any unlocked Anvil/Hardhat account)
export const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// Returns contract instance
export const getContract = (address: string) => {
  return new ethers.Contract(address, ABI, signer);
};

// Gets native token balance (ETH on Base)
export const getBalance = async (address: string) => {
  const balance = await provider.getBalance(address);
  return parseFloat(ethers.formatEther(balance));
};
