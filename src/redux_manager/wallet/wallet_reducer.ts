/* eslint-disable prettier/prettier */
import {types} from './wallet_action';

const initialState = {
};

export default function (
    state = initialState,
    action = {type: '', payload: null},
) {
    switch (action.type) {
        default:
            return state;
    }
}
