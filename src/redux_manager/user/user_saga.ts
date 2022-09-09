import { put, takeLatest, take, cancel, select } from 'redux-saga/effects';
import { types } from './user_action';
import { types as mainTypes } from '../main/main_action';
import { apis } from 'services';
import { Config, Keys } from 'utils';
import {
  refreshActionStart,
  refreshActionStop,
  startAction,
  stopAction,
} from 'redux_manager/main/main_action';
import { User, ValidationResult } from 'casper-storage';
import { getUser } from 'utils/selectors/user';

export function* getAccountInformation(data: any) {
  try {
    yield put(
      data.params && data.params.refreshing
        ? refreshActionStart(types.GET_ACCOUNT_INFORMATION)
        : startAction(types.GET_ACCOUNT_INFORMATION),
    );
    // @ts-ignore
    const casperDashInfo = yield Config.getItem(Keys.casperdash);
    // @ts-ignore
    const response = yield apis.getAccountInformation(
      data.params && data.params.publicKey
        ? data.params.publicKey
        : (casperDashInfo && casperDashInfo.publicKey) || '',
    );
    if (response) {
      yield put({
        type: types.GET_ACCOUNT_INFORMATION + '_SUCCESS',
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
      data.params && data.params.refreshing
        ? refreshActionStop(types.GET_ACCOUNT_INFORMATION)
        : stopAction(types.GET_ACCOUNT_INFORMATION),
    );
  }
}

export function* getAccounts(data: any) {
  try {
    yield put(
      data.params && data.params.refreshing
        ? refreshActionStart(types.GET_ACCOUNTS)
        : startAction(types.GET_ACCOUNTS),
    );

    const publicKeys =
      data?.params?.publicKeys?.map(
        (key: { keyIndex: number; publicKey: string }) => key.publicKey,
      ) || [];
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
      data.params && data.params.refreshing
        ? refreshActionStop(types.GET_ACCOUNTS)
        : stopAction(types.GET_ACCOUNTS),
    );
  }
}

export function* watchGetAccountInformation() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(
      [types.GET_ACCOUNT_INFORMATION, types.CHANGE_ACCOUNT],
      getAccountInformation,
    );
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
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

export function* getUserFromStorage() {
  // @ts-ignore
  const casperdash = yield Config.getItem(Keys.casperdash);
  let currentAccount = null;
  if (casperdash && casperdash.loginOptions?.hashingOptions) {
    const hashingOptions = casperdash.loginOptions.hashingOptions;
    const saltData = hashingOptions.salt?.data || [];
    const salt = new Uint8Array(saltData);
    const pin: string = yield Config.getItem(Keys.pinCode);

    currentAccount = User.deserializeFrom(pin, casperdash?.userInfo ?? '', {
      passwordOptions: {
        passwordValidator: () => new ValidationResult(true),
        ...hashingOptions,
        salt: salt,
      },
    });
  }
  yield put({ type: types.LOAD_USER_SUCCESS, payload: currentAccount });
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
  yield takeLatest(
    [types.LOAD_SELECTED_WALLET, mainTypes.INIT_APP_STATE],
    getSelectedWalletFromStorage,
  );
}

export function* watchGetUserFromStorage() {
  // @ts-ignore
  const user = yield select(getUser);
  if (!user) {
    yield takeLatest(mainTypes.INIT_APP_STATE, getUserFromStorage);
  }
}
