/* eslint-disable prettier/prettier */
import network from 'services/network';
export type NetworkPromiseResponse<T> = Promise<T>;
import qs from 'qs';

function login<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('auth/local', 'POST', params)
      .then((res: any) => {
        if (!res || (res &&res.status >= 400)) {
            return reject(res);
        }

        if (res && res.jwt) {
          network.setToken(res.jwt);
        }

        resolve(res as any);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

function register<T>(params: any): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('auth/local/register', 'POST', params)
      .then((res: any) => {
        if (!res || (res &&res.status >= 400)) {
          return reject(res);
        }
        resolve(res as any);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

function getInformation<T>(): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('users/me', 'GET')
      .then((res: any) => {
        if (!res || (res &&res.status >= 400)) {
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
  login,
  register,
  getInformation,
};
