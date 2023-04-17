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

export interface IDeployStatusResponse {
  hash: string;
  status: string;
}

export const getDeployStatus = async (deployHashes: string[]): Promise<IDeployStatusResponse[]> => {
  const response = await fetch(
    `${NETWORK_URL}/deploysStatus?${deployHashes.map((deployHash) => `deployHash=${deployHash}`).join('&')}`,
  );

  if (!response.ok) {
    throw new Error('Cant get deploy status');
  }

  return (await response.json()) || {};
};
