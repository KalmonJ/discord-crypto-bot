export type TrendingCryptos = {
  coins: CryptoCurrency[];
};

export type CryptoCurrency = {
  item: {
    id: string;
    coin_id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    data: {
      price: string;
      market_cap: string;
      total_volume: string;
      price_change_percentage_24h: {
        brl: number;
        usd: number;
      };
      content: {
        title: string;
        description: string;
      };
    };
  };
};
