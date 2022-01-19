import {types} from './user_action';

const initialState = {
    info: null,
};

export default function (
    state = initialState,
    action = {type: '', payload: ''},
) {
    switch (action.type) {
        case types.GET_ACCOUNT_INFORMATION_SUCCESS:
            return {
                ...state,
                info: action.payload,
            };
        default:
            return state;
    }
}
