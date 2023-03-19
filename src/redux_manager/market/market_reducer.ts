import { types } from './market_action';

const initialState = {
  priceHistoryData: null,
};

export default function (state = initialState, action = { type: '', payload: null }) {
  switch (action.type) {
    case types.GET_PRICE_HISTORY_SUCCESS:
      return {
        ...state,
        priceHistoryData: action.payload,
      };
    default:
      return state;
  }
}
