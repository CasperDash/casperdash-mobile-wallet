export const types = {
  GET_PRICE_HISTORY: 'GET_PRICE_HISTORY',
  GET_PRICE_HISTORY_SUCCESS: 'GET_PRICE_HISTORY_SUCCESS',
};

const getPriceHistory = (cb: any) => {
  return {
    type: types.GET_PRICE_HISTORY,
    cb,
  };
};

export default {
  getPriceHistory,
};
