/* eslint-disable prettier/prettier */
import { types } from './staking_action';

const initialState = {
};

export default function (
    state = initialState,
    action = { type: '', payload: null },
) {
    switch (action.type) {
        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                listValidator: action.payload,
            };
        case types.SET_VALIDATOR:
            return {
                ...state,
                validator: action.payload,
            };
        default:
            return state;
    }
}
