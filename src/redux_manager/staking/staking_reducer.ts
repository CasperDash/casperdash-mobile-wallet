import { types as mainTypes } from '../main/main_action';
import { types } from 'redux_manager/staking/staking_action';
import { ENTRY_POINT_DELEGATE, ENTRY_POINT_REDELEGATE, ENTRY_POINT_UNDELEGATE } from 'utils/constants/key';

export type Validator = {
  publicKey: string;
  name: string;
  logo: string;
  fee: number;
};

export type StakingForm = {
  entryPoint?: typeof ENTRY_POINT_REDELEGATE | typeof ENTRY_POINT_DELEGATE | typeof ENTRY_POINT_UNDELEGATE;
  name: string;
  stakedAmount?: number;
  amount?: number;
  validator: Validator;
  newValidator?: Validator;
};

type InitialState = {
  listValidators: any[];
  form: StakingForm;
};

const initialState: InitialState = {
  listValidators: [],
  form: {
    name: '',
    stakedAmount: 0,
    amount: 0,
    validator: {
      publicKey: '',
      name: '',
      logo: '',
    },
    newValidator: {
      publicKey: '',
      name: '',
      logo: '',
    },
  },
};

export default function (state = initialState, { payload, type } = { type: '', payload: {} }) {
  switch (type) {
    case mainTypes.CLEAR_ALL_DATA: {
      return {
        ...initialState,
      };
    }
    case types.SET_STAKING_FORM: {
      return {
        ...state,
        form: {
          ...state.form,
          ...payload,
        },
      };
    }
    default:
      return state;
  }
}
