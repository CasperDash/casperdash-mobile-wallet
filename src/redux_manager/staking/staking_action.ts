export const types = {
  GET_VALIDATORS_INFORMATION: 'GET_VALIDATORS_INFORMATION',
  GET_VALIDATORS_INFORMATION_SUCCESS: 'GET_VALIDATORS_INFORMATION_SUCCESS',

  PUSH_STAKE_TO_LOCAL_STORAGE: 'PUSH_STAKE_TO_LOCAL_STORAGE',
  PUSH_STAKE_TO_LOCAL_STORAGE_SUCCESS: 'PUSH_STAKE_TO_LOCAL_STORAGE_SUCCESS',
};

const getValidatorsInformation = (params: any, cb: any) => ({
  type: types.GET_VALIDATORS_INFORMATION,
  params,
  cb,
});

const pushStakeToLocalStorage = (publicKey: any, stake: any) => {
  return {
    type: types.PUSH_STAKE_TO_LOCAL_STORAGE,
    publicKey,
    stake,
  };
};

export default {
  getValidatorsInformation,
  pushStakeToLocalStorage,
};
