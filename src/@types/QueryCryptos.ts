export type QueryCrypto = {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
};

export type QueryCryptoResponse = {
  coins: QueryCrypto[];
};
