import { put, takeLatest, delay, take, cancel } from 'redux-saga/effects';

import { Config, Keys } from 'utils';

import { types as typesHome } from '../home/home_action';
import { types as typesStaking } from '../staking/staking_action';

import { types } from './main_action';

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
  const deploysTransfer = yield Config.getItem(Keys.deploysTransfer);
  // @ts-ignore
  const deploysStakes = yield Config.getItem(Keys.deploysStakes);

  const data = {
    casperdash: casperdash,
    tokensAddressList: tokensAddressList,
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
        types.INIT_APP_STATE,
      ],
      loadLocalStorage,
    );
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}
