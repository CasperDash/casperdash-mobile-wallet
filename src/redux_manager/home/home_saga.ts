import {put, takeLatest, take, cancel, delay} from 'redux-saga/effects';
import {types} from './home_action';
import {apis} from "services";
import {Config, Keys} from 'utils';

export function* getTokenInfoWithBalance(data: any) {
    try {
        // @ts-ignore
        const casperDashInfo = yield Config.getItem(Keys.casperdash);
        // @ts-ignore
        const token = yield Config.getItem(Keys.tokensAddressList);

        const params = {
            publicKey: (casperDashInfo && casperDashInfo.publicKey) || '',
            tokenAddress: token || [],
        };
        // @ts-ignore
        const response = yield apis.getTokenInfoWithBalanceAPI(params);
        if (response) {
            yield put({type: types.GET_TOKEN_INFO_WITH_BALANCE + '_SUCCESS', payload: response});
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

export function* watchGetTokenInfoWithBalance() {
    while (true) {
        // @ts-ignore
        const watcher = yield takeLatest(types.GET_TOKEN_INFO_WITH_BALANCE, getTokenInfoWithBalance);
        yield take(['LOGOUT', 'NETWORK']);
        yield cancel(watcher);
    }
}


export function* fetchCSPRMarketInfo(data: any) {
    try {
        yield put({type: types.FETCH_CSPR_MARKET_INFO + '_SUCCESS', payload: null});
        // @ts-ignore
        const response = yield apis.fetchCSPRMarketInfoAPI();
        if (response) {
            yield put({type: types.FETCH_CSPR_MARKET_INFO + '_SUCCESS', payload: response});
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

export function* watchFetchCSPRMarketInfo() {
    while (true) {
        // @ts-ignore
        const watcher = yield takeLatest(types.FETCH_CSPR_MARKET_INFO, fetchCSPRMarketInfo);
        yield take(['LOGOUT', 'NETWORK']);
        yield cancel(watcher);
    }
}

export function* getTokenAddressInfo(data: any) {
    try {
        yield put({type: types.GET_TOKEN_ADDRESS_INFO + '_SUCCESS', payload: null});
        // @ts-ignore
        const response = yield apis.getTokenAddressInfoAPI(data.params);
        if (response) {
            yield put({type: types.GET_TOKEN_ADDRESS_INFO + '_SUCCESS', payload: response});
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

export function* watchGetTokenAddressInfo() {
    while (true) {
        // @ts-ignore
        const watcher = yield takeLatest(types.GET_TOKEN_ADDRESS_INFO, getTokenAddressInfo);
        yield take(['LOGOUT', 'NETWORK']);
        yield cancel(watcher);
    }
}
