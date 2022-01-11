/* eslint-disable prettier/prettier */
export const types = {
    TEST: 'TEST',
    TEST_SUCCESS: 'TEST_SUCCESS',
};

const test = (params: any, cb: any) => {
    return {
        type: types.TEST,
        params,
        cb,
    };
};

export default {
    test
};
