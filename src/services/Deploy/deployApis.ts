import { NETWORK_URL } from 'utils/constants/key';

export interface IPutDeployResponse {
  deployHash: string;
}

export interface IPutDeployRequest {
  deploy: import('typedjson').JsonTypes;
}

export const putDeploy = async (deploy: IPutDeployRequest): Promise<IPutDeployResponse> => {
  const response = await fetch(`${NETWORK_URL}/deploy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(deploy),
  });

  if (!response.ok) {
    throw new Error('Cant put deploy');
  }

  return (await response.json()) || {};
};
