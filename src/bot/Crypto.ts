import { Client, GatewayIntentBits, Partials } from "discord.js";
import { isCrypto } from "../@types";
import { CryptoService } from "../services/CryptoService";

export class CryptoBot {
  bitcoinPrice: number | undefined;

  client: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message],
  });

  async run() {
    await this.client.login(process.env.TOKEN ?? "");

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user!.tag}!`);
    });

    await this.interactionCommand();

    await this.messageCreate();

    await this.trackingBitcoin();
  }

  async interactionCommand() {
    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === "trending") {
        await interaction.reply(
          "Aqui está as cryptos em alta nas ultimas 24 horas:"
        );

        const trendingCryptos = await CryptoService.trends();

        trendingCryptos.coins.forEach(async (crypto) => {
          await interaction.channel?.send(
            `nome: ${crypto.item.name}\npreço: ${crypto.item.data.price}\nsímbolo: ${crypto.item.symbol}`
          );
        });
      }
    });
  }

  async trackingBitcoin() {
    const fiveHours = 2 * 60 * 1000;

    setInterval(async () => {
      const crypto = await CryptoService.search("bitcoin");
      if (!crypto) return;
      const responseCrypto = await CryptoService.findCryptoById(crypto.id);
      this.bitcoinPrice = responseCrypto.market_data.current_price.en;
      console.log("aquii");
    }, fiveHours);
  }

  async messageCreate() {
    this.client.on("messageCreate", async (message) => {
      const botMention = `<@${this.client.user!.id}>`;
      const findSearchEntry = /<@\w+>\s?pesquise\s?:\s?(.+)/i;
      const rgxResponse = findSearchEntry.exec(message.content);

      // comando de ajuda
      if (message.content === botMention) {
        message.reply("Use / para visualizar a lista de comandos");
      }

      // pesquisa via chat
      if (!message.guild && findSearchEntry.test(message.content)) {
        if (rgxResponse && rgxResponse[1]) {
          const cryptoQuery = rgxResponse[1];
          const queryCryptoResponse = await CryptoService.search(cryptoQuery);

          if (!isCrypto(queryCryptoResponse)) {
            await message.author.send(
              "Ops não encontrei!! Tente pesquiser a sigla ou o nome da moeda."
            );
          }

          if (isCrypto(queryCryptoResponse)) {
            const crypto = await CryptoService.findCryptoById(
              queryCryptoResponse.id
            );

            const percentageChange =
              crypto.market_data.price_change_percentage_24h;

            await message.author.send(
              `Encontrei!!\n\nnome: ${
                queryCryptoResponse.name
              }\npreço: ${new Intl.NumberFormat("pt-br", {
                currency: "BRL",
                style: "currency",
                maximumFractionDigits: 2,
              }).format(crypto.market_data.current_price.brl)}\nvariação: ${
                percentageChange > 0
                  ? `${percentageChange.toFixed(2)}% \u2191`
                  : percentageChange == 0
                  ? `${percentageChange.toFixed(2)}`
                  : `${percentageChange.toFixed(2)}% \u2193`
              }`
            );
          }
        }
      }
    });
  }
}
