import { User } from 'react-native-casper-storage';

export const types = {
  GET_ACCOUNT_INFORMATION: 'GET_ACCOUNT_INFORMATION',
  GET_ACCOUNT_INFORMATION_SUCCESS: 'GET_ACCOUNT_INFORMATION_SUCCESS',
  GET_ACCOUNTS: 'GET_ACCOUNTS',
  GET_ACCOUNTS_SUCCESS: 'GET_ACCOUNTS_SUCCESS',
  CHANGE_ACCOUNT: 'CHANGE_ACCOUNT',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_SELECTED_WALLET: 'LOAD_SELECTED_WALLET',
  GET_SELECTED_WALLET_SUCCESS: 'GET_SELECTED_WALLET_SUCCESS',
  CLEAR_USER_STATE: 'CLEAR_USER_STATE',
};

const getAccountInformation = (params: any, cb: any) => {
  return {
    type: types.GET_ACCOUNT_INFORMATION,
    params,
    cb,
  };
};

const getAccounts = (params: any, cb: any) => {
  return {
    type: types.GET_ACCOUNTS,
    params,
    cb,
  };
};

const changeAccount = () => {
  return {
    type: types.CHANGE_ACCOUNT,
  };
};

const loadSelectedWalletFromStorage = () => {
  return {
    type: types.LOAD_SELECTED_WALLET,
  };
};

const getSelectedWalletSuccess = (selectedWallet: any) => {
  return {
    type: types.GET_SELECTED_WALLET_SUCCESS,
    payload: selectedWallet,
  };
};

const getUserSuccess = (user: User) => {
  return {
    type: types.LOAD_USER_SUCCESS,
    payload: user,
  };
};
export default {
  getAccountInformation,
  getAccounts,
  changeAccount,
  loadSelectedWalletFromStorage,
  getSelectedWalletSuccess,
  getUserSuccess,
};
