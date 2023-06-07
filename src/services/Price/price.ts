import { request } from 'services/request';

interface ILatestPrice {
  price: number;
  volume_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  circulating_supply?: number;
  total_supply: number;
}

export const getLatestPrice = async (): Promise<ILatestPrice> => {
  const response = await request.get<ILatestPrice>('/price/latest');

  return response.data;
};

export const getPriceHistory = async (): Promise<number[][]> => {
  const response = await request.get<number[][]>('/price/history');

  return response.data;
};
