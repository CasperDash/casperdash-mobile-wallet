import { NETWORK_URL } from 'utils/constants/key';

interface ILatestPrice {
  price: number;
  volume_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  circulating_supply?: number;
  total_supply: number;
}

export const getLatestPrice = async (): Promise<ILatestPrice> => {
  const response = await fetch(`${NETWORK_URL}/price/latest`);
  if (!response.ok) {
    throw new Error('Cant get latest price');
  }

  return (await response.json()) || {};
};

export const getPriceHistory = async (): Promise<number[][]> => {
  const response = await fetch(`${NETWORK_URL}/price/history`);
  if (!response.ok) {
    throw new Error('Cant get price history');
  }

  return (await response.json()) || [];
};
