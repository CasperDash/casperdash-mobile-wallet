/* eslint-disable prettier/prettier */
import {types} from './home_action';

const initialState = {};

export default function (
    state = initialState,
    action = {type: '', payload: ''},
) {
    switch (action.type) {
        default:
            return state;
    }
}
