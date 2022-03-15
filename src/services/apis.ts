import network from 'services/network';
import qs from 'qs';
export type NetworkPromiseResponse<T> = Promise<T>;

/**
 * Get Account Information
 * @param {any} params - any
 * @returns The response is a promise that resolves to the response from the server.
 */
function getAccountInformation<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/user/' + params, 'GET')
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

/**
 *  Fetch accounts information by passing public keys.
 * `NetworkPromiseResponse<T>`
 * @param {any} params - any
 * @returns A promise.
 */
function getAccounts<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('users/', 'POST', params)
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

/**
 * Get Token Info With Balance
 * @param {any} params - {
 * @returns The response is a JSON object with the following structure:
 * ```
 * {
 *   "tokens": [
 *     {
 *       "token": "0x0000000000000000000000000000000000000000",
 *       "name": "Ether",
 *       "symbol": "ETH",
 *       "decimals": 18,
 *       "totalSupply": "1000000000000000000000000000",
 *      }
 */
function getTokenInfoWithBalanceAPI<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/tokens/getTokensInfo?' + qs.stringify(params), 'GET')
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

function fetchCSPRMarketInfoAPI<T>(): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest(
        'api/v3/coins/markets?vs_currency=usd&ids=casper-network',
        'GET',
        undefined,
        undefined,
        'https://api.coingecko.com/',
      )
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

function getTransferDeploysStatusAPI<T>(
  params: any,
): NetworkPromiseResponse<T> {
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

function getValidatorsInformationAPI<T>(): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/validators', 'GET')
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
  getAccountInformation,
  getAccounts,
  getTokenInfoWithBalanceAPI,
  fetchCSPRMarketInfoAPI,
  getTokenAddressInfoAPI,
  getConfigurationsAPI,
  deployAPI,
  getListNFTsAPI,
  getTransferDeploysStatusAPI,
  getValidatorsInformationAPI,
};
