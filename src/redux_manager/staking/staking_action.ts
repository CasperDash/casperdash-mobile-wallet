export const types = {
    GET_VALIDATORS_INFORMATION: 'GET_VALIDATORS_INFORMATION',
    GET_VALIDATORS_INFORMATION_SUCCESS: 'GET_VALIDATORS_INFORMATION_SUCCESS',
};

const getValidatorsInformation = (params: any, cb: any) => ({
    type: types.GET_VALIDATORS_INFORMATION,
    params,
    cb,
});

export default {
    getValidatorsInformation,
};
