import { types } from './staking_action';
import { types as mainTypes } from '../main/main_action';

const initialState = {
  listValidators: [],
};

export default function (
  state = initialState,
  action = { type: '', payload: null },
) {
  switch (action.type) {
    case types.GET_VALIDATORS_INFORMATION_SUCCESS:
      return {
        ...state,
        listValidators: action.payload,
      };
    case mainTypes.CLEAR_ALL_DATA: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
