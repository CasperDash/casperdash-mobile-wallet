import axios from 'axios';
import { NETWORK_URL } from 'utils/constants/key';

export const request = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: NETWORK_URL,
});

request.interceptors.request.use(
  function (config: any) {
    if (__DEV__) {
      const { url, method, data, params, baseURL } = config;
      const message = {
        METHOD: method,
        HEADER: config.headers,
        DATA: data,
        PARAMS: params,
        URL: baseURL + url,
      };
      console.log('%c [HTTP Interceptor Request]', 'color: blue; font-weight: bold', message);
    }

    return config;
  },
  function (error) {
    if (__DEV__) {
      console.log('%c [HTTP Interceptor Request Error]', 'color: red; font-weight: bold', error);
    }
    return Promise.reject(error);
  },
);
