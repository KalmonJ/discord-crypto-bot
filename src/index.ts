import { createClient } from "./client";
import { updateCommands } from "./utils/UpdateCommands";
import { generateDependencyReport } from "@discordjs/voice";

const commands = [
  {
    name: "trending",
    description: "trending cryptos",
  },
  {
    name: "join",
    description: "join voice channel",
  },
];

const run = async () => {
  console.log(generateDependencyReport());
  await updateCommands(commands);
  await createClient();
};

run().catch((error) => {
  console.log(error);
  process.exit(1);
});

process.on("uncaughtException", console.log);
