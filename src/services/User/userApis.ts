import { NETWORK_URL } from 'utils/constants/key';
import { ITokenInfoResponse, IAccountResponse, IAccountDelegationResponse } from './userTypes';

export const getTokenInfoWithBalance = async (publicKey: string): Promise<ITokenInfoResponse[]> => {
  const response = await fetch(`${NETWORK_URL}/tokens/getTokensInfo?publicKey=${publicKey}`);

  if (!response.ok) {
    throw new Error('Cant get token info');
  }

  return (await response.json()) || {};
};

export const getAccountInfo = async (publicKey: string): Promise<IAccountResponse> => {
  const response = await fetch(`${NETWORK_URL}/user/${publicKey}`);

  if (!response.ok) {
    throw new Error('Cant get account info');
  }

  return (await response.json()) || {};
};

export const getListAccountInfo = async (publicKeys: string[]): Promise<IAccountResponse[]> => {
  const response = await fetch(`${NETWORK_URL}/v2/users?${publicKeys.map((key) => `publicKeys=${key}`).join('&')}`);

  if (!response.ok) {
    throw new Error('Cant get list account info');
  }

  return (await response.json()) || {};
};

export const getAccountDelegation = async (publicKey: string): Promise<IAccountDelegationResponse[]> => {
  const response = await fetch(`${NETWORK_URL}/delegations/${publicKey}`);

  if (!response.ok) {
    throw new Error('Cant get account delegation');
  }

  return (await response.json()) || {};
};
