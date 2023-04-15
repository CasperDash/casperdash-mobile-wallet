export const types = {
  DEPLOY: 'DEPLOY',
  DEPLOY_SUCCESS: 'DEPLOY_SUCCESS',
  PUSH_TRANSFER_TO_LOCAL_STORAGE: 'PUSH_TRANSFER_TO_LOCAL_STORAGE',
  PUSH_TRANSFER_TO_LOCAL_STORAGE_SUCCESS: 'PUSH_TRANSFER_TO_LOCAL_STORAGE_SUCCESS',
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
  deploy,
  pushTransferToLocalStorage,
};
