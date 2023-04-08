import { put, takeLatest, take, cancel } from 'redux-saga/effects';
import { types } from './market_action';
import { apis } from 'services';

export function* getPriceHistory(data: any) {
  try {
    // @ts-ignore
    const response = yield apis.getPriceHistoryAPI(data.params);

    if (response) {
      yield put({
        type: types.GET_PRICE_HISTORY + '_SUCCESS',
        payload: response,
      });
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

export function* watchGetPriceHistory() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(types.GET_PRICE_HISTORY, getPriceHistory);
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}
