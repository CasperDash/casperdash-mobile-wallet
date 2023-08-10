import { StakingForm } from 'redux_manager/staking/staking_reducer';

export const types = {
  PUSH_STAKE_TO_LOCAL_STORAGE: 'PUSH_STAKE_TO_LOCAL_STORAGE',
  PUSH_STAKE_TO_LOCAL_STORAGE_SUCCESS: 'PUSH_STAKE_TO_LOCAL_STORAGE_SUCCESS',
  SET_STAKING_FORM: 'SET_STAKING_FORM',
};

const pushStakeToLocalStorage = (publicKey: any, stake: any) => {
  return {
    type: types.PUSH_STAKE_TO_LOCAL_STORAGE,
    publicKey,
    stake,
  };
};

const setStakingForm = (form: Partial<StakingForm>) => {
  return {
    type: types.SET_STAKING_FORM,
    payload: form,
  };
};

export default {
  pushStakeToLocalStorage,
  setStakingForm,
};
