import { NETWORK_URL } from 'utils/constants/key';

export interface ITokenInfo {
  address: string;
  balance: { hex?: string; type?: string; displayValue?: number };
  name: string;
  symbol: string;
  total_supply: { hex: string; type: string };
  decimals: { hex: string; type: string };
}

export const getTokenInfoWithBalance = async (publicKey: string): Promise<ITokenInfo[]> => {
  const response = await fetch(`${NETWORK_URL}/tokens/getTokensInfo?publicKey=${publicKey}`);

  if (!response.ok) {
    throw new Error('Cant get token info');
  }

  return (await response.json()) || {};
};
