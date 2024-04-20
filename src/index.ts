import { createClient } from "./client";
import { updateCommands } from "./utils/UpdateCommands";

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
  await updateCommands(commands);
  await createClient();
};

run().catch((error) => {
  console.log(error);
  process.exit(1);
});

process.on("uncaughtException", console.log);
