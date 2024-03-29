import { put, takeLatest, take, cancel } from 'redux-saga/effects';
import { types } from './home_action';

import { Config, Keys } from 'utils';

export function* pushTransferToLocalStorage(data: any) {
  const { publicKey, transfer } = data;
  // @ts-ignore
  let deploysTransfer = yield Config.getItem(Keys.deploysTransfer);
  deploysTransfer = deploysTransfer || {};
  if (deploysTransfer && deploysTransfer[publicKey]) {
    const listTransfer = deploysTransfer[publicKey] || [];
    listTransfer.push(transfer);
    deploysTransfer[publicKey] = listTransfer;
  } else {
    deploysTransfer[publicKey] = [{ ...transfer }];
  }
  yield Config.saveItem(Keys.deploysTransfer, deploysTransfer);
  yield put({
    type: types.PUSH_TRANSFER_TO_LOCAL_STORAGE_SUCCESS,
    payload: deploysTransfer,
  });
}

export function* watchPushTransferToLocalStorage() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(types.PUSH_TRANSFER_TO_LOCAL_STORAGE, pushTransferToLocalStorage);
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}
