export const types = {
    GET_TOKEN_INFO_WITH_BALANCE: 'GET_TOKEN_INFO_WITH_BALANCE',
    GET_TOKEN_INFO_WITH_BALANCE_SUCCESS: 'GET_TOKEN_INFO_WITH_BALANCE_SUCCESS',

    FETCH_CSPR_MARKET_INFO: 'FETCH_CSPR_MARKET_INFO',
    FETCH_CSPR_MARKET_INFO_SUCCESS: 'FETCH_CSPR_MARKET_INFO_SUCCESS',

    GET_TOKEN_ADDRESS_INFO: 'GET_TOKEN_ADDRESS_INFO',
    GET_TOKEN_ADDRESS_INFO_SUCCESS: 'GET_TOKEN_ADDRESS_INFO_SUCCESS',
};

const getTokenInfoWithBalance = (cb: any) => {
    return {
        type: types.GET_TOKEN_INFO_WITH_BALANCE,
        cb,
    };
};

const fetchCSPRMarketInfo = (cb: any) => {
    return {
        type: types.FETCH_CSPR_MARKET_INFO,
        cb,
    };
};

const getTokenAddressInfo = (params: any, cb: any) => {
    return {
        type: types.GET_TOKEN_ADDRESS_INFO,
        params,
        cb,
    };
};

export default {
    getTokenInfoWithBalance,
    fetchCSPRMarketInfo,
    getTokenAddressInfo
};
