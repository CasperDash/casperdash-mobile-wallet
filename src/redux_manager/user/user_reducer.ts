/* eslint-disable prettier/prettier */
import {types} from './user_action';

const initialState = {
    profile: null,
    token: false,
};

export default function (
    state = initialState,
    action = {type: '', payload: ''},
) {
    switch (action.type) {
        case types.GET_INFORMATION_SUCCESS:
            return {
                ...state,
                profile: action.payload,
            };
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                profile: action.payload,
            };
        default:
            return state;
    }
}
