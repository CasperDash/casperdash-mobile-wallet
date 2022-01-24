import {types} from './main_action';

const initialState = {
    CMessageData: null,
};

export default function (
    state = initialState,
    action = {type: '', payload: ''},
) {
    switch (action.type) {
        case types.SHOW_MESSAGE_SUCCESS:{
            return {
                ...state,
                CMessageData: action.payload,
            };
        }
        default:
            return state;
    }
}
