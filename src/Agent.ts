import { getContract, provider } from "./BlockchainServices";  // ✅ import provider separately
import { CONTRACT_ADDRESS, THRESHOLD_PERCENTAGE } from "./config";
import { sendAlert } from "./NotificationService";
import { ethers } from "ethers";

export async function startAgent() {
    const contract = getContract(CONTRACT_ADDRESS);

    console.log(`👀 Monitoring Contract: ${CONTRACT_ADDRESS}`);

    let lastBlock = await provider.getBlockNumber();  // ✅ use provider directly
    console.log(`Starting from block: ${lastBlock}`);

    setInterval(async () => {
        const currentBlock = await provider.getBlockNumber();  // ✅ use provider directly

        if (currentBlock > lastBlock) {
            console.log(`Checking blocks from ${lastBlock} to ${currentBlock}...`);

            const events = await contract.queryFilter(
                "Transfer",
                lastBlock,
                currentBlock
            );

            for (const event of events) {
                const parsedLog = contract.interface.parseLog(event);
                const args = parsedLog?.args;
                if (!args) {
                    console.warn("Parsed log is null or missing arguments.");
                    continue;
                }

                const from = args.from;
                const to = args.to;
                const value = args.value;

                const transferAmount = parseFloat(ethers.formatEther(value));
                const assumedTotalSupply = 500_000_000;
                const transferPercent = (transferAmount / assumedTotalSupply) * 100;
                
                console.log(`
                🚀 Transfer Detected!
                -------------------------------
                🔵 From: ${from}
                🟢 To: ${to}
                💰 Amount: ${transferAmount.toLocaleString()} Tokens
                📊 Transfer Percentage: ${transferPercent.toFixed(4)}%
                -------------------------------
                `);
                
                if (transferPercent > THRESHOLD_PERCENTAGE) {
                    const alertMsg = `🚨 Suspicious Transfer Detected! 
                - From: ${from}
                - To: ${to}
                - Amount: ${transferAmount}
                - Transfer Percentage: ${transferPercent.toFixed(2)}%`;
                
                    await sendAlert(alertMsg);
                }
                

                if (transferPercent > THRESHOLD_PERCENTAGE) {
                    const alertMsg = `🚨 Suspicious Transfer Detected! 
- From: ${from}
- To: ${to}
- Amount: ${transferAmount}
- Transfer Percentage: ${transferPercent.toFixed(2)}%`;

                    await sendAlert(alertMsg);
                }
            }

            lastBlock = currentBlock;
            console.log(`Starting from block: ${lastBlock}`);

        }
    }, 5000); // Poll every 5 seconds
}
