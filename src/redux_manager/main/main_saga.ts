import {put, takeLatest, delay} from 'redux-saga/effects';
import {types} from './main_action';

export function* showMessage(data: any) {
    yield put({type: types.SHOW_MESSAGE_SUCCESS, payload: data.message});
    yield delay(data.duration ?? 2000);
    yield put({type: types.SHOW_MESSAGE_SUCCESS, payload: null});
}

export function* watchShowMessage() {
    yield takeLatest(types.SHOW_MESSAGE, showMessage);
}

