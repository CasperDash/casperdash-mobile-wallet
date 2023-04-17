import { NETWORK_URL } from 'utils/constants/key';

interface IValidatorDetail {
  name: string;
  description: string;
  logo?: string;
  priority?: boolean;
}

export interface IValidatorDetailsResponse {
  [key: string]: IValidatorDetail;
}

export const getValidatorsDetail = async (): Promise<IValidatorDetailsResponse> => {
  const response = await fetch(`${NETWORK_URL}/validatorsDetail`);
  if (!response.ok) {
    console.error('Cant get validator details');
    return {};
  }

  return (await response.json()) || {};
};

export interface IValidatorResponse {
  era: number;
  blockHeight: number;
  validatorPublicKey: string;
  weight: string;
  isActive: boolean;
  isFullDelegator: boolean;
  delegationRate: number;
}

export const getValidators = async (): Promise<IValidatorResponse[]> => {
  const response = await fetch(`${NETWORK_URL}/v3/validators`);
  if (!response.ok) {
    console.error('Cant get validators');
    return [];
  }

  return (await response.json()) || [];
};
