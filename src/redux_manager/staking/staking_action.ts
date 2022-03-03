/* eslint-disable prettier/prettier */
export const types = {
  GET_LIST_VALIDATOR: 'GET_LIST_VALIDATOR',
  GET_LIST_SUCCESS:'GET_LIST_SUCCESS',
  SET_VALIDATOR:'SET_VALIDATOR'
};

const fetchListValidator = (payload: string) => ({
  type: types.GET_LIST_VALIDATOR,
  payload,
});

const setValidator = (payload: string) => ({
  type: types.SET_VALIDATOR,
  payload,
});

export default {
  fetchListValidator,
  setValidator
};
