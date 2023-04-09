import { put, takeLatest, take, cancel } from 'redux-saga/effects';
import { types } from './user_action';
import { types as mainTypes } from '../main/main_action';
import { apis } from 'services';
import { Config, Keys } from 'utils';
import { refreshActionStart, refreshActionStop, startAction, stopAction } from 'redux_manager/main/main_action';

export function* getAccounts(data: any) {
  try {
    yield put(
      data.params && data.params.refreshing ? refreshActionStart(types.GET_ACCOUNTS) : startAction(types.GET_ACCOUNTS),
    );

    const publicKeys =
      data?.params?.publicKeys?.map((key: { keyIndex: number; publicKey: string }) => key.publicKey) || [];
    // @ts-ignore
    const response = yield apis.getAccounts({
      publicKeys,
    });

    if (response) {
      yield put({
        type: types.GET_ACCOUNTS + '_SUCCESS',
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
  } finally {
    yield put(
      data.params && data.params.refreshing ? refreshActionStop(types.GET_ACCOUNTS) : stopAction(types.GET_ACCOUNTS),
    );
  }
}

export function* watchGetAccounts() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(types.GET_ACCOUNTS, getAccounts);
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}

export function* getSelectedWalletFromStorage() {
  // @ts-ignore
  const selectedWallet = yield Config.getItem(Keys.selectedWallet);

  yield put({
    type: types.GET_SELECTED_WALLET_SUCCESS,
    payload: selectedWallet,
  });
}

export function* watchLoadSelectedWallet() {
  yield takeLatest([types.LOAD_SELECTED_WALLET, mainTypes.INIT_APP_STATE], getSelectedWalletFromStorage);
}
