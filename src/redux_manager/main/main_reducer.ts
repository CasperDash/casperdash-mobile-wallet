/* eslint-disable prettier/prettier */
import {types} from './main_action';
import {Animated} from "react-native";
import {device} from "device";

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
