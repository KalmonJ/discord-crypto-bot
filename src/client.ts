import { config } from "dotenv";
import { CryptoBot } from "./bot/Crypto";

config();

export async function createClient() {
  const cryptoBot = new CryptoBot();

  await cryptoBot.run();
}

// const generalChannel = await client.channels.fetch("1098072633104400507", {
//   allowUnknownGuild: true,
//   cache: true,
//   force: true,
// });

// if (generalChannel && generalChannel.isTextBased()) {
//   // identificar variação do preço do bitcoin e notificar
//   // setInterval(() => {
//   //   generalChannel.send("hello world");
//   // }, 1000);
// }
