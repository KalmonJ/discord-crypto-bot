import { config } from "dotenv";
import { CryptoBot } from "./bot/Crypto";

config();

export async function createClient() {
  const cryptoBot = new CryptoBot();

  await cryptoBot.run();
}
