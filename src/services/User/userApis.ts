import { request } from 'services/request';

import { ITokenInfoResponse, IAccountResponse, IAccountDelegationResponse } from './userTypes';

export const getTokenInfoWithBalance = async (publicKey: string): Promise<ITokenInfoResponse[]> => {
  const response = await request.get<ITokenInfoResponse[]>('/tokens/getTokensInfo', { params: { publicKey } });

  return response.data;
};

export const getAccountInfo = async (publicKey: string): Promise<IAccountResponse> => {
  const response = await request.get<IAccountResponse>(`/user/${publicKey}`);

  return response.data;
};

export const getListAccountInfo = async (publicKeys: string[]): Promise<IAccountResponse[]> => {
  const response = await request.get<IAccountResponse[]>('/v2/users', { params: { publicKeys } });

  return response.data;
};

export const getAccountDelegation = async (publicKey: string): Promise<IAccountDelegationResponse[]> => {
  const response = await request.get<IAccountDelegationResponse[]>(`/user/delegation/${publicKey}`);

  return response.data;
};
