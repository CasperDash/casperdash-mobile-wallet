import { types } from './user_action';
import { types as typesMain } from '../main/main_action';

const initialState = {
  info: null,
  casperdash: null,
};

export default function (
  state = initialState,
  action = { type: '', payload: {} },
) {
  switch (action.type) {
    case types.GET_ACCOUNT_INFORMATION_SUCCESS:
      return {
        ...state,
        info: action.payload,
      };
    case typesMain.LOAD_LOCAL_STORAGE_SUCCESS: {
      return {
        ...state,
        casperdash: action.payload.casperdash,
      };
    }
    default:
      return state;
  }
}
