const { ethers } = require("ethers");
require('dotenv').config();

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tokenABI = [
        "function transfer(address to, uint amount) public returns (bool)",
    ];

    const token = new ethers.Contract(
        "0xF01f4567586c3A707EBEC87651320b2dd9F4A287",
        tokenABI,
        signer
    );

    const receiver = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // another anvil account
    const amount = ethers.parseUnits("1.0", 6); // 1 USDC (6 decimals)

    const tx = await token.transfer(receiver, amount);
    console.log("Transfer Tx sent:", tx.hash);
    await tx.wait();
    console.log("✅ Transfer completed");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
