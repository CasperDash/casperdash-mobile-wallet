export const types = {
  GET_ACCOUNT_INFORMATION: 'GET_ACCOUNT_INFORMATION',
  GET_ACCOUNT_INFORMATION_SUCCESS: 'GET_ACCOUNT_INFORMATION_SUCCESS',
  GET_ACCOUNTS: 'GET_ACCOUNTS',
  GET_ACCOUNTS_SUCCESS: 'GET_ACCOUNTS_SUCCESS',
  CHANGE_ACCOUNT: 'CHANGE_ACCOUNT',
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
export default {
  getAccountInformation,
  getAccounts,
  changeAccount,
};
