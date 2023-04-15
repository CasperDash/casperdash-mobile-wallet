import { ITokenInfoResponse } from 'services/User/userTypes';
import { NETWORK_URL } from 'utils/constants/key';

export const getTokenInfo = async (tokenAddress: string): Promise<Omit<ITokenInfoResponse, 'balance'>> => {
  const response = await fetch(`${NETWORK_URL}/token/${tokenAddress}`);

  if (!response.ok) {
    throw new Error('Cant get token info');
  }

  return (await response.json()) || {};
};
