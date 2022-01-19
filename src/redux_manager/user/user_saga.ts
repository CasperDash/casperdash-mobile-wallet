import {put, takeLatest, take, cancel} from 'redux-saga/effects';
import {types} from './user_action';
import {apis} from 'services';

export function* getAccountInformation(data: any) {
    try {
        yield put({type: types.GET_ACCOUNT_INFORMATION + '_SUCCESS', payload: null});
        // @ts-ignore
        const response = yield apis.getAccountInformation(data.params);
        if (response) {
            yield put({type: types.GET_ACCOUNT_INFORMATION + '_SUCCESS', payload: response});
            data.cb && data.cb(null, response);
        } else {
            data.cb && data.cb(true, null);
        }
    } catch (error: any) {
        if (error && error.data) {
            data.cb && data.cb(error.data, null);
        } else {
            data.cb && data.cb(error, null);
        }
    }
}

export function* watchGetAccountInformation() {
    while (true) {
        // @ts-ignore
        const watcher = yield takeLatest(types.GET_ACCOUNT_INFORMATION, getAccountInformation);
        yield take(['LOGOUT', 'NETWORK']);
        yield cancel(watcher);
    }
}
