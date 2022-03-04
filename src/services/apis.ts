import network from 'services/network';
import qs from 'qs';
import {getTransferDeploysStatus} from "redux_manager/home/home_saga";
export type NetworkPromiseResponse<T> = Promise<T>;

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
            .unAuthorizedRequest('api/v3/coins/markets?vs_currency=usd&ids=casper-network', 'GET', undefined, undefined, 'https://api.coingecko.com/')
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


function getListValidatorAPI<T>(): NetworkPromiseResponse<T> {
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
    getTokenInfoWithBalanceAPI,
    fetchCSPRMarketInfoAPI,
    getTokenAddressInfoAPI,
    getConfigurationsAPI,
    deployAPI,
    getListNFTsAPI,
    getListValidatorAPI,
    getTransferDeploysStatusAPI,
};
