import {
  Client,
  GatewayIntentBits,
  InternalDiscordGatewayAdapterCreator,
  Partials,
} from "discord.js";
import { isCrypto } from "../@types";
import { CryptoService } from "../services/CryptoService";
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  createDefaultAudioReceiveStreamOptions,
  StreamType,
} from "@discordjs/voice";

import { createReadStream } from "fs";
import internal from "stream";

export class CryptoBot {
  bitcoinPrice: number | undefined;

  generalChannelId = "1098072633104400507";

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

      if (interaction.commandName === "join") {
        if (interaction.channel?.isVoiceBased()) {
          const connection = joinVoiceChannel({
            channelId: interaction.channelId,
            guildId: interaction.guildId as string,
            adapterCreator: interaction.guild
              ?.voiceAdapterCreator as InternalDiscordGatewayAdapterCreator,
            selfMute: false,
            selfDeaf: false,
          });

          const audioStream = createReadStream(
            "src/assets/Encerramento Do Windows Xp Estourado.mp3"
          );

          console.log(audioStream);

          const audioPlayer = createAudioPlayer();
          const resource = createAudioResource(audioStream);

          audioPlayer.play(resource);
        }
      }
    });
  }

  async trackingBitcoin() {
    const oneHour = 3 * 60 * 60 * 1000;

    setInterval(async () => {
      const crypto = await CryptoService.search("bitcoin");
      if (!crypto) return;
      const responseCrypto = await CryptoService.findCryptoById(crypto.id);

      if (this.bitcoinPrice) {
        const initialValue = this.bitcoinPrice;
        const finalValue = responseCrypto.market_data.current_price.brl;
        const generalChannel = await this.findGeneralChannel();

        const priceVariationOneHour =
          ((finalValue - initialValue) / initialValue) * 100;

        if (
          generalChannel &&
          generalChannel.isTextBased() &&
          priceVariationOneHour
        ) {
          generalChannel.send(
            `Notificação: O preço do bitcoin variou em: ${priceVariationOneHour.toFixed(
              2
            )}%.\npreço atual em BRL: ${new Intl.NumberFormat("pt-br", {
              currency: "BRL",
              style: "currency",
              maximumFractionDigits: 2,
            }).format(
              responseCrypto.market_data.current_price.brl
            )}\npreço atual em USD: ${new Intl.NumberFormat("en-us", {
              currency: "USD",
              style: "currency",
              maximumFractionDigits: 2,
            }).format(responseCrypto.market_data.current_price.usd)}`
          );
        }
      }

      this.bitcoinPrice = responseCrypto.market_data.current_price.brl;
    }, oneHour);
  }

  async findGeneralChannel() {
    const generalChannel = await this.client.channels.fetch(
      this.generalChannelId,
      {
        allowUnknownGuild: true,
        cache: true,
        force: true,
      }
    );

    return generalChannel;
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
      if (findSearchEntry.test(message.content)) {
        if (rgxResponse && rgxResponse[1]) {
          const cryptoQuery = rgxResponse[1];
          const queryCryptoResponse = await CryptoService.search(cryptoQuery);

          if (!isCrypto(queryCryptoResponse)) {
            if (!message.guild) {
              await message.author.send(
                "Ops não encontrei!! Tente pesquiser a sigla ou o nome da moeda."
              );
            } else {
              await message.reply(
                "Ops não encontrei!! Tente pesquiser a sigla ou o nome da moeda."
              );
            }
          }

          if (isCrypto(queryCryptoResponse)) {
            const crypto = await CryptoService.findCryptoById(
              queryCryptoResponse.id
            );

            const percentageChange =
              crypto.market_data.price_change_percentage_24h;

            if (!message.guild) {
              await message.author.send(
                `Encontrei!!\n\nnome: ${
                  queryCryptoResponse.name
                }\npreço: ${new Intl.NumberFormat("pt-br", {
                  currency: "BRL",
                  style: "currency",
                }).format(crypto.market_data.current_price.brl)}\nvariação: ${
                  percentageChange > 0
                    ? `${percentageChange.toFixed(2)}% \u2191`
                    : percentageChange == 0
                    ? `${percentageChange.toFixed(2)}`
                    : `${percentageChange.toFixed(2)}% \u2193`
                }`
              );
            } else {
              await message.reply(
                `Encontrei!!\n\nnome: ${
                  queryCryptoResponse.name
                }\npreço: ${new Intl.NumberFormat("pt-br", {
                  currency: "BRL",
                  style: "currency",
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
      }
    });
  }
}
