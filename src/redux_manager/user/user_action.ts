export const types = {
  GET_ACCOUNT_INFORMATION: 'GET_ACCOUNT_INFORMATION',
  GET_ACCOUNT_INFORMATION_SUCCESS: 'GET_ACCOUNT_INFORMATION_SUCCESS',
  GET_ACCOUNTS: 'GET_ACCOUNTS',
  GET_ACCOUNTS_SUCCESS: 'GET_ACCOUNTS_SUCCESS',
  CHANGE_ACCOUNT: 'CHANGE_ACCOUNT',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_SELECTED_WALLET: 'LOAD_SELECTED_WALLET',
  GET_SELECTED_WALLET_SUCCESS: 'GET_SELECTED_WALLET_SUCCESS',
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
export default {
  getAccountInformation,
  getAccounts,
  changeAccount,
  loadSelectedWalletFromStorage,
};
