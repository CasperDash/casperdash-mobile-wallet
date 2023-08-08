import { request } from 'services/request';

export interface IPutDeployResponse {
  deployHash: string;
}

export interface IPutDeployRequest {
  deploy: import('typedjson').JsonTypes;
}

export const putDeploy = async (deploy: IPutDeployRequest): Promise<IPutDeployResponse> => {
  const response = await request.post<IPutDeployResponse>('/deploy', deploy);

  return response.data;
};

export interface IDeployStatusResponse {
  hash: string;
  status: string;
}

export const getDeployStatus = async (deployHashes: string[]): Promise<IDeployStatusResponse[]> => {
  const response = request.get<IDeployStatusResponse[]>('/deploysStatus', { params: { deployHash: deployHashes } });

  return (await response).data;
};
