export const types = {
  PUSH_TRANSFER_TO_LOCAL_STORAGE: 'PUSH_TRANSFER_TO_LOCAL_STORAGE',
  PUSH_TRANSFER_TO_LOCAL_STORAGE_SUCCESS: 'PUSH_TRANSFER_TO_LOCAL_STORAGE_SUCCESS',
};

const pushTransferToLocalStorage = (publicKey: any, transfer: any) => {
  return {
    type: types.PUSH_TRANSFER_TO_LOCAL_STORAGE,
    publicKey,
    transfer,
  };
};

export default {
  pushTransferToLocalStorage,
};
