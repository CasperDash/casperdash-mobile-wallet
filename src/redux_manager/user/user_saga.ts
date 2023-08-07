import { put, takeLatest } from 'redux-saga/effects';

import { Config, Keys } from 'utils';

import { types as mainTypes } from '../main/main_action';

import { types } from './user_action';

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
