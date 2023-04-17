export const types = {
  PUSH_STAKE_TO_LOCAL_STORAGE: 'PUSH_STAKE_TO_LOCAL_STORAGE',
  PUSH_STAKE_TO_LOCAL_STORAGE_SUCCESS: 'PUSH_STAKE_TO_LOCAL_STORAGE_SUCCESS',
};

const pushStakeToLocalStorage = (publicKey: any, stake: any) => {
  return {
    type: types.PUSH_STAKE_TO_LOCAL_STORAGE,
    publicKey,
    stake,
  };
};

export default {
  pushStakeToLocalStorage,
};
