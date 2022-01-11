/* eslint-disable prettier/prettier */
export const types = {
    LOGIN: 'LOGIN',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',

    GET_INFORMATION: 'GET_INFORMATION',
    GET_INFORMATION_SUCCESS: 'GET_INFORMATION_SUCCESS',

    REGISTER: 'REGISTER',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',


};

const login = (params: any, cb: any) => {
    return {
        type: types.LOGIN,
        params,
        cb,
    };
};

const register = (params: any, cb: any) => {
    return {
        type: types.REGISTER,
        params,
        cb,
    };
};


const getInformation = (params: any, cb: any) => {
    return {
        type: types.GET_INFORMATION,
        params,
        cb,
    };
};


export default {
    login,
    register,
    getInformation,
};
