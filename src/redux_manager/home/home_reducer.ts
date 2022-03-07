/* eslint-disable prettier/prettier */
import {types} from './home_action';

const initialState = {
    CSPRMarketInfo: null,
    tokenInfoWithBalance: null
};

export default function (
    state = initialState,
    action = {type: '', payload: ''},
) {
    switch (action.type) {
        case types.FETCH_CSPR_MARKET_INFO_SUCCESS:
            return {
                ...state,
                CSPRMarketInfo: action.payload
            };
        case types.GET_TOKEN_INFO_WITH_BALANCE_SUCCESS:
            return {
                ...state,
                tokenInfoWithBalance: action.payload
            }
        default:
            return state;
    }
}
