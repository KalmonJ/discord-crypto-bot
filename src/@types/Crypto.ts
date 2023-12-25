export type Crypto = {
  id: string;
  symbol: string;
  name: string;
  web_slug: string;
  categories: string[];
  description: {
    en: string;
  };
  links: {
    homepage: string[];
  };
  blockchain_site: string[];
  repos_url: {
    github: string[];
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
      brl: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    total_supply: number;
    max_supply: number;
    circulating_supply: number;
  };
};
