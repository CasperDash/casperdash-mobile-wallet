import {types as typesMain, types} from './main_action';
import {Config} from "utils";

const initialState = {
    CMessageData: null,
    overview: null,
    configurations: null,
};

export default function (
    state = initialState,
    action = {type: '', payload: {}},
) {
    switch (action.type) {
        case types.SHOW_MESSAGE_SUCCESS:
            return {
                ...state,
                CMessageData: action.payload,
            };
        case typesMain.LOAD_LOCAL_STORAGE_SUCCESS:
            return {
                ...state,
                ...action.payload,
            }
        case types.GET_CONFIGURATIONS_SUCCESS:
            return {
                ...state,
                configurations: action.payload
            }
        default:
            return state;
    }
}
