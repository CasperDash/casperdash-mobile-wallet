/* eslint-disable prettier/prettier */
export const types = {
    TOKEN_EXPIRE: 'TOKEN_EXPIRE',

};

const tokenExpire = () => {
    return {
        type: types.TOKEN_EXPIRE,
    };
};

export default {
    tokenExpire,
};
