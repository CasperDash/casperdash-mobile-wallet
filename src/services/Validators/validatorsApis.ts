import { NETWORK_URL } from 'utils/constants/key';

interface IValidatorDetail {
  name: string;
  description: string;
  logo?: string;
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
