import { request } from 'services/request';
import { ITokenInfoResponse } from 'services/User/userTypes';

export const getTokenInfo = async (tokenAddress: string): Promise<Omit<ITokenInfoResponse, 'balance'>> => {
  const response = await request.get<ITokenInfoResponse>(`/tokens/${tokenAddress}`);

  return response.data;
};
