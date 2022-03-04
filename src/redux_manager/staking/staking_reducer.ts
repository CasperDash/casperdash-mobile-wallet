import { types } from './staking_action';

const initialState = {
    listValidators: [],
};

export default function (
    state = initialState,
    action = { type: '', payload: null },
) {
    switch (action.type) {
        case types.GET_VALIDATORS_INFORMATION_SUCCESS:
            return {
                ...state,
                listValidators: action.payload,
            };
        default:
            return state;
    }
}
