import axios, { AxiosPromise } from 'axios';
import { Config } from 'utils';

const BASE_URL = Config.ROOT_HTTP;

type RequestMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

class Network {
  private static instance = new Network();
  private token: string = '';

  constructor() {
    if (Network.instance) {
      throw new Error(
        'Error: Instantiation failed: Use Network.getInstance() instead of new.',
      );
    }
    Network.instance = this;
  }

  public static getInstance(): Network {
    return Network.instance;
  }

  getBaseUrl(): string {
    return BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  unAuthorizedRequest<T>(
    url: string,
    method: RequestMethod = 'GET',
    data?: any,
    // params?: object,
    header?: object,
    baseURL?: string,
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: baseURL ? baseURL : BASE_URL,
      data: data ? data : undefined,
      // params: params ? params : null,
      timeout: 60000,
      headers: {
        ...header,
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  unAuthorizedRequest2<T>(
    url: string,
    method: RequestMethod = 'GET',
    data?: any,
    params?: object,
    header?: object,
    baseURL?: string,
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: baseURL ? baseURL : BASE_URL,
      data: data ? data : undefined,
      params: params ? params : undefined,
      timeout: 60000,
      headers: {
        ...header,
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  authorizedRequest<T>(
    url: string,
    method: RequestMethod = 'GET',
    data?: any,
    params?: object,
    header?: object,
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: BASE_URL,
      data: data ? data : undefined,
      params: params ? params : undefined,
      timeout: 60000,
      headers: {
        ...header,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      },
    });
    return response;
  }
}

axios.interceptors.request.use(
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
      console.log(
        '%c [HTTP Interceptor Request]',
        'color: blue; font-weight: bold',
        message,
      );
    }

    return config;
  },
  function (error) {
    if (__DEV__) {
      console.log(
        '%c [HTTP Interceptor Request Error]',
        'color: red; font-weight: bold',
        error,
      );
    }
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    if (__DEV__) {
      const { data: responseData, config } = response;
      const { url, method } = config;
      const message = {
        METHOD: method,
        DATA: responseData,
        URL: url,
      };
      console.log(
        '%c [HTTP Interceptor Response]',
        'color: #248c1d; font-weight: bold',
        message,
      );
    }

    return response.data;
  },
  function (error) {
    if (__DEV__) {
      console.log(
        '%c [HTTP Interceptor Response Error]',
        'color: red; font-weight: bold',
        error.response,
      );
    }
    return error.response;
  },
);

export default Network.getInstance();
