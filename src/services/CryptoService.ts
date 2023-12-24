import { config } from "dotenv";
import { TrendingCryptos } from "../@types/TrendingCryptos";
import { QueryCryptoResponse } from "../@types/QueryCryptos";
import { Crypto } from "../@types/Crypto";

config();

export class CryptoService {
  public static async trends() {
    const response = await fetch(
      `${process.env.API_URL}/search/trending` ?? ""
    );
    const trendingCryptos: TrendingCryptos = await response.json();
    return trendingCryptos;
  }

  public static async search(query: string) {
    const lowerCaseQuery = query.toLowerCase();

    const response = await fetch(
      `${process.env.API_URL}/search/?query=` + query
    );
    const cryptos: QueryCryptoResponse = await response.json();
    const filteredCryptos = cryptos.coins.filter(
      (crypto) =>
        crypto.name.toLowerCase() === lowerCaseQuery ||
        crypto.symbol.toLowerCase() === lowerCaseQuery
    );

    if (!filteredCryptos.length) return null;

    const [crypto] = filteredCryptos;

    return crypto;
  }

  public static async findCryptoById(id: string) {
    const response = await fetch(
      `${process.env.API_URL}/coins/${id}?market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    const crypto: Crypto = await response.json();

    return crypto;
  }
}
