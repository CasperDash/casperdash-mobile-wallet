export const types = {
  GET_TOKEN_ADDRESS_INFO: 'GET_TOKEN_ADDRESS_INFO',
  GET_TOKEN_ADDRESS_INFO_SUCCESS: 'GET_TOKEN_ADDRESS_INFO_SUCCESS',

  DEPLOY: 'DEPLOY',
  DEPLOY_SUCCESS: 'DEPLOY_SUCCESS',

  PUSH_TRANSFER_TO_LOCAL_STORAGE: 'PUSH_TRANSFER_TO_LOCAL_STORAGE',
  PUSH_TRANSFER_TO_LOCAL_STORAGE_SUCCESS: 'PUSH_TRANSFER_TO_LOCAL_STORAGE_SUCCESS',
};

const getTokenAddressInfo = (params: any, cb: any) => {
  return {
    type: types.GET_TOKEN_ADDRESS_INFO,
    params,
    cb,
  };
};

const deploy = (params: any, cb: any) => {
  return {
    type: types.DEPLOY,
    params,
    cb,
  };
};

const pushTransferToLocalStorage = (publicKey: any, transfer: any) => {
  return {
    type: types.PUSH_TRANSFER_TO_LOCAL_STORAGE,
    publicKey,
    transfer,
  };
};

export default {
  getTokenAddressInfo,
  deploy,
  pushTransferToLocalStorage,
};
