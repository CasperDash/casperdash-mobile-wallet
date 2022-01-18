import network from 'services/network';
import qs from 'qs';
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

export default {
    getAccountInformation,
};
