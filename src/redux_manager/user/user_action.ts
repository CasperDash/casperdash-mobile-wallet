export const types = {
  GET_ACCOUNT_INFORMATION: 'GET_ACCOUNT_INFORMATION',
  GET_ACCOUNT_INFORMATION_SUCCESS: 'GET_ACCOUNT_INFORMATION_SUCCESS',
  GET_ACCOUNTS: 'GET_ACCOUNTS',
  GET_ACCOUNTS_SUCCESS: 'GET_ACCOUNTS_SUCCESS',
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

export default {
  getAccountInformation,
  getAccounts,
};
