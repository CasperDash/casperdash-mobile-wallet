/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-spaces-and-tabs */
import {put, takeLatest, take, cancel, delay} from 'redux-saga/effects';
import {types} from './staking_action';
import {apis} from "services";
import { Keys } from 'utils';
import config from 'utils/config';

export function* getListValidatorAPI() {
    try {
      

        const response = yield call(apis.getListValidatorAPI);
       
        if (response) {
            config.saveItem(Keys.nfts,response);
        } else {
        }
    } catch (error) {
        console.log(error);
    }
}


export function* watchgetValidatorSaga() {
    yield takeLatest(types.GET_LIST_VALIDATOR, getListValidatorAPI);
}
