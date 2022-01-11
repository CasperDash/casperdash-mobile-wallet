import {put, takeLatest, take, cancel, delay} from 'redux-saga/effects';
import {types} from './user_action';
import {apis} from 'services';

export function* login(data: any) {
    try {
        // @ts-ignore
        const response = yield apis.login(data.params);
        if (response) {
            yield put({type: types.LOGIN + '_SUCCESS', payload: response.user});
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

export function* watchLogin() {
    while (true) {
        // @ts-ignore
        const watcher = yield takeLatest(types.LOGIN, login);
        yield take(['LOGOUT', 'NETWORK']);
        yield cancel(watcher);
    }
}

export function* register(data: any) {
    try {
        // @ts-ignore
        const response = yield apis.register(data.params);
        if (response) {
            yield put({type: types.REGISTER + '_SUCCESS', payload: response});
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

export function* watchRegister() {
    while (true) {
        // @ts-ignore
        const watcher = yield takeLatest(types.REGISTER, register);
        yield take(['LOGOUT', 'NETWORK']);
        yield cancel(watcher);
    }
}

export function* getInformation(data: any) {
    try {
        yield delay(300);
        // @ts-ignore
        const response = yield apis.getInformation();
        if (response) {
            yield put({type: types.GET_INFORMATION + '_SUCCESS', payload: response});
            data.cb && data.cb(null, response);
        } else {
            data.cb && data.cb(true, null);
        }
    } catch (error: any) {
        if (error && error.data) {
            if (error.data.statusCode && error.data.statusCode === 403) {
                yield put({type: 'TOKEN_EXPIRE'});
                return;
            }
            data.cb && data.cb(error.data, null);
        } else {
            data.cb && data.cb(error, null);
        }
    }
}

export function* watchGetInformation() {
    while (true) {
        // @ts-ignore
        const watcher = yield takeLatest(types.GET_INFORMATION, getInformation);
        yield take(['LOGOUT', 'NETWORK']);
        yield cancel(watcher);
    }
}
