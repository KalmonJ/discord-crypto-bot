import { QueryCrypto } from "./QueryCryptos";

export function isCrypto(param: QueryCrypto | null): param is QueryCrypto {
  return param !== null;
}
