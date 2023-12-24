import { REST, Routes } from "discord.js";
import { config } from "dotenv";

config();

type Command = {
  name: string;
  description: string;
};

export const updateCommands = async (commands: Command[]) => {
  try {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN ?? "");

    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID ?? ""), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
