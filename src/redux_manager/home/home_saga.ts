import { put, takeLatest, take, cancel } from 'redux-saga/effects';
import { types } from './home_action';

import { apis } from 'services';
import { Config, Keys } from 'utils';

export function* deploy(data: any) {
  try {
    // @ts-ignore
    const response = yield apis.deployAPI(data.params);
    if (response) {
      yield put({ type: types.DEPLOY + '_SUCCESS', payload: response });
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

export function* watchDeploy() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(types.DEPLOY, deploy);
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}

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
