import { request } from 'services/request';

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
  const response = await request.get<IValidatorDetailsResponse>('/validatorsDetail');

  return response.data;
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
  const response = await request.get<IValidatorResponse[]>('/v3/validators');

  return response.data;
};
