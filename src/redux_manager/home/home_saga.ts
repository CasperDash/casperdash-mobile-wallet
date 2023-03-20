import { put, takeLatest, take, cancel } from 'redux-saga/effects';
import { types } from './home_action';
import { types as userTypes } from '../user/user_action';

import { apis } from 'services';
import { Config, Keys } from 'utils';
import { refreshActionStart, refreshActionStop, startAction, stopAction } from 'redux_manager/main/main_action';

export function* getTokenInfoWithBalance(data: any) {
  try {
    yield put(
      data.params && data.params.refreshing
        ? refreshActionStart(types.GET_TOKEN_INFO_WITH_BALANCE)
        : startAction(types.GET_TOKEN_INFO_WITH_BALANCE),
    );
    if (data.params && data.params.skipAction) {
      yield put(
        data.params && data.params.refreshing
          ? refreshActionStop(types.GET_TOKEN_INFO_WITH_BALANCE)
          : stopAction(types.GET_TOKEN_INFO_WITH_BALANCE),
      );
    }
    // @ts-ignore
    const casperDashInfo = yield Config.getItem(Keys.casperdash);
    // @ts-ignore
    const token = yield Config.getItem(Keys.tokensAddressList);

    const params = {
      publicKey: data.params.publicKey ?? ((casperDashInfo && casperDashInfo.publicKey) || ''),
      tokenAddress: data.params.tokensAddressList ?? (token || []),
    };
    // @ts-ignore
    const response = yield apis.getTokenInfoWithBalanceAPI(params);
    if (response) {
      yield put({
        type: types.GET_TOKEN_INFO_WITH_BALANCE + '_SUCCESS',
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
        ? refreshActionStop(types.GET_TOKEN_INFO_WITH_BALANCE)
        : stopAction(types.GET_TOKEN_INFO_WITH_BALANCE),
    );
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
    yield put(
      data.params && data.params.refreshing
        ? refreshActionStart(types.FETCH_CSPR_MARKET_INFO)
        : startAction(types.FETCH_CSPR_MARKET_INFO),
    );
    // @ts-ignore
    const response = yield apis.fetchCSPRMarketInfoAPI();
    if (response) {
      yield put({
        type: types.FETCH_CSPR_MARKET_INFO + '_SUCCESS',
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
        ? refreshActionStop(types.FETCH_CSPR_MARKET_INFO)
        : stopAction(types.FETCH_CSPR_MARKET_INFO),
    );
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
    // @ts-ignore
    const response = yield apis.getTokenAddressInfoAPI(data.params);
    if (response) {
      yield put({
        type: types.GET_TOKEN_ADDRESS_INFO + '_SUCCESS',
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

export function* watchGetTokenAddressInfo() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(types.GET_TOKEN_ADDRESS_INFO, getTokenAddressInfo);
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}

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
  yield put({ type: userTypes.GET_ACCOUNT_INFORMATION });
  yield put({ type: types.FETCH_CSPR_MARKET_INFO });
  yield put({ type: types.GET_TOKEN_INFO_WITH_BALANCE });
}

export function* watchPushTransferToLocalStorage() {
  while (true) {
    // @ts-ignore
    const watcher = yield takeLatest(types.PUSH_TRANSFER_TO_LOCAL_STORAGE, pushTransferToLocalStorage);
    yield take(['LOGOUT', 'NETWORK']);
    yield cancel(watcher);
  }
}
