import {put, takeLatest, delay} from 'redux-saga/effects';
import {types} from './main_action';
import {Config, Keys} from "utils";

export function* showMessage(data: any) {
    yield put({type: types.SHOW_MESSAGE_SUCCESS, payload: data.message});
    yield delay(data.duration ?? 2000);
    yield put({type: types.SHOW_MESSAGE_SUCCESS, payload: null});
}

export function* watchShowMessage() {
    yield takeLatest(types.SHOW_MESSAGE, showMessage);
}

export function* loadLocalStorage() {
    // @ts-ignore
    const casperdash = yield Config.getItem(Keys.casperdash);
    const data = {
        casperdash: casperdash,
    }
    yield put({type: types.LOAD_LOCAL_STORAGE_SUCCESS, payload: data});
}

export function* watchLoadLocalStorage() {
    yield takeLatest(types.LOAD_LOCAL_STORAGE, loadLocalStorage);
}

