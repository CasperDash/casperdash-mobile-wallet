import network from 'services/network';
import qs from 'qs';
export type NetworkPromiseResponse<T> = Promise<T>;

function getTransferDeploysStatusAPI<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/deploysStatus?' + qs.stringify(params), 'GET')
      .then((res: any) => {
        if (!res || (res && res.status >= 400)) {
          return reject(res);
        }
        resolve(res as any);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

function getValidatorsInformationAPI<T>(publicKey: string): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest(publicKey ? `/v2/validators?delegator=${publicKey}&cachedBy=block` : '/v2/validators', 'GET')
      .then((res: any) => {
        if (!res || (res && res.status >= 400)) {
          return reject(res);
        }
        resolve(res as any);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

export default {
  getTransferDeploysStatusAPI,
  getValidatorsInformationAPI,
};
