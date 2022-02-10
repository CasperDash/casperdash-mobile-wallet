export const types = {
    GET_TOKEN_INFO_WITH_BALANCE: 'GET_TOKEN_INFO_WITH_BALANCE',
    GET_TOKEN_INFO_WITH_BALANCE_SUCCESS: 'GET_TOKEN_INFO_WITH_BALANCE_SUCCESS',
};

const getTokenInfoWithBalance = (cb: any) => {
    return {
        type: types.GET_TOKEN_INFO_WITH_BALANCE,
        cb,
    };
};

export default {
    getTokenInfoWithBalance
};
