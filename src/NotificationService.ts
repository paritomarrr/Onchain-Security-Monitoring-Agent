import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export async function sendAlert(message: string) {
    await axios.post(process.env.DISCORD_WEBHOOK_URL!, {
        content: message,
    })
}