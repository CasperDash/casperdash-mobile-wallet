import network from 'services/network';
import qs from 'qs';
export type NetworkPromiseResponse<T> = Promise<T>;

/**
 *  Fetch accounts information by passing public keys.
 * `NetworkPromiseResponse<T>`
 * @param {any} params - any
 * @returns A promise.
 */
function getAccounts<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/users', 'POST', params)
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

function getTokenAddressInfoAPI<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/token/' + params, 'GET')
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

function getConfigurationsAPI<T>(): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/configurations', 'GET')
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

function deployAPI<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/deploy', 'POST', params)
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

function getListNFTsAPI<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/nfts/getNFTsInfo?publicKey=' + params, 'GET')
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
  getAccounts,
  getTokenAddressInfoAPI,
  getConfigurationsAPI,
  deployAPI,
  getListNFTsAPI,
  getTransferDeploysStatusAPI,
  getValidatorsInformationAPI,
};
