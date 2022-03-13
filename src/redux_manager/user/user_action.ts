export const types = {
  GET_ACCOUNT_INFORMATION: 'GET_ACCOUNT_INFORMATION',
  GET_ACCOUNT_INFORMATION_SUCCESS: 'GET_ACCOUNT_INFORMATION_SUCCESS',
};

const getAccountInformation = (params: any, cb: any) => {
  return {
    type: types.GET_ACCOUNT_INFORMATION,
    params,
    cb,
  };
};

export default {
  getAccountInformation,
};
