import {types as typesMain, types} from './main_action';

const initialState = {
    CMessageData: null,
    overview: null,
};

export default function (
    state = initialState,
    action = {type: '', payload: {}},
) {
    switch (action.type) {
        case types.SHOW_MESSAGE_SUCCESS:{
            return {
                ...state,
                CMessageData: action.payload,
            };
        }
        case typesMain.LOAD_LOCAL_STORAGE_SUCCESS: {
            return {
                ...state,
                overview: action.payload.overview
            }
        }
        default:
            return state;
    }
}
