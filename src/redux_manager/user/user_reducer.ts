import { types } from './user_action';
import { types as typesMain } from '../main/main_action';

const initialState = {
  info: null,
  casperdash: null,
  selectedWallet: null,
  currentAccount: null,
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
    case types.GET_ACCOUNTS_SUCCESS:
      return {
        ...state,
        accounts: action.payload,
      };
    case typesMain.LOAD_LOCAL_STORAGE_SUCCESS: {
      return {
        ...state,
        casperdash: action.payload.casperdash,
      };
    }
    case types.LOAD_USER_SUCCESS: {
      return {
        ...state,
        currentAccount: action.payload,
      };
    }
    case types.GET_SELECTED_WALLET_SUCCESS: {
      return {
        ...state,
        selectedWallet: action.payload,
      };
    }
    case typesMain.CLEAR_ALL_DATA: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
