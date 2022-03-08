import { put, takeLatest, delay, take, cancel } from 'redux-saga/effects';
import { types } from './main_action';
import { Config, Keys } from 'utils';
import { apis } from 'services';
import { types as typesHome } from '../home/home_action';
import { types as typesStaking } from '../staking/staking_action';

export function* showMessage(data: any) {
  yield put({ type: types.SHOW_MESSAGE_SUCCESS, payload: data.message });
  yield delay(data.duration ?? 2000);
  yield put({ type: types.SHOW_MESSAGE_SUCCESS, payload: null });
}

export function* watchShowMessage() {
  yield takeLatest(types.SHOW_MESSAGE, showMessage);
}

export function* loadLocalStorage() {
  // @ts-ignore
  const casperdash = yield Config.getItem(Keys.casperdash);
  // @ts-ignore
  const tokensAddressList = yield Config.getItem(Keys.tokensAddressList);
  // @ts-ignore
  const configurations = yield Config.getItem(Keys.configurations);
  // @ts-ignore
  const deploysTransfer = yield Config.getItem(Keys.deploysTransfer);
  // @ts-ignore
  const deploysStakes = yield Config.getItem(Keys.deploysStakes);

  if (!configurations) {
    yield put({ type: types.GET_CONFIGURATIONS });
  }
  const data = {
    casperdash: casperdash,
    tokensAddressList: tokensAddressList,
    configurations: configurations,
    deploysTransfer: deploysTransfer,
    deploysStakes: deploysStakes,
  };
  yield put({ type: types.LOAD_LOCAL_STORAGE_SUCCESS, payload: data });
}

export function* watchLoadLocalStorage() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(
      [
        types.LOAD_LOCAL_STORAGE,
        typesHome.PUSH_TRANSFER_TO_LOCAL_STORAGE_SUCCESS,
        typesStaking.PUSH_STAKE_TO_LOCAL_STORAGE_SUCCESS,
      ],
      loadLocalStorage,
    );
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}

export function* getConfigurations(data: any) {
  try {
    // @ts-ignore
    const response = yield apis.getConfigurationsAPI();
    if (response) {
      yield put({ type: types.GET_CONFIGURATIONS_SUCCESS, payload: response });
      yield Config.saveItem(Keys.configurations, response);
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

export function* watchGetConfigurations() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(
      types.GET_CONFIGURATIONS,
      getConfigurations,
    );
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}
