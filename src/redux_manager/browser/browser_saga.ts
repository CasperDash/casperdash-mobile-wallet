import { call, put, takeLatest } from 'redux-saga/effects';
import { Config, Keys } from 'utils';
import { types } from './browser_action';

function* updateConnectedSites({ payload }: any) {
  yield call(Config.saveItem, Keys.connectedSites, payload);

  yield put({
    type: types.UPDATE_CONNECTED_SITES_SUCCESS,
    payload,
  });
}

export function* watchUpdateConnectedSites() {
  yield takeLatest(types.UPDATE_CONNECTED_SITES, updateConnectedSites);
}

function* loadConnectedSites() {
  // @ts-ignore
  const payload = yield call(Config.getItem, Keys.connectedSites);

  yield put({
    type: types.UPDATE_CONNECTED_SITES_SUCCESS,
    payload,
  });
}

export function* watchLoadConnectedSites() {
  yield takeLatest(types.LOAD_CONNECTED_SITES, loadConnectedSites);
}
