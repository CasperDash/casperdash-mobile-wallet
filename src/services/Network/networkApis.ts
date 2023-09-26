import { request } from 'services/request';
import { JsonTypes } from 'typedjson';

export interface ISpeculativeDeployResponse {
  api_version: string;
  block_hash: string;
  execution_result: ExecutionResult;
}

export interface ExecutionResult {
  Success: Success;
}

export interface Success {
  effect: Effect;
  transfers: any[];
  cost: string;
}

export interface Effect {
  transforms: Transform[];
}
export interface Transform {
  key: string;
  transform: any;
}

export const speculativeDeploy = async (signedDeployJson: {
  deploy: JsonTypes;
}): Promise<ISpeculativeDeployResponse> => {
  const response = await request.post<ISpeculativeDeployResponse>('/v1/network/speculativeDeploy', signedDeployJson);

  return response.data;
};
