type ENVS = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  PUBLIC_KEY: string;
  TOKEN: string;
  API_URL: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ENVS {}
  }
}

export {};
